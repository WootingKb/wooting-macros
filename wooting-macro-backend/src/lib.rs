#[cfg(not(debug_assertions))]
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::{thread, time};

use anyhow::{Error, Result};
#[cfg(not(debug_assertions))]
use dirs;
use halfbrown::HashMap;
use itertools::Itertools;
use log::*;
use rayon::prelude::*;
use rdev::simulate;
use tokio::sync::mpsc::{UnboundedReceiver, UnboundedSender};
use tokio::sync::RwLock;
use tokio::task;

use uuid::Uuid;

use halfbrown::HashMap;

use config::{ApplicationConfig, ConfigFile};
#[cfg(not(debug_assertions))]
use dirs;
#[cfg(not(debug_assertions))]
use std::path::PathBuf;

use anyhow::{Error, Result};

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

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Eq)]
/// Type of a macro. Currently only Single is implemented. Others have been postponed for now.
///
/// ! **UNIMPLEMENTED** - Only the `Single` macro type is implemented for now. Feel free to contribute ideas.
pub enum MacroType {
    // Single macro fire
    Single,
    // press to start, press to finish cycle and terminate
    Toggle,
    // while held Execute macro (repeats)
    OnHold,
    // X amount of times repeat
    RepeatX, //  Unused currently
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
    pub enabled: bool,
    pub is_running: bool,
}

impl Macro {
    /// This function is used to execute a macro. It is called by the macro checker.
    /// It spawns async tasks to execute said events specifically.
    /// Make sure to expand this if you implement new action types.
    async fn execute(&self, send_channel: UnboundedSender<rdev::EventType>) -> Result<()> {
        for action in &self.sequence {
            match action {
                ActionEventType::KeyPressEventAction { data } => match data.keytype {
                    key_press::KeyType::Down => {
                        // One key press down
                        send_channel
                            .send(rdev::EventType::KeyPress(SCANCODE_TO_RDEV[&data.keypress]))?;
                    }
                    key_press::KeyType::Up => {
                        // One key lift up
                        send_channel.send(rdev::EventType::KeyRelease(
                            SCANCODE_TO_RDEV[&data.keypress],
                        ))?;
                    }
                    key_press::KeyType::DownUp => {
                        // Key press
                        send_channel
                            .send(rdev::EventType::KeyPress(SCANCODE_TO_RDEV[&data.keypress]))?;

                        // Wait the set delay by user
                        tokio::time::sleep(time::Duration::from_millis(data.press_duration)).await;

                        // Lift the key
                        send_channel.send(rdev::EventType::KeyRelease(
                            SCANCODE_TO_RDEV[&data.keypress],
                        ))?;
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
        Ok(())
    }
}

/// Collections are groups of macros.
type Collections = Vec<Collection>;

#[derive(Debug, Default)]
/// Hashmap to check the first trigger key of each macro.
pub struct MacroLookup {
    triggers: MacroTrigger,
    id_map: MacroIdList,
}

/// Macro trigger list to lookup macro IDs via their trigger.
type MacroTrigger = HashMap<u32, Vec<String>>;

/// Macro ID list to lookup macros uniquely and fast.
pub type MacroIdList = HashMap<String, Macro>;

/// State of the application in RAM (RWlock).
#[derive(Debug)]
pub struct MacroBackend {
    pub macro_data: Arc<RwLock<MacroData>>,
    pub config: Arc<RwLock<ApplicationConfig>>,
    pub macro_lookup: Arc<RwLock<MacroLookup>>,
    // pub macro_execute_queue: Arc<RwLock<Vec<String>>>,
    pub is_listening: Arc<AtomicBool>,
    pub keys_pressed: Arc<RwLock<Vec<rdev::Key>>>,
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
                enabled: true,
            }],
        }
    }
}

impl MacroData {
    /// Extracts the first trigger data from the macros, and pairs UUIDs to macros
    pub fn new_lookup(&self) -> Result<MacroLookup> {
        let mut macro_lookup = MacroLookup::default();

        for collections in &self.data {
            if collections.enabled {
                for macros in &collections.macros {
                    if macros.enabled {
                        // Get uuid also for later use so we don't have to reverse lookup.
                        let mut unique_id: String;

                        loop {
                            unique_id = Uuid::new_v4().to_string();

                            if macro_lookup.id_map.get(&unique_id).is_none() {
                                macro_lookup
                                    .id_map
                                    .insert(unique_id.clone(), macros.clone());
                                break;
                            }
                        }

                        match &macros.trigger {
                            TriggerEventType::KeyPressEvent { data, .. } => {
                                //TODO: optimize using references
                                match data.len() {
                                    0 => {
                                        return Err(Error::msg(format!("A trigger key can't be zero, aborting trigger generation: {:#?}", data).to_string()));
                                    }
                                    1 => {
                                        let first_data = match data.first() {
                                            Some(data) => *data,
                                            None => {
                                                return Err(Error::msg(
                                                    "Error getting first element in macro trigger",
                                                ));
                                            }
                                        };
                                        trace!(
                                            "Generated UUID {} and inserting macro: {:?}",
                                            unique_id,
                                            macros
                                        );

                                        macro_lookup
                                            .triggers
                                            .entry(first_data)
                                            .or_default()
                                            .push(unique_id.clone())
                                    }
                                    _ => data[..data.len() - 1].iter().for_each(|x| {
                                        trace!(
                                            "Generated UUID {} and inserting macro: {:?}",
                                            unique_id,
                                            macros
                                        );
                                        macro_lookup
                                            .triggers
                                            .entry(*x)
                                            .or_default()
                                            .push(unique_id.clone());
                                    }),
                                }
                            }
                            TriggerEventType::MouseEvent { data } => {
                                let data: u32 = data.into();

                                match macro_lookup.triggers.get_mut(&data) {
                                    Some(value) => value.push(unique_id.clone()),
                                    None => macro_lookup
                                        .triggers
                                        .insert_nocheck(data, vec![unique_id.clone()]),
                                }
                            }
                        }
                    }
                }
            }
        }

        Ok(macro_lookup)
    }
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
/// Collection struct that defines what a group of macros looks like and what properties it carries
pub struct Collection {
    pub name: String,
    pub icon: String,
    pub macros: Vec<Macro>,
    pub enabled: bool,
}

/// Executes a given macro (according to its type).
///
/// ! **UNIMPLEMENTED** - Only Single macro type is implemented for now.
async fn execute_macro(mut macros: Macro, channel: UnboundedSender<rdev::EventType>) {
    match macros.macro_type {
        MacroType::Single => {
            info!("\nEXECUTING A SINGLE MACRO: {:#?}", macros.name);

            let cloned_channel = channel;

            task::spawn(async move {
                macros
                    .execute(cloned_channel)
                    .await
                    .unwrap_or_else(|err| error!("Error executing macro: {}", err));
            });
        }
        MacroType::Toggle => {
            if macros.is_running == false {
                macros.is_running = true;
                let cloned_channel = channel;

                task::spawn(async move {
                    macros
                        .execute(cloned_channel)
                        .await
                        .unwrap_or_else(|err| error!("Error executing macro: {}", err));
                });
            }
        }

        MacroType::OnHold => {
            //Postponed
            //execute_macro_onhold(&macros).await;
        }
        MacroType::RepeatX => {
            //Postponed
        }
    }
}

/// Receives and executes a macro based on the trigger event.
/// Puts a mandatory 0-20 ms delay between each macro execution (depending on the platform).
fn keypress_executor_receiver(mut rchan_execute: UnboundedReceiver<rdev::EventType>) {
    loop {
        let received_event = match &rchan_execute.blocking_recv() {
            Some(event) => *event,
            None => {
                trace!("Failed to receive an event!");
                continue;
            }
        };
        plugin::util::direct_send_event(&received_event)
            .unwrap_or_else(|err| error!("Error directly sending an event to keyboard: {}", err));

        //MacOS and Linux require a delay between each macro execution.
        #[cfg(not(target_os = "windows"))]
        thread::sleep(time::Duration::from_millis(10));
    }
}

fn macro_executor_receiver(
    mut rchan_execute: UnboundedReceiver<String>,
    macro_id_list: Arc<RwLock<MacroLookup>>,
    schan_keypress_execute: UnboundedSender<rdev::EventType>,
) {
    let mut macro_queue: Vec<Macro> = Vec::default();

    loop {
        if let Ok(macro_id) = &rchan_execute.try_recv() {
            match macro_id_list.blocking_read().id_map.get(macro_id) {
                Some(macro_to_execute) => {
                    // If a macro is already there, remove it. This should remove a togggle macro correctly.
                    // Single and repeat types should be removed after execution.

                    if macro_queue.iter().any(|x| x.name == macro_to_execute.name) {
                        macro_queue.retain(|x| x.name != macro_to_execute.name);
                    } else {
                        macro_queue.push(macro_to_execute.clone())
                    }
                }
                None => {
                    error!("Cannot find macro to execute! ID: {}", macro_id);
                    continue;
                }
            };
        }

        // Execute the queue
        if !macro_queue.is_empty() {
            for (_, macro_item) in macro_queue.clone().iter().enumerate() {
                let channel_clone = schan_keypress_execute.clone();
                let macro_clone = macro_item.clone();

                // TODO: This is currently unimplemented
                let mut repeat_x = 1;

                if macro_item.macro_type == MacroType::RepeatX {
                    repeat_x = 3;
                }

                task::spawn(async move {
                    for _ in 0..=repeat_x {
                        let macro_clone_inner = macro_clone.clone();
                        let channel_clone_inner = channel_clone.clone();
                        execute_macro(macro_clone_inner, channel_clone_inner).await;
                    }
                });

                // If the macro is not a toggle macro, remove it from the queue.
                if macro_item.macro_type == MacroType::Single
                    || macro_item.macro_type == MacroType::RepeatX
                {
                    macro_queue.retain(|x| x.name != macro_item.name);
                }
            }
        }

        // TODO: Do this part
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
    check_macros: Vec<String>,
    macro_data: Arc<RwLock<MacroLookup>>,
    macro_channel_sender: UnboundedSender<String>,
) -> bool {
    let trigger_overview_print = check_macros.clone();
    let macro_data_id_map_cloned = macro_data.blocking_read().id_map.clone();

    trace!("Got data: {:?}", trigger_overview_print);
    trace!("Got keys: {:?}", pressed_events);
    let mut output = false;

    for (macro_id, macros) in check_macros
        .iter()
        .map(|id| (id.clone(), macro_data_id_map_cloned.get(id).unwrap()))
    {
        // Must be cloned here otherwise Rust will cry

        let macro_sender = macro_channel_sender.clone();
        match &macros.trigger {
            TriggerEventType::KeyPressEvent { data, .. } => {
                match data.len() {
                    1 => {
                        if pressed_events == *data {
                            debug!("MATCHED MACRO single key: {:#?}", pressed_events);

                            let id_cloned = macro_id.clone();
                            // Disabled until a better fix is done
                            // plugin::util::lift_keys(data, &channel_clone_execute);

                            task::spawn(async move {
                                macro_sender.send(id_cloned).unwrap();
                                // execute_macro(macro_clone_execute, channel_clone_execute).await;
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
                            debug!("MATCHED MACRO multi key: {:#?}", pressed_events);
                            let id_cloned = macro_id.clone();
                            // Disabled until a better fix is done
                            // plugin::util::lift_keys(data, &channel_clone_execute);

                            task::spawn(async move {
                                macro_sender.send(id_cloned).unwrap();
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
                    let id_cloned = macro_id.clone();

                    task::spawn(async move {
                        macro_sender.send(id_cloned).unwrap();
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
    pub fn generate_directories() -> Result<()> {
        #[cfg(not(debug_assertions))]
        {
            let conf_dir: Result<PathBuf> = match dirs::config_dir() {
                Some(config_path) => Ok(config_path),
                None => Err(anyhow::Error::msg(
                    "Cannot find config directory, cannot proceed.",
                )),
            };

            let conf_dir = conf_dir?.join(CONFIG_DIR);

            std::fs::create_dir_all(conf_dir.as_path())?;
        }
        Ok(())
    }

    /// Sets whether the backend should process keys that it listens to. Disabling disables the processing logic, but the app still grabs the keys.
    pub fn set_is_listening(&self, is_listening: bool) {
        self.is_listening.store(is_listening, Ordering::Relaxed);
    }
    /// Sets the macros from the frontend to the files. This function is here to completely split the frontend off.
    pub async fn set_macros(&self, macros: MacroData) -> Result<()> {
        macros.write_to_file()?;
        *self.macro_lookup.write().await = macros.new_lookup()?;

        debug!(
            "Listing macros ID list:\n{:#?}",
            self.macro_lookup.read().await.id_map
        );

        *self.macro_data.write().await = macros;
        Ok(())
    }

    /// Sets the config from the frontend to the files. This function is here to completely split the frontend off.
    pub async fn set_config(&self, config: ApplicationConfig) -> Result<()> {
        config.write_to_file()?;
        *self.config.write().await = config;
        Ok(())
    }

    /// Initializes the entire backend and gets the whole grabbing system running.
    pub async fn init(&self) -> Result<()> {
        //? : io-uring async read files and write files
        //TODO: implement drop when the application ends to clean up the downed keys

        //==================================================

        let inner_is_listening = self.is_listening.clone();
        let inner_keys_pressed = self.keys_pressed.clone();
        let inner_macro_lookup = self.macro_lookup.clone();

        // Spawn the channels
        let (schan_keypress_execute, rchan_keypress_execute) =
            tokio::sync::mpsc::unbounded_channel();
        let (schan_macro_execute, rchan_macro_execute) = tokio::sync::mpsc::unbounded_channel();

        // Create the keypress executor
        thread::spawn(move || {
            keypress_executor_receiver(rchan_keypress_execute);
        });

        let inner_macro_lookup_clone = inner_macro_lookup.clone();
        //let inner_macro_lookup_clone = inner_macro_lookup.clone();
        // Create the macro executor
        thread::spawn(move || {
            macro_executor_receiver(
                rchan_macro_execute,
                inner_macro_lookup_clone,
                schan_keypress_execute,
            );
        });

        let _grabber = task::spawn_blocking(move || {
            *inner_keys_pressed.blocking_write() = vec![];

            rdev::grab(move |event: rdev::Event| {
                if inner_is_listening.load(Ordering::Relaxed) {
                    match event.event_type {
                        rdev::EventType::KeyPress(key) => {
                            debug!("Key Pressed RAW: {:?}", key);

                            let keys_pressed_internal_hid: Vec<u32> = {
                                // keys_pressed.blocking_write = keys_pressed.0.blocking_write();

                                inner_keys_pressed.blocking_write().push(key);

                                *inner_keys_pressed.blocking_write() = inner_keys_pressed
                                    .blocking_read()
                                    .clone()
                                    .into_iter()
                                    .unique()
                                    .collect();

                                inner_keys_pressed
                                    .blocking_read()
                                    .iter()
                                    .map(|x| *SCANCODE_TO_HID.get(x).unwrap_or(&0))
                                    .collect()
                            };

                            debug!(
                                "Pressed Keys CONVERTED TO HID:  {:?}",
                                keys_pressed_internal_hid
                            );
                            debug!(
                                "Pressed Keys CONVERTED TO RDEV: {:?}",
                                keys_pressed_internal_hid
                                    .par_iter()
                                    .map(|x| *SCANCODE_TO_RDEV
                                        .get(x)
                                        .unwrap_or(&rdev::Key::Unknown(0)))
                                    .collect::<Vec<rdev::Key>>()
                            );

                            let first_key_pressed: u32 = keys_pressed_internal_hid
                                .first()
                                .copied()
                                .unwrap_or_default();

                            let check_these_macros: Vec<String> = inner_macro_lookup
                                .blocking_read()
                                .triggers
                                .get(&first_key_pressed)
                                .cloned()
                                .unwrap_or_default()
                                .to_vec();

                            // ? up the pressed keys here right away?

                            let should_grab = {
                                if !check_these_macros.is_empty() {
                                    let macro_channel_clone = schan_macro_execute.clone();
                                    let macro_data_list_clone = inner_macro_lookup.clone();
                                    // let macro_id_list_clone =
                                    //     inner_macro_lookup.blocking_read().triggers.clone();

                                    check_macro_execution_efficiently(
                                        keys_pressed_internal_hid,
                                        check_these_macros,
                                        macro_data_list_clone,
                                        macro_channel_clone,
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
                            inner_keys_pressed.blocking_write().retain(|x| *x != key);

                            debug!("Key state: {:?}", inner_keys_pressed.blocking_read());

                            Some(event)
                        }

                        rdev::EventType::ButtonPress(button) => {
                            debug!("Button pressed: {:?}", button);

                            let converted_button_to_u32: u32 =
                                BUTTON_TO_HID.get(&button).unwrap_or(&0x101).to_owned();

                            // Clone for the checking function
                            let macro_channel_clone = schan_macro_execute.clone();
                            let macro_data_list_clone = inner_macro_lookup.clone();

                            let check_these_macros: Vec<String> = inner_macro_lookup
                                .blocking_read()
                                .triggers
                                .get(&converted_button_to_u32)
                                .cloned()
                                .unwrap_or_default()
                                .to_vec();

                            let should_grab = check_macro_execution_efficiently(
                                vec![converted_button_to_u32],
                                check_these_macros,
                                macro_data_list_clone,
                                macro_channel_clone,
                            );

                            // Left mouse button never gets consumed to allow users to control their PC.
                            match (should_grab, button) {
                                (true, rdev::Button::Left) => Some(event),
                                (true, _) => None,
                                (false, _) => Some(event),
                            }
                        }
                        rdev::EventType::ButtonRelease(button) => {
                            debug!("Button released: {:?}", button);

                            Some(event)
                        }
                        rdev::EventType::MouseMove { .. } => Some(event),
                        rdev::EventType::Wheel { .. } => Some(event),
                    }
                } else {
                    Some(event)
                }
            })
        });
        Ok(())
    }
}

impl Default for MacroBackend {
    /// Generates a new state.
    fn default() -> Self {
        let macro_data =
            MacroData::read_data().unwrap_or_else(|err| panic!("Cannot get macro data! {}", err));

        let lookup = macro_data
            .new_lookup()
            .expect("error making a new Macro Lookup map");

        MacroBackend {
            macro_data: Arc::new(RwLock::from(macro_data)),
            config: Arc::new(RwLock::from(
                ApplicationConfig::read_data().expect("error reading config"),
            )),
            macro_lookup: Arc::new(RwLock::from(lookup)),
            // macro_execute_queue: Arc::new(RwLock::new(vec![])),
            is_listening: Arc::new(AtomicBool::new(true)),
            keys_pressed: Arc::new(RwLock::from(vec![])),
        }
    }
}
