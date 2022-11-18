use std::{fs, result, thread, time};
use std::borrow::{Borrow, BorrowMut};
//use std::collections::HashMap;
use std::fmt::{format, Formatter};
use std::fs::File;
use std::hash::Hash;
use std::io::Read;
use std::ptr::hash;
use std::str::{Bytes, FromStr};
use std::sync::mpsc::{channel, SendError};
// use tokio::sync::RwLock;
use std::sync::RwLock;
use std::time::Duration;

use halfbrown::HashMap;
use lazy_static::lazy_static;
use rdev::{Button, Event, EventType, grab, Key, listen, simulate, SimulateError};
use serde::Serialize;
use tauri::{Config, State, Theme};
use tokio::sync::mpsc;
use tokio::sync::mpsc::{Receiver, Sender};
use tokio::task;

use crate::{APPLICATION_STATE, ApplicationConfig, hid_table, TRIGGERS_LIST};
use crate::hid_table::*;
use crate::plugin::delay;
use crate::plugin::discord;
use crate::plugin::key_press;
use crate::plugin::mouse_movement;
use crate::plugin::obs;
use crate::plugin::phillips_hue;
use crate::plugin::system_event;
use crate::plugin::unicode_direct;

//use tauri::async_runtime::RwLock;

///Type of a macro.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub enum MacroType {
    Single,
    // single macro fire
    Toggle,
    // press to start, press to finish cycle and terminate
    OnHold, // while held Execute macro (repeats)
}

//TODO: SERDE CAMEL CASE RENAME
//TODO: Press a key to open file browser with a specific path

///This enum is the registry for all actions that can be executed
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(tag = "type")]
pub enum ActionEventType {
    KeyPressEvent { data: key_press::KeyPress },
    //SystemEvent { action: Action },
    //Paste, Run commandline program (terminal run? standard user?), audio, open filemanager, workspace switch left, right,
    //TODO: System event - notification
    PhillipsHueCommand {},
    //TODO: Phillips hue notification
    OBS {},
    DiscordCommand {},
    //IKEADesk
    //MouseMovement
    UnicodeDirect {},
    //TODO: Sound effects? Soundboards?
    //TODO: Sending a message through online webapi (twitch)
    Delay { data: delay::Delay },
}

/// This enum is the registry for all incoming actions that can be analyzed for macro execution
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(tag = "type")]
pub enum TriggerEventType {
    KeyPressEvent {
        data: Vec<key_press::KeyPress>,
        allow_while_other_keys: bool,
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
    fn new() -> Macro {
        Macro {
            name: "".to_string(),
            sequence: vec![],
            macro_type: MacroType::Single,
            trigger: TriggerEventType::KeyPressEvent {
                data: vec![],
                allow_while_other_keys: false,
            },
            active: false,
        }
    }

    async fn execute(&self, send_channel: Sender<Event>) {
        for sequence in &self.sequence {
            match sequence {
                //TODO: make a channel for send to accept stuff
                //TODO: all of these should be sent onto a channel, while another thread is listening and executing
                //TODO: Keypress manager task <- enum EventType send and channel recv. Keypress manager task would spawn tasks for the actions
                //TODO: one task: listening for events and enforcing sleep time
                //TODO: keypressevent has access to the data and spawns a task for downup
                ActionEventType::KeyPressEvent { data } => match data.keytype {
                    key_press::KeyType::Down => {
                        send_channel
                            .send(Event {
                                time: time::SystemTime::now(),
                                name: None,
                                event_type: rdev::EventType::KeyPress(
                                    SCANCODE_TO_RDEV[&data.keypress],
                                ),
                            })
                            .await;
                        //send(&rdev::EventType::KeyPress(SCANCODE_TO_RDEV[&data.keypress]))
                    }
                    key_press::KeyType::Up => {
                        //     send(&rdev::EventType::KeyRelease(
                        //     SCANCODE_TO_RDEV[&data.keypress],
                        // ))

                        send_channel
                            .send(Event {
                                time: time::SystemTime::now(),
                                name: None,
                                event_type: rdev::EventType::KeyRelease(
                                    SCANCODE_TO_RDEV[&data.keypress],
                                ),
                            })
                            .await;
                    }
                    key_press::KeyType::DownUp => {
                        //send(&rdev::EventType::KeyPress(SCANCODE_TO_RDEV[&data.keypress]));
                        //thread::sleep(time::Duration::from_millis(*&data.press_duration as u64));
                        //send(&rdev::EventType::KeyRelease(
                        //    SCANCODE_TO_RDEV[&data.keypress],
                        //));

                        //println!("Found a press/release event, sending it now");

                        send_channel
                            .send(Event {
                                time: time::SystemTime::now(),
                                name: None,
                                event_type: rdev::EventType::KeyPress(
                                    SCANCODE_TO_RDEV[&data.keypress],
                                ),
                            })
                            .await;
                        thread::sleep(time::Duration::from_millis(*&data.press_duration as u64));
                        send_channel
                            .send(Event {
                                time: time::SystemTime::now(),
                                name: None,
                                event_type: rdev::EventType::KeyRelease(
                                    SCANCODE_TO_RDEV[&data.keypress],
                                ),
                            })
                            .await;
                    }
                },
                ActionEventType::PhillipsHueCommand { .. } => {}
                ActionEventType::OBS { .. } => {}
                ActionEventType::DiscordCommand { .. } => {}
                ActionEventType::UnicodeDirect { .. } => {}
                ActionEventType::Delay { data } => {
                    thread::sleep(time::Duration::from_millis(*data))
                }
            }
        }
    }
}

#[tauri::command]
/// Gets the application config from the current state and sends to frontend.
/// The state gets it from the config file at bootup.
pub fn get_config(state: tauri::State<MacroDataState>) -> ApplicationConfig {
    let output: ApplicationConfig = state.config.read().unwrap().clone();
    output
}

#[tauri::command]
/// Gets the application config from the current state and sends to frontend.
/// The state gets it from the config file at bootup.
pub fn set_config(state: tauri::State<MacroDataState>, config: ApplicationConfig) {
    let mut tauri_state = state.config.write().unwrap();
    *tauri_state = config.clone();
    tauri_state.export_data();

    let mut app_state = APPLICATION_STATE.config.write().unwrap();
    *app_state = config;
}

#[tauri::command]
/// Gets the macro data from current state and sends to frontend.
/// The state gets it from the config file at bootup.
pub fn get_macros(state: tauri::State<MacroDataState>) -> MacroData {
    let macro_data_state = state.data.read().unwrap();
    generate_triggers(macro_data_state.clone());

    macro_data_state.clone()
}

#[tauri::command]
/// Sets the configuration from frontend and updates the state for everything on backend.
pub fn set_macros(state: tauri::State<MacroDataState>, frontend_data: MacroData) {
    let mut tauri_state = state.data.write().unwrap();
    *tauri_state = frontend_data.clone();
    tauri_state.export_data();

    let mut app_state = APPLICATION_STATE.data.write().unwrap();
    *app_state = frontend_data;

    generate_triggers(app_state.clone());
}

/// Function for a manual write of config changes from the backend side. Just a test.
/// Not meant to be used.
pub async fn set_data_write_manually_backend(frontend_data: MacroData) {
    let mut app_state = APPLICATION_STATE.data.write().unwrap();
    *app_state = frontend_data.clone();
    app_state.clone().export_data();
}

//
// fn check_key(incoming_key: &Vec<rdev::Key>) {
//     let app_state = APPLICATION_STATE.data.read().unwrap();
//
//     for collections in &app_state.data {
//         if collections.active == true {
//             for macros in &collections.macros {
//                 if macros.active == true {
//                     match &macros.trigger {
//                         TriggerEventType::KeyPressEvent { data: trigger } => {
//                             for i in trigger {
//                                 if SCANCODE_MAP[&i.keypress] == *incoming_key {
//                                     println!(
//                                         "FOUND THE TRIGGER, WOULD EXECUTE MACRO: {}",
//                                         macros.name
//                                     )
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }

///State of the application in RAM (rwlock).
#[derive(Debug)]
pub struct MacroDataState {
    pub data: RwLock<MacroData>,
    pub config: RwLock<ApplicationConfig>,
}

impl MacroDataState {
    ///Generates a new state.
    pub fn new() -> Self {
        MacroDataState {
            data: RwLock::from(MacroData::read_data()),
            config: RwLock::from(ApplicationConfig::read_data()),
        }
    }
}
///Collections are groups of macros.
type Collections = Vec<Collection>;

#[derive(Debug)]
pub struct Triggers {
    data: RwLock<HashMap<u32, Vec<Macro>>>,
}

impl Triggers {
    pub fn new() -> Self {
        Triggers {
            data: RwLock::from(HashMap::new()),
        }
    }
}

pub fn generate_triggers(macro_data: MacroData) {
    let mut output_tuple: Vec<(rdev::Key, u32)> = vec![];

    let mut output_hashmap: HashMap<u32, Vec<Macro>> = HashMap::new();

    for collections in &macro_data.data {
        if collections.active == true {
            for macros in &collections.macros {
                if macros.active == true {
                    match &macros.trigger {
                        TriggerEventType::KeyPressEvent { data, .. } => {
                            output_tuple.push((
                                SCANCODE_TO_RDEV[&data.first().unwrap().keypress],
                                data.first().unwrap().keypress.clone(),
                            ));
                            //output_hashmap.insert_nocheck(data.clone().first().unwrap().keypress, macros.clone());

                            match output_hashmap.get_mut(&data.first().unwrap().keypress) {
                                Some(mut value) => value.push(macros.clone()),
                                None => output_hashmap.insert_nocheck(
                                    data.clone().first().unwrap().keypress,
                                    vec![macros.clone()],
                                ),
                            }
                        }
                    }
                }
            }
        }
    }

    let mut write_here = TRIGGERS_LIST.data.write().unwrap();
    *write_here = output_hashmap;
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
        std::fs::write(
            "../data_json.json",
            serde_json::to_string_pretty(&self).unwrap(),
        )
            .unwrap();
    }

    pub fn extract_triggers(&self) -> HashMap<u32, Vec<Macro>> {
        let mut output_tuple: Vec<(rdev::Key, u32)> = vec![];

        let mut output_hashmap: HashMap<u32, Vec<Macro>> = HashMap::new();

        for collections in &self.data {
            if collections.active == true {
                for macros in &collections.macros {
                    if macros.active == true {
                        match &macros.trigger {
                            TriggerEventType::KeyPressEvent { data, .. } => {
                                output_tuple.push((
                                    SCANCODE_TO_RDEV[&data.first().unwrap().keypress],
                                    data.first().unwrap().keypress.clone(),
                                ));
                                //output_hashmap.insert_nocheck(data.clone().first().unwrap().keypress, macros.clone());

                                match output_hashmap.get_mut(&data.first().unwrap().keypress) {
                                    Some(mut value) => value.push(macros.clone()),
                                    None => output_hashmap.insert_nocheck(
                                        data.clone().first().unwrap().keypress,
                                        vec![macros.clone()],
                                    ),
                                }
                            }
                        }
                    }
                }
            }
        }

        output_hashmap
    }

    ///Reads the data.json file and loads it into a struct, passes to the application at first launch (backend).
    pub fn read_data() -> MacroData {
        let path = "../data_json.json";

        let incoming_test: MacroData = MacroData {
            data: vec![Collection {
                name: "Default".to_string(),
                icon: 'i'.to_string(),
                macros: vec![],
                active: true,
            }],
        };

        let data = {
            match fs::read_to_string(path) {
                Ok(T) => T,
                Err(E) => {
                    println!("{}", E);
                    std::fs::write(
                        "../data_json.json",
                        serde_json::to_string_pretty(&incoming_test).unwrap(),
                    )
                        .unwrap();

                    let output = fs::read_to_string(path).unwrap();
                    println!("{}", output);

                    output
                }
            }
        };

        let deserialized: MacroData = serde_json::from_str(&data).unwrap();
        deserialized
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

//TODO: trait generic this executing
//TODO: async
///Executes a given macro (requires a reference to a macro).
async fn execute_macro(macros: Macro, channel: Sender<rdev::Event>) {
    match macros.macro_type {
        MacroType::Single => {
            println!("\nEXECUTING A SINGLE MACRO: {:#?}", macros.name);
            let cloned_channel = channel.clone();

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

async fn executor_sender(mut rchan_execute: Receiver<rdev::Event>) {
    loop {
        let mut result = rchan_execute.recv().await.unwrap().event_type;
        //println!("RECEIVED RESULT {:#?}", &result);
        send(&result);
        thread::sleep(time::Duration::from_millis(200));
    }
}

///Main loop for now (of the library)
pub async fn run_backend() {
    //==================================================
    //TODO: Make a way to disable this listening function
    //TODO: make this a grab instead of listen
    //TODO: try to make this interact better (cleanup the code a bit)
    //TODO: io-uring async read files and write files

    //Trigger hashes

    //println!("{:#?}", trigger_overview);

    //TODO: Make the modifier keys non-ordered?

    let macros_data_from_state = APPLICATION_STATE.data.read().unwrap().clone();
    let mut events = Vec::new();
    let mut pressed_keys: Vec<rdev::Key> = Vec::new();

    generate_triggers(macros_data_from_state.clone());

    let (mut schan_execute, mut rchan_execute) = tokio::sync::mpsc::channel(1);

    task::spawn(async move {
        executor_sender(rchan_execute).await;
    });

    let (schan_grab, rchan_grab) = channel(); //TODO: async tokio version
    let _grabber = thread::spawn(move || {
        grab(
            move |event: rdev::Event| match schan_grab.send(event.clone()) {
                Ok(T) => {
                    let mut keys_pressed: Vec<rdev::Key>;
                    match &event.event_type {
                        //TODO: Grab and discard the trigger actually
                        //TODO: Move the detection logic rightttt heree
                        EventType::KeyPress(key) => Some(event),
                        _ => Some(event),
                    }
                }
                Err(_) => None,
            },
        )
    });

    for event in &rchan_grab {
        events.push(event);

        let macro_collections = APPLICATION_STATE.data.read().unwrap();
        let triggers = TRIGGERS_LIST.data.read().unwrap();

        for i in &events {
            match i.event_type {
                EventType::KeyPress(listened_key) => {
                    pressed_keys.push(listened_key.clone());
                    println!("{:?}", pressed_keys);
                }
                EventType::KeyRelease(listened_key) => {
                    pressed_keys.retain(|x| *x != listened_key);
                    println!("{:#?}", pressed_keys);
                }
                EventType::ButtonPress(listened_key) => {
                    println!("MB Pressed:{:?}", listened_key)
                }
                EventType::ButtonRelease(listened_key) => {
                    println!("MB Released:{:?}", listened_key)
                }
                EventType::MouseMove { x, y } => (),
                EventType::Wheel { delta_x, delta_y } => {}
            }

            //So basically we gotta reload the variables. I think this entire thing will get a refactor soon
            let pressed_keys_copy_converted: Vec<u32> =
                pressed_keys.iter().map(|x| SCANCODE_TO_HID[&x]).collect();

            if triggers.contains_key(&pressed_keys_copy_converted.first().unwrap_or(&0)) {
                let check_macros: Vec<Macro> =
                    triggers[&pressed_keys_copy_converted.first().unwrap()].clone();
                let channel_copy_send = schan_execute.clone();

                task::spawn(async move {
                    check_macro_execution_efficiently(
                        pressed_keys_copy_converted,
                        check_macros,
                        channel_copy_send,
                    )
                        .await;
                });
            }
        }

        events.pop();
    }
}

async fn check_macro_execution_efficiently(
    pressed_keys: Vec<u32>,
    trigger_overview: Vec<Macro>,
    channel_sender: Sender<rdev::Event>,
) {
    for macros in &trigger_overview {
        match &macros.trigger {
            TriggerEventType::KeyPressEvent { data, .. } => {
                let keypress_to_check: Vec<u32> = data.iter().map(|x| x.keypress).collect();

                println!(
                    "CheckMacroExec: Converted keys to vec<u32>\n {:#?}",
                    keypress_to_check
                );

                if keypress_to_check == pressed_keys {
                    let channel_clone = channel_sender.clone();
                    let macro_clone = macros.clone();

                    task::spawn(async move {
                        execute_macro(macro_clone, channel_clone).await;
                    })
                        .await;
                }
            }
        }
    }
}

///Function checks if the current keys pressed evalue to any macro
async fn check_macro_execution(
    pressed_keys: Vec<Key>,
    trigger_overview: MacroData,
    channel_sender: Sender<rdev::Event>,
) {
    //println!("Received pressed keys {:#?}", pressed_keys);

    for collections in &trigger_overview.data {
        if collections.active == true {
            for macros in &collections.macros {
                if macros.active == true {
                    match &macros.trigger {
                        TriggerEventType::KeyPressEvent {
                            data: trigger_key, ..
                        } => {
                            let converted_keys: Vec<rdev::Key> = trigger_key
                                .iter()
                                .map(|x| SCANCODE_TO_RDEV[&x.keypress])
                                .collect();

                            if pressed_keys == converted_keys {
                                println!("MACRO {:#?} READY TO EXECUTE", macros.name);
                                println!("KEYS SEQUENCE {:#?} READY TO EXECUTE", macros.sequence);

                                let havo = macros.clone();
                                let havo2 = channel_sender.clone();
                                //USE THIS FOR THREADED
                                //thread::spawn(|| execute_macro(havo));

                                //USE THIS FOR ASYNC
                                println!(
                                    "Executing macro {:#?} because of trigger {:#?} == {:#?}",
                                    havo.name, pressed_keys, converted_keys
                                );

                                task::spawn(async move {
                                    execute_macro(havo, havo2).await;
                                });
                            }
                        }
                    }
                }
            }
        }
    }
}

///Sends an event to the library to Execute on an OS level.
fn send(event_type: &EventType) {
    //let delay = time::Duration::from_millis(20);
    match simulate(event_type) {
        Ok(()) => (),
        Err(SimulateError) => {
            println!("We could not send {:?}", event_type);
        }
    }
    // Let ths OS catchup (at least MacOS)
    //TODO: remove the delay at least for windows, mac needs testing (done by executor)
    //thread::sleep(delay);
}

///Gets user input on the backend. Dev purposes only.
fn get_user_input(display_text: String) -> String {
    println!("{}\n", display_text);

    let mut buffer: String = String::new();

    std::io::stdin()
        .read_line(&mut buffer)
        .expect("Invalid type");
    buffer.trim().to_string()
}
