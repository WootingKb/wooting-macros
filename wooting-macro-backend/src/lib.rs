pub mod config;
mod hid_table;
pub mod plugin;

use rayon::prelude::*;

use log::*;

use itertools::Itertools;

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::{thread, time};

use tokio::sync::mpsc::{UnboundedReceiver, UnboundedSender};
use tokio::sync::RwLock;
use tokio::task;

use halfbrown::HashMap;

use config::{ApplicationConfig, ConfigFile};
#[cfg(not(debug_assertions))]
use dirs;

// This has to be imported for release build
#[allow(unused_imports)]
use crate::config::CONFIG_DIR;
use crate::hid_table::*;

//Plugin imports
use crate::plugin::delay;
#[allow(unused_imports)]
use crate::plugin::discord;
use crate::plugin::key_press;
use crate::plugin::mouse;
#[allow(unused_imports)]
use crate::plugin::obs;
use crate::plugin::phillips_hue;
use crate::plugin::system_event;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
/// Type of a macro. Currently only Single is implemented. Others have been postponed for now.
///
/// ! **UNIMPLEMENTED** - Only the `Single` macro type is implemented for now. Feel free to contribute ideas.
pub enum MacroType {
    Single,
    // Single macro fire
    Toggle,
    // press to start, press to finish cycle and terminate
    OnHold, // while held Execute macro (repeats)
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(tag = "type")]
/// This enum is the registry for all actions that can be executed.
pub enum ActionEventType {
    KeyPressEventAction {
        data: key_press::KeyPress,
    },
    SystemEventAction {
        data: system_event::SystemAction,
    },
    //Paste, Run commandline program (terminal run? standard user?), audio, open file-manager, workspace switch left, right,
    //IDEA: System event - notification
    PhillipsHueEventAction {
        data: phillips_hue::PhillipsHueStatus,
    },
    //IDEA: Phillips hue notification
    OBSEventAction {},

    DiscordEventAction {},
    //IDEA: IKEADesk
    MouseEventAction {
        data: mouse::MouseAction,
    },
    //IDEA: Sound effects? Soundboards?
    //IDEA: Sending a message through online webapi (twitch)
    DelayEventAction {
        data: delay::Delay,
    },
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(tag = "type")]
/// This enum is the registry for all incoming actions that can be analyzed for macro execution.
///
/// ! **UNIMPLEMENTED** - Allow while other keys has not been implemented yet. This is WIP already.
pub enum TriggerEventType {
    KeyPressEvent {
        data: Vec<u32>,
        allow_while_other_keys: bool,
    },
    MouseEvent {
        data: mouse::MouseButton,
    },
    //IDEA: computer time (have timezone support?)
    //IDEA: computer temperature?
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
/// This is a macro struct. Includes all information a macro needs to run.
pub struct Macro {
    pub name: String,
    pub icon: String,
    pub sequence: Vec<ActionEventType>,
    pub macro_type: MacroType,
    pub trigger: TriggerEventType,
    pub active: bool,
}

impl Macro {
    /// This function is used to execute a macro. It is called by the macro checker.
    /// It spawns async tasks to execute said events specifically.
    /// Make sure to expand this if you implement new action types.
    async fn execute(&self, send_channel: UnboundedSender<rdev::EventType>) {
        for action in &self.sequence {
            match action {
                ActionEventType::KeyPressEventAction { data } => match data.keytype {
                    key_press::KeyType::Down => {
                        send_channel
                            .send(rdev::EventType::KeyPress(SCANCODE_TO_RDEV[&data.keypress]))
                            .unwrap();
                    }
                    key_press::KeyType::Up => {
                        send_channel
                            .send(rdev::EventType::KeyRelease(
                                SCANCODE_TO_RDEV[&data.keypress],
                            ))
                            .unwrap();
                    }
                    key_press::KeyType::DownUp => {
                        send_channel
                            .send(rdev::EventType::KeyPress(SCANCODE_TO_RDEV[&data.keypress]))
                            .unwrap();

                        tokio::time::sleep(time::Duration::from_millis(data.press_duration)).await;

                        send_channel
                            .send(rdev::EventType::KeyRelease(
                                SCANCODE_TO_RDEV[&data.keypress],
                            ))
                            .unwrap();
                    }
                },
                ActionEventType::PhillipsHueEventAction { .. } => {}
                ActionEventType::OBSEventAction { .. } => {}
                ActionEventType::DiscordEventAction { .. } => {}
                ActionEventType::DelayEventAction { data } => {
                    tokio::time::sleep(time::Duration::from_millis(*data)).await;
                }

                ActionEventType::SystemEventAction { data } => {
                    let action_copy = data.clone();
                    let channel_copy = send_channel.clone();
                    task::spawn(async move { action_copy.execute(channel_copy).await });
                }
                ActionEventType::MouseEventAction { data } => {
                    let action_copy = data.clone();
                    let channel_copy = send_channel.clone();
                    task::spawn(async move { action_copy.execute(channel_copy).await });
                }
            }
        }
    }
}

/// Collections are groups of macros.
type Collections = Vec<Collection>;

/// Hashmap to check the first trigger key of each macro.
type MacroTriggerLookup = HashMap<u32, Vec<Macro>>;

/// State of the application in RAM (RWlock).
#[derive(Debug)]
pub struct MacroBackend {
    pub data: Arc<RwLock<MacroData>>,
    pub config: Arc<RwLock<ApplicationConfig>>,
    pub triggers: Arc<RwLock<MacroTriggerLookup>>,
    pub is_listening: Arc<AtomicBool>,
    pub display_list: Arc<RwLock<Vec<system_event::Monitor>>>,
}

///MacroData is the main data structure that contains all macro data.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct MacroData {
    pub data: Collections,
}

impl Default for MacroData {
    fn default() -> Self {
        MacroData {
            data: vec![Collection {
                name: "Collection 1".to_string(),
                icon: ":smile:".to_string(),
                macros: vec![],
                active: true,
            }],
        }
    }
}

impl MacroData {
    /// Extracts the first trigger data from the macros.
    pub fn extract_triggers(&self) -> MacroTriggerLookup {
        let mut output_hashmap = MacroTriggerLookup::new();

        for collections in &self.data {
            if collections.active {
                for macros in &collections.macros {
                    if macros.active {
                        match &macros.trigger {
                            TriggerEventType::KeyPressEvent { data, .. } => {
                                //TODO: optimize using references
                                match data.len() {
                                    0 => error!("A trigger key can't be zero...: {:#?}", data),
                                    1 => output_hashmap
                                        .entry(*data.first().unwrap())
                                        .or_default()
                                        .push(macros.clone()),
                                    _ => data[..data.len() - 1].iter().for_each(|x| {
                                        output_hashmap.entry(*x).or_default().push(macros.clone());
                                    }),
                                }
                            }
                            TriggerEventType::MouseEvent { data } => {
                                // let data: u32 = *<&mouse::MouseButton as Into<&u32>>::into(data);
                                let data: u32 = data.into();

                                match output_hashmap.get_mut(&data) {
                                    Some(value) => value.push(macros.clone()),
                                    None => {
                                        output_hashmap.insert_nocheck(data, vec![macros.clone()])
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        output_hashmap
    }
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
/// Collection struct that defines what a group of macros looks like and what properties it carries
pub struct Collection {
    pub name: String,
    pub icon: String,
    pub macros: Vec<Macro>,
    pub active: bool,
}

/// Executes a given macro (according to its type).
///
/// ! **UNIMPLEMENTED** - Only Single macro type is implemented for now.
async fn execute_macro(macros: Macro, channel: UnboundedSender<rdev::EventType>) {
    match macros.macro_type {
        MacroType::Single => {
            info!("\nEXECUTING A SINGLE MACRO: {:#?}", macros.name);

            let cloned_channel = channel;

            task::spawn(async move {
                macros.execute(cloned_channel).await;
            });
        }
        MacroType::Toggle => {
            //Postponed
            //execute_macro_toggle(&macros).await;
        }
        MacroType::OnHold => {
            //Postponed
            //execute_macro_onhold(&macros).await;
        }
    }
}

/// Receives and executes a macro based on the trigger event.
/// Puts a mandatory 0-20 ms delay between each macro execution (depending on the platform).
fn keypress_executor_sender(mut rchan_execute: UnboundedReceiver<rdev::EventType>) {
    loop {
        plugin::util::send(&rchan_execute.blocking_recv().unwrap());

        //Windows requires a delay between each macro execution.
        #[cfg(any(target_os = "macos", target_os = "linux"))]
        thread::sleep(time::Duration::from_millis(10));

        //MacOS requires some strange delays so putting it here just in case.
        #[cfg(target_os = "windows")]
        thread::sleep(time::Duration::from_millis(1));
    }
}

/// A more efficient way using hashtable to check whether the trigger keys match the macro.
///
/// `pressed_events` - the keys pressed in HID format (use the conversion HID hashtable to get the number).
///
/// `trigger_overview` - Macros that need to be checked. Should be picked by matching the hashtable of triggers, and those should be checked here.
///
/// `channel_sender` - a copy of the channel sender to use later when executing various macros.
fn check_macro_execution_efficiently(
    pressed_events: Vec<u32>,
    trigger_overview: Vec<Macro>,
    channel_sender: UnboundedSender<rdev::EventType>,
) -> bool {
    let trigger_overview_print = trigger_overview.clone();

    trace!("Got data: {:?}", trigger_overview_print);
    trace!("Got keys: {:?}", pressed_events);

    let mut output = false;
    for macros in &trigger_overview {
        match &macros.trigger {
            TriggerEventType::KeyPressEvent { data, .. } => {
                match data.len() {
                    1 => {
                        if pressed_events == *data {
                            debug!("MATCHED MACRO singlekey: {:#?}", pressed_events);

                            let channel_clone_execute = channel_sender.clone();
                            let macro_clone_execute = macros.clone();

                            plugin::util::lift_keys(data, &channel_clone_execute);

                            task::spawn(async move {
                                execute_macro(macro_clone_execute, channel_clone_execute).await;
                            });
                            output = true;
                        }
                    }
                    2..=4 => {
                        // This check makes sure the modifier keys (up to 3 keys in each trigger) can be of any order, and ensures the last key must match to the proper one.
                        if data[..(data.len() - 1)]
                            .iter()
                            .all(|x| pressed_events[..(pressed_events.len() - 1)].contains(x))
                            && pressed_events[pressed_events.len() - 1] == data[data.len() - 1]
                        {
                            debug!("MATCHED MACRO multikey: {:#?}", pressed_events);

                            let channel_clone_execute = channel_sender.clone();
                            let macro_clone_execute = macros.clone();

                            plugin::util::lift_keys(data, &channel_clone_execute);

                            task::spawn(async move {
                                execute_macro(macro_clone_execute, channel_clone_execute).await;
                            });
                            output = true;
                        }
                    }
                    _ => (),
                }
            }
            TriggerEventType::MouseEvent { data } => {
                let event_to_check: Vec<u32> = vec![data.into()];

                trace!(
                    "CheckMacroExec: Converted mouse buttons to vec<u32>\n {:#?}",
                    event_to_check
                );

                if event_to_check == pressed_events {
                    let channel_clone = channel_sender.clone();
                    let macro_clone = macros.clone();

                    task::spawn(async move {
                        execute_macro(macro_clone, channel_clone).await;
                    });
                    output = true;
                }
            }
        }
    }

    output
}

impl MacroBackend {
    /// Creates the data directory if not present in %appdata% (only in release build).
    pub fn generate_directories() {
        #[cfg(not(debug_assertions))]
        match std::fs::remove_file(config::LogFileName::file_name()) {
            Ok(_) => info!("removed old log file"),
            Err(error) => error!("Couldnt remove old log file!: {}", error),
        }

        #[cfg(not(debug_assertions))]
        match std::fs::create_dir_all(dirs::config_dir().unwrap().join(CONFIG_DIR).as_path()) {
            Ok(x) => x,
            Err(error) => error!("Directory creation failed, OS error: {}", error),
        };
    }

    /// Sets whether the backend should process keys that it listens to. Disabling disables the processing logic, but the app still grabs the keys.
    pub fn set_is_listening(&self, is_listening: bool) {
        self.is_listening.store(is_listening, Ordering::Relaxed);
    }
    /// Sets the macros from the frontend to the files. This function is here to completely split the frontend off.
    pub async fn set_macros(&self, macros: MacroData) {
        macros.write_to_file();
        *self.triggers.write().await = macros.extract_triggers();
        *self.data.write().await = macros;
    }

    /// Sets the config from the frontend to the files. This function is here to completely split the frontend off.
    pub async fn set_config(&self, config: ApplicationConfig) {
        config.write_to_file();
        *self.config.write().await = config;
    }

    /// Initializes the entire backend and gets the whole grabbing system running.
    pub async fn init(&self) {
        //? : io-uring async read files and write files
        //TODO: implement drop when the application ends to clean up the downed keys

        //==================================================

        let inner_triggers = self.triggers.clone();
        let inner_is_listening = self.is_listening.clone();

        // Spawn the channels
        let (schan_execute, rchan_execute) = tokio::sync::mpsc::unbounded_channel();

        //Create the executor
        thread::spawn(move || {
            keypress_executor_sender(rchan_execute);
        });

        let _grabber = task::spawn_blocking(move || {
            let keys_pressed: Arc<RwLock<Vec<rdev::Key>>> = Arc::new(RwLock::new(vec![]));

            rdev::grab(move |event: rdev::Event| {
                if inner_is_listening.load(Ordering::Relaxed) {
                    match event.event_type {
                        rdev::EventType::KeyPress(key) => {
                            debug!("Key Pressed RAW: {:?}", key);
                            let key_to_push = key;

                            // https://doc.rust-lang.org/std/collections/struct.HashSet.html
                            // benchmark

                            let pressed_keys_copy_converted: Vec<u32> = {
                                let mut keys_pressed = keys_pressed.blocking_write();

                                keys_pressed.push(key_to_push);

                                *keys_pressed = keys_pressed.clone().into_iter().unique().collect();

                                keys_pressed
                                    .iter()
                                    .map(|x| *SCANCODE_TO_HID.get(x).unwrap_or(&0))
                                    .collect()
                            };

                            debug!(
                                "Pressed Keys CONVERTED TO HID:  {:?}",
                                pressed_keys_copy_converted
                            );
                            debug!(
                                "Pressed Keys CONVERTED TO RDEV: {:?}",
                                pressed_keys_copy_converted
                                    .par_iter()
                                    .map(|x| *SCANCODE_TO_RDEV
                                        .get(x)
                                        .unwrap_or(&rdev::Key::Unknown(0)))
                                    .collect::<Vec<rdev::Key>>()
                            );

                                    

                            let first_key: u32 = match pressed_keys_copy_converted.first() {
                                None => 0,
                                Some(data_first) => *data_first,
                            };

                            let trigger_list = inner_triggers.blocking_read().clone();

                            let check_these_macros = match trigger_list.get(&first_key) {
                                None => {
                                    vec![]
                                }
                                Some(data_found) => data_found.to_vec(),
                            };

                            // ? up the pressed keys here immidiately?

                            let should_grab = {
                                if !check_these_macros.is_empty() {
                                    let channel_copy_send = schan_execute.clone();
                                    check_macro_execution_efficiently(
                                        pressed_keys_copy_converted,
                                        check_these_macros,
                                        channel_copy_send,
                                    )
                                } else {
                                    false
                                }
                            };

                            if should_grab {
                                None
                            } else {
                                Some(event)
                            }
                        }

                        rdev::EventType::KeyRelease(key) => {
                            keys_pressed.blocking_write().retain(|x| *x != key);

                            debug!("Key state: {:?}", keys_pressed.blocking_read());

                            Some(event)
                        }

                        rdev::EventType::ButtonPress(button) => {
                            debug!("Button pressed: {:?}", button);

                            let converted_button_to_u32: u32 =
                                BUTTON_TO_HID.get(&button).unwrap_or(&0x101).to_owned();

                            debug!("Pressed button: {:?}", buttons_pressed.blocking_read());

                            let trigger_list = inner_triggers.blocking_read().clone();

                            let check_these_macros =
                                match trigger_list.get(&converted_button_to_u32) {
                                    None => {
                                        vec![]
                                    }
                                    Some(data_found) => data_found.to_vec(),
                                };

                            let channel_clone = schan_execute.clone();

                            let should_grab = check_macro_execution_efficiently(
                                vec![converted_button_to_u32],
                                check_these_macros,
                                channel_clone,
                            );

                            if should_grab {
                                None
                            } else {
                                Some(event)
                            }
                        }
                        rdev::EventType::ButtonRelease(button) => {
                            debug!("Button released: {:?}", button);

                            buttons_pressed.blocking_write().retain(|x| *x != button);

                            Some(event)
                        }
                        rdev::EventType::MouseMove { .. } => Some(event),
                        rdev::EventType::Wheel { .. } => Some(event),
                    }
                } else {
                    debug!(
                        "Passing event through... macro recording disabled: {:?}",
                        event
                    );

                    Some(event)
                }
            })
        });
    }
}

impl Default for MacroBackend {
    /// Generates a new state.
    fn default() -> Self {
        let macro_data = MacroData::read_data();
        let triggers = macro_data.extract_triggers();
        MacroBackend {
            data: Arc::new(RwLock::from(macro_data)),
            config: Arc::new(RwLock::from(ApplicationConfig::read_data())),
            triggers: Arc::new(RwLock::from(triggers)),
            is_listening: Arc::new(AtomicBool::new(true)),
            display_list: Arc::new(RwLock::from(vec![])),
        }
    }
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
