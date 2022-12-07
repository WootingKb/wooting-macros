mod hid_table;
pub mod plugin;

use std::fs::File;
use std::sync::atomic::{AtomicBool, Ordering};
use std::{thread, time};
use std::path::PathBuf;

use std::sync::{Arc};
use tokio::sync::RwLock;

use halfbrown::HashMap;
use rdev::{grab, simulate, EventType, GrabError, SimulateError};
use tokio::sync::mpsc::{Receiver, Sender};
use tokio::task;

#[allow(unused_imports)]
use dirs;

use crate::hid_table::*;
use crate::plugin::delay;
#[allow(unused_imports)]
use crate::plugin::discord;
use crate::plugin::key_press;
use crate::plugin::mouse;
#[allow(unused_imports)]
use crate::plugin::obs;
use crate::plugin::phillips_hue;
use crate::plugin::system_event;
use crate::plugin::system_event::Monitor;
#[allow(unused_imports)]
use crate::plugin::system_event::{
    ClipboardAction, MonitorBrightnessAction, SystemAction, VolumeAction,
};

#[allow(unused_imports)]
use crate::plugin::unicode_direct;


const CONFIG_DIR: &str = "wooting-macro-app";
const CONFIG_FILE: &str = "config.json";
const DATA_FILE: &str = "config.json";

///Type of a macro.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub enum MacroType {
    Single,
    // single macro fire
    Toggle,
    // press to start, press to finish cycle and terminate
    OnHold, // while held Execute macro (repeats)
}

///This enum is the registry for all actions that can be executed
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(tag = "type")]
pub enum ActionEventType {
    KeyPressEventAction {
        data: key_press::KeyPress,
    },
    SystemEventAction {
        data: system_event::SystemAction,
    },
    //Paste, Run commandline program (terminal run? standard user?), audio, open filemanager, workspace switch left, right,
    //TODO: System event - notification
    PhillipsHueEventAction {
        data: phillips_hue::PhillipsHueStatus,
    },
    //TODO: Phillips hue notification
    OBSEventAction {},
    DiscordEventAction {},
    //IKEADesk
    MouseEventAction {
        data: mouse::MouseAction,
    },
    UnicodeEventAction {},
    //TODO: Sound effects? Soundboards?
    //TODO: Sending a message through online webapi (twitch)
    DelayEventAction {
        data: delay::Delay,
    },
}

/// This enum is the registry for all incoming actions that can be analyzed for macro execution
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(tag = "type")]
pub enum TriggerEventType {
    KeyPressEvent {
        // TODO: This should be a Vec of u32, it shouldn't be sharing the type of the KeyPressEventAction: FOR POLISH PHASE
        data: Vec<key_press::KeyPress>,
        allow_while_other_keys: bool,
    },
    MouseEvent {
        data: mouse::MouseButton,
    },
    //TODO: computer time (have timezone support?)
    //TODO: computer temperature?
}

#[derive(Debug, Clone)]
pub struct EventList(Vec<rdev::Key>);

///This is a macro struct. Includes all information a macro needs to run
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Macro {
    pub name: String,
    pub sequence: Vec<ActionEventType>,
    pub macro_type: MacroType,
    pub trigger: TriggerEventType,
    pub active: bool,
}

impl Macro {
    // fn new() -> Macro {
    //     Macro {
    //         name: "".to_string(),
    //         sequence: vec![],
    //         macro_type: MacroType::Single,
    //         trigger: TriggerEventType::KeyPressEvent {
    //             data: vec![],
    //             allow_while_other_keys: false,
    //         },
    //         active: false,
    //     }
    // }

    async fn execute(&self, send_channel: Sender<EventType>) {
        for action in &self.sequence {
            match action {
                ActionEventType::KeyPressEventAction { data } => match data.keytype {
                    key_press::KeyType::Down => {
                        send_channel
                            .send(rdev::EventType::KeyPress(SCANCODE_TO_RDEV[&data.keypress]))
                            .await
                            .unwrap();
                        //send(&rdev::EventType::KeyPress(SCANCODE_TO_RDEV[&data.keypress]))
                    }
                    key_press::KeyType::Up => {
                        send_channel
                            .send(rdev::EventType::KeyRelease(
                                SCANCODE_TO_RDEV[&data.keypress],
                            ))
                            .await
                            .unwrap();
                    }
                    key_press::KeyType::DownUp => {
                        send_channel
                            .send(rdev::EventType::KeyPress(SCANCODE_TO_RDEV[&data.keypress]))
                            .await
                            .unwrap();
                        thread::sleep(time::Duration::from_millis(data.press_duration as u64));
                        send_channel
                            .send(rdev::EventType::KeyRelease(
                                SCANCODE_TO_RDEV[&data.keypress],
                            ))
                            .await
                            .unwrap();
                    }
                },
                ActionEventType::PhillipsHueEventAction { .. } => {}
                ActionEventType::OBSEventAction { .. } => {}
                ActionEventType::DiscordEventAction { .. } => {}
                ActionEventType::UnicodeEventAction { .. } => {}
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

///Collections are groups of macros.
type Collections = Vec<Collection>;

type MacroTriggerLookup = HashMap<u32, Vec<Macro>>;

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "PascalCase")]
pub struct ApplicationConfig {
    pub use_input_grab: bool,
    pub global_key_delay: u64,
}

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
pub struct BrightnessDevice {
    pub device_id: String,
    pub display_name: String,
    pub brightness: u32,
}

///State of the application in RAM (rwlock).
#[derive(Debug)]
pub struct MacroBackend {
    pub data: Arc<RwLock<MacroData>>,
    pub config: Arc<RwLock<ApplicationConfig>>,
    pub triggers: Arc<RwLock<MacroTriggerLookup>>,
    pub is_listening: Arc<AtomicBool>,
    pub display_list: Arc<RwLock<Vec<Monitor>>>,
}

impl MacroBackend {
    ///Generates a new state.
    pub fn new() -> Self {
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

    #[cfg(not(debug_assertions))]
    pub fn generate_directories() {
        match std::fs::create_dir_all(dirs::config_dir().unwrap().join(CONFIG_DIR).as_path()) {
            Ok(x) => x,
            Err(error) => eprintln!("Directory creation failed, OS error: {}", error),
        };
    }

    pub fn set_is_listening(&self, is_listening: bool) {
        self.is_listening.store(is_listening, Ordering::Relaxed);
    }

    pub async fn get_brightness_devices(&self) -> Vec<BrightnessDevice> {
        #[cfg(any(target_os = "windows", target_os = "linux"))]
        {
            //let result = brightness::brightness_devices();
            vec![]
        }

        #[cfg(target_os = "macos")]
        {
            vec![]
        }
    }

    pub async fn set_macros(&self, macros: MacroData) {
        macros.export_data();
        *self.triggers.write().await = macros.extract_triggers();
        *self.data.write().await = macros;
    }

    pub async fn set_config(&self, config: ApplicationConfig) {
        config.write_to_file();
        *self.config.write().await = config;
    }
    pub async fn get_monitor_data(&self) {
        //let monitors = plugin::system_event::backend_load_monitors().await;
        // let mut state_writing = self.display_list.write().await;
        //*state_writing = monitors.clone();
        *self.display_list.write().await = plugin::system_event::backend_load_monitors().await;
    }

    pub async fn init(&self) {
        // Spawn the channels
        let (schan_execute, rchan_execute) = tokio::sync::mpsc::channel(1);
        //let config = self.config.read().await;

        //Create the executor
        thread::spawn(move || {
            keypress_executor_sender(rchan_execute, );
        });

        //==============TESTING GROUND======================
        // let result = self.display_list.read().await;
        // println!("Display list: {:?}", result);

        //     let action_type = ActionEventType::MouseEventAction {
        //         data: MouseAction::Move { x: 1920, y: 1080 },
        //     };

        //     match action_type {
        //         ActionEventType::MouseEventAction { data } => {
        //             println!("RUNNING MOUSE ACTION {:?}", data);
        //             let channel_send = channel_execute_copy.clone();
        //             data.execute(channel_send).await;
        //         }
        //         _ => {}
        //     }
        // });

        //==============TESTING GROUND======================
        //==================================================
        //TODO: try to make this interact better (cleanup the code a bit)

        //TODO: io-uring async read files and write files
        //TODO: implement drop when the application ends to clean up the downed keys

        //TODO: Make the modifier keys non-ordered?
        //==================================================

        //let inner_config = self.config.clone();
        //let inner_data = self.data.clone();
        let inner_triggers = self.triggers.clone();

        let inner_is_listening = self.is_listening.clone();
        println!("TRIGGERS: {:?}", inner_triggers.read().await);

        // Spawn the grabbing
        let _grabber = task::spawn_blocking(move || {
            let keys_pressed: Arc<RwLock<Vec<rdev::Key>>> = Arc::new(RwLock::new(vec![]));
            let buttons_pressed: Arc<RwLock<Vec<rdev::Button>>> = Arc::new(RwLock::new(vec![]));
            //let keys_pressed = keys_pressed.clone();

            grab(move |event: rdev::Event| {
                match Ok::<&rdev::Event, GrabError>(&event) {
                    Ok(_data) => {
                        if inner_is_listening.load(Ordering::Relaxed) {
                            match event.event_type {
                                //TODO: Grab and discard the trigger actually
                                EventType::KeyPress(key) => {
                                    let key_to_push = key;

                                    let mut keys_pressed = keys_pressed.blocking_write();

                                    keys_pressed.push(key_to_push);

                                    println!("Pressed Keys: {:?}", keys_pressed);

                                    let pressed_keys_copy_converted: Vec<u32> = keys_pressed
                                        .iter()
                                        .map(|x| *SCANCODE_TO_HID.get(x).unwrap_or(&0))
                                        .collect();

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

                                    let channel_copy_send = schan_execute.clone();

                                    let should_grab = check_macro_execution_efficiently(
                                        pressed_keys_copy_converted,
                                        check_these_macros,
                                        channel_copy_send,
                                    );

                                    if should_grab {
                                        None
                                    } else {
                                        Some(event)
                                    }
                                }

                                EventType::KeyRelease(key) => {
                                    let key_to_remove = key;

                                    keys_pressed
                                        .blocking_write()
                                        .retain(|x| *x != key_to_remove);
                                    println!("Key state: {:?}", keys_pressed.blocking_read());

                                    Some(event)
                                }

                                EventType::ButtonPress(button) => {
                                    println!("Button pressed: {:?}", button);

                                    let converted_button_to_u32: u32 = match button {
                                        rdev::Button::Left => 0x101,
                                        rdev::Button::Right => 0x102,
                                        rdev::Button::Middle => 0x103,
                                        rdev::Button::Unknown(1) => 0x104,
                                        rdev::Button::Unknown(2) => 0x105,
                                        _ => 0x101,
                                    };

                                    //let converted_button_to_u32: u32 = button.into();
                                    // let converted_button_to_u32 = BUTTON_TO_HID.get(&button).unwrap().clone();

                                    println!(
                                        "Pressed button: {:?}",
                                        buttons_pressed.blocking_read()
                                    );

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
                                EventType::ButtonRelease(button) => {
                                    println!("Button released: {:?}", button);

                                    buttons_pressed.blocking_write().retain(|x| *x != button);

                                    Some(event)
                                }
                                EventType::MouseMove { .. } => Some(event),
                                EventType::Wheel { delta_x, delta_y } => {
                                    println!("Scrolled: {:?} {:?}", delta_x, delta_y);

                                    Some(event)
                                }
                            }
                        } else {
                            println!("Event: {:?}", event);
                            Some(event)
                        }
                    }
                    Err(_) => None,
                }
            })
        });
    }
}

/// Trait to get data or write out data from the state to file.
pub trait StateManagement {
    fn read_data() -> Self;

    fn write_to_file(&self);
}

impl StateManagement for ApplicationConfig {
    fn read_data() -> ApplicationConfig {
        let default: ApplicationConfig = ApplicationConfig {
            use_input_grab: false,
            global_key_delay: 0,
        };

        #[cfg(debug_assertions)]
        let path = std::path::PathBuf::from("../config.json");

        #[cfg(not(debug_assertions))]
        let path = dirs::config_dir()
            .unwrap()
            .join(CONFIG_DIR)
            .join(CONFIG_FILE);

        match File::open(path.as_path().clone()) {
            Ok(data) => {
                let data: ApplicationConfig = serde_json::from_reader(&data).unwrap();
                data
            }

            Err(err) => {
                eprintln!("Error opening file, using default config {}", err);
                default.write_to_file();
                default
            }
        }
    }

    fn write_to_file(&self) {
        #[cfg(debug_assertions)]
        let path = std::path::PathBuf::from("../config.json");

        #[cfg(not(debug_assertions))]
        let path = dirs::config_dir()
            .unwrap()
            .join(CONFIG_DIR)
            .join(CONFIG_FILE);

        match std::fs::write(path.as_path().clone(), serde_json::to_string_pretty(&self).unwrap()) {
            Ok(_) => {
                println!("Success writing a new file");
            }
            Err(err) => {
                eprintln!(
                    "Error writing a new file, using only read only defaults. {}",
                    err
                );
            }
        };
    }
}

///MacroData is the main data structure that contains all macro data.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct MacroData {
    pub data: Collections,
}

impl MacroData {
    /// This exports data for the frontend to process it.
    /// Basically sends the entire struct to the frontend
    pub fn export_data(&self) {
        #[cfg(debug_assertions)]
        let path = std::path::PathBuf::from("../data_json.json");

        #[cfg(not(debug_assertions))]
        let path = dirs::config_dir()
            .unwrap()
            .join(CONFIG_DIR)
            .join(DATA_FILE);

        #[cfg(debug_assertions)]
        std::fs::write(path.as_path().clone(), serde_json::to_string_pretty(&self).unwrap()).unwrap();
    }

    /// Extracts the training data from the macro data.
    pub fn extract_triggers(&self) -> MacroTriggerLookup {
        let mut output_hashmap = MacroTriggerLookup::new();

        for collections in &self.data {
            if collections.active {
                for macros in &collections.macros {
                    if macros.active {
                        match &macros.trigger {
                            TriggerEventType::KeyPressEvent { data, .. } => {
                                match output_hashmap.get_mut(&data.first().unwrap().keypress) {
                                    Some(value) => value.push(macros.clone()),
                                    None => output_hashmap.insert_nocheck(
                                        data.clone().first().unwrap().keypress,
                                        vec![macros.clone()],
                                    ),
                                }
                            }
                            TriggerEventType::MouseEvent { data } => {
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

impl StateManagement for MacroData {
    /// Writes out the data to a file. If unsuccessful, it will use the default data.
    fn write_to_file(&self) {
        #[cfg(debug_assertions)]
        let path = std::path::PathBuf::from("../data_json.json");

        #[cfg(not(debug_assertions))]
        let path = dirs::config_dir()
            .unwrap()
            .join(CONFIG_DIR)
            .join(DATA_FILE);

        match std::fs::write(path.as_path().clone(), serde_json::to_string_pretty(&self).unwrap()) {
            Ok(_) => {
                println!("Success writing a new file");
            }
            Err(err) => {
                eprintln!(
                    "Error writing a new file, using only read only defaults. {}",
                    err
                );
            }
        };
    }
    /// Reads the data.json file and loads it into a struct, passes to the application at first launch (backend).
    fn read_data() -> MacroData {
        let default: MacroData = MacroData {
            data: vec![Collection {
                name: "Default".to_string(),
                icon: 'i'.to_string(),
                macros: vec![],
                active: true,
            }],
        };

        #[cfg(debug_assertions)]
            let path = std::path::PathBuf::from("../data_json.json");

        #[cfg(not(debug_assertions))]
        let path = dirs::config_dir()
            .unwrap()
            .join(CONFIG_DIR)
            .join(DATA_FILE);


        match File::open(path.as_path()) {
            Ok(data) => {
                let data: MacroData = match serde_json::from_reader(&data) {
                    Ok(x) => x,
                    Err(error) => {
                        eprintln!("Error reading data.json, using default data. {}", error);
                        default
                    }
                };
                data
            }

            Err(err) => {
                eprintln!("Error opening file, using default macrodata {}", err);
                default.write_to_file();
                default
            }
        }

    }
}

///Collection struct that defines what a group of macros looks like and what properties it carries
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Collection {
    pub name: String,
    //TODO: base64 encoding
    pub icon: String,
    pub macros: Vec<Macro>,
    pub active: bool,
}

///Executes a given macro (requires a reference to a macro).
async fn execute_macro(macros: Macro, channel: Sender<rdev::EventType>) {
    match macros.macro_type {
        MacroType::Single => {
            println!("\nEXECUTING A SINGLE MACRO: {:#?}", macros.name);
            let cloned_channel = channel;

            task::spawn(async move {
                macros.execute(cloned_channel).await;
            });
        }
        MacroType::Toggle => {
            //TODO: async channel (event)
            //execute_macro_toggle(&macros).await;
        }
        MacroType::OnHold => {
            //TODO: async
            //execute_macro_onhold(&macros).await;
        }
    }
}

/// Receives and executes a macro based on the trigger event. Puts a mandatory 20-50 ms delay between each macro execution.
fn keypress_executor_sender(mut rchan_execute: Receiver<rdev::EventType>) {
    loop {

        let result = rchan_execute.blocking_recv().unwrap();

        send(&result);
        //thread::sleep(time::Duration::from_millis(backend.config.blocking_read().global_key_delay));
    }
}

/// A more efficient way using hashtables to check whether the triggerkeys match the macro.
fn check_macro_execution_efficiently(
    pressed_events: Vec<u32>,
    trigger_overview: Vec<Macro>,
    channel_sender: Sender<rdev::EventType>,
) -> bool {
    let mut output = false;
    for macros in &trigger_overview {
        match &macros.trigger {
            TriggerEventType::KeyPressEvent { data, .. } => {
                let event_to_check: Vec<u32> = data.iter().map(|x| x.keypress).collect();

                println!(
                    "CheckMacroExec: Converted keys to vec<u32>\n {:#?}",
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
            TriggerEventType::MouseEvent { data } => {
                let event_to_check: Vec<u32> = vec![data.into()];

                println!(
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

///Sends an event to the library to Execute on an OS level.
fn send(event_type: &EventType) {
    //let delay = time::Duration::from_millis(20);
    //TODO: maybe make this a config option?
    match simulate(event_type) {
        Ok(()) => (),
        Err(SimulateError) => {
            println!("We could not send {:?}", event_type);
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
