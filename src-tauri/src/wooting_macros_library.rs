use std::{fs, result, thread, time};
use std::collections::HashMap;
use std::fmt::{format, Formatter};
use std::fs::File;
use std::hash::Hash;
use std::str::{Bytes, FromStr};
use std::sync::mpsc::channel;
use std::sync::RwLock;
use std::time::Duration;

use lazy_static::lazy_static;
use rdev::{Button, Event, EventType, grab, Key, listen, simulate, SimulateError};
use serde::Serialize;
use tauri::State;

use crate::{APPLICATION_STATE, ApplicationConfig, hid_table};
use crate::hid_table::*;

#[derive(Debug)]
pub enum MacroType {
    Single { data: Macro },
    Repeating { data: Macro },
    OnHold { data: Macro },
    MultiLevel { data: Macro },
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
pub struct KeyPress {
    pub keypress: u32,
    pub press_duration: Delay,
}

impl KeyPress {
    fn execute_key_up(&self, key_to_release: &rdev::Key) {
        send(&EventType::KeyRelease(*key_to_release));
    }

    fn execute_key_down(&self) {}
}

///Delay for the sequence
pub type Delay = u32;

//TODO: Make a hashmap that links to trigger:&macro

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(tag = "type")]
pub enum ActionEventType {
    //TODO: rewrite the tuples into structs
    KeyPressEvent { data: KeyPress },
    //SystemEvent { action: Action },
    PhillipsHueCommand {},
    OBS {},
    DiscordCommand {},
    UnicodeDirect {},
    Delay { data: Delay },
    //TODO: Move the delay after here as an action
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(tag = "type")]
pub enum TriggerEventType {
    KeyPressEvent { data: Vec<KeyPress> },
}

#[derive(Debug, Clone)]
pub struct EventList(Vec<rdev::Key>);

#[derive(Debug, Clone)]
pub struct Action {
    pub action: char,
    pub press_wait_delay_after: time::Duration,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Macro {
    pub name: String,
    pub sequence: Vec<ActionEventType>,
    pub trigger: TriggerEventType,
    pub active: bool,
}


#[tauri::command]
/// Gets the configuration from current state and sends to frontend.
/// The state gets it from the config file at bootup.
pub fn get_configuration(state: tauri::State<MacroDataState>) -> MacroData {
    let test = state.data.read().unwrap();
    test.clone()
}

#[tauri::command]
/// Sets the configuration from frontend and updates the state for everything on backend.
pub fn set_configuration(state: tauri::State<MacroDataState>, frontend_data: Vec<Collection>) {
    let mut tauri_state = state.data.write().unwrap();

    *tauri_state = MacroData { 0: frontend_data.clone() };
    let mut app_state = state.data.write().unwrap();
    *app_state = MacroData { 0: frontend_data.clone() };
}

/// Function for a manual write of config changes from the backend side. Just a test.
/// Not meant to be used.
pub fn set_data_write_manually_backend(frontend_data: MacroData) {
    let mut app_state = APPLICATION_STATE.data.write().unwrap();
    *app_state = frontend_data.clone();
    app_state.clone().export_data();
}

fn check_key(incoming_key: &Key) {
    let app_state = APPLICATION_STATE.data.read().unwrap();

    for collections in &app_state.0 {
        if collections.active == true {
            for macros in &collections.macros {
                if macros.active == true {
                    match &macros.trigger {
                        TriggerEventType::KeyPressEvent { data: trigger } => {
                            for i in trigger {
                                if SCANCODE_MAP[&i.keypress] == *incoming_key {
                                    println!("FOUND THE TRIGGER, WOULD EXECUTE MACRO: {}", macros.name)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
// pub fn export_frontend(data: MacroData) -> String {
//     let data_return = data.export_data();
//     data_return
// }

// pub fn push_frontend_first() -> MacroData {
//     let path = "./data_json.json";
//     let data = fs::read_to_string(path).expect("Unable to read file");
//     let res = serde_json::from_str::<MacroData>(&data).expect("Unable to parse");
//
//     // serde_json::to_string(&res).expect("Unable to serialize")
//     res
// }

// fn push_backend_first() -> MacroData {
//     let path = "./data_json.json";
//     let data = fs::read_to_string(path).expect("Unable to read file");
//
//     let deserialized: MacroData = serde_json::from_str(&data).unwrap();
//     deserialized
// }

// #[tauri::command]
// pub fn import_frontend(mut data: MacroData, input: MacroData) {
//     data.import_data(input);
// }

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct MacroDataState {
    pub data: RwLock<MacroData>,
}

impl MacroDataState {
    pub fn new() -> Self {
        MacroDataState { data: RwLock::from(MacroData::read_data()) }
    }
}


//type Collections = Vec<Collection>;

///MacroData is the main data structure that contains all macro data.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct MacroData(pub Vec<Collection>);


impl MacroData {
    /// This exports data for the frontend to process it.
    /// Basically sends the entire struct to the frontend
    pub fn export_data(&self) {
        std::fs::write(
            "./data_json.json",
            serde_json::to_string_pretty(&self).unwrap(),
        )
            .unwrap();
    }

    // /// Imports data from the frontend (when updated) to update the background data structure
    // /// This overwrites the datastructure
    // pub fn import_data(&mut self, input: MacroData) -> TriggerHash {
    //     *self = input;
    //     self.export_data();
    //     self.extract_triggers()
    // }

    // /// Extracts the data
    // fn extract_triggers(&self) -> TriggerHash {
    //     let mut trigger_hash_list: TriggerHash = HashMap::new();
    //
    //     for search in &self.0 {
    //         for trig in &search.macros {
    //             match &trig.trigger {
    //                 TriggerEventType::KeyPressEvent { data } => {
    //                     trigger_hash_list.insert(data.clone(), &trig);
    //                 }
    //             }
    //         }
    //     }
    //
    //     trigger_hash_list
    // }

    pub fn read_data() -> MacroData {
        let path = "./data_json.json";

        let incoming_test: MacroData = MacroData(vec![Collection {
            name: "Default".to_string(),
            icon: 'i'.to_string(),
            macros: vec![],
            active: true,
        }]);


        //TODO: Make this create a new file when needed.
        let data = {
            match fs::read_to_string(path) {
                Ok(T) => { T }
                Err(E) => {
                    println!("{}", E);
                    std::fs::write(
                        "./data_json.json",
                        serde_json::to_string_pretty(&incoming_test).unwrap(),
                    ).unwrap();

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


///Hash list
pub type TriggerHash<'a> = HashMap<Vec<KeyPress>, &'a Macro>;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Collection {
    pub name: String,
    //TODO: base64 encoding
    pub icon: String,
    pub macros: Vec<Macro>,
    pub active: bool,
}

///Main loop for now (of the library)
/// * `config` - &ApplicationConfig from the parsed JSON config file of the app.
pub fn run_this(config: &ApplicationConfig) {
    let mut incoming_test: MacroData = MacroData(vec![Collection {
        name: "LOL".to_string(),
        icon: 'i'.to_string(),
        macros: vec![Macro {
            name: "Newer string".to_string(),
            sequence: vec![
                ActionEventType::KeyPressEvent {
                    data: KeyPress {
                        keypress: 12,

                        press_duration: 50,
                    },
                },
                ActionEventType::KeyPressEvent {
                    data: KeyPress {
                        keypress: 13,

                        press_duration: 50,
                    },
                },
            ],
            trigger: TriggerEventType::KeyPressEvent {
                data: vec![KeyPress {
                    keypress: 5,

                    press_duration: 50,
                }],
            },
            active: true,
        }],
        active: true,
    }]);

    //testing_macro_full.export_data();

    // Get data from the config file.
    println!("READING DATA ORIGINAL:\n{:#?}\n====\nORIGINAL FILE READ.", APPLICATION_STATE.data.read().unwrap());

    //println!("WRITING DATA");

    //thread::sleep(time::Duration::from_secs(20));
    //set_data_write_manually_backend(incoming_test);

    //println!("READING MODIFIED DATA:\n{:#?}\n====\nMODIFIED FILE READ.", APPLICATION_STATE.data.read().unwrap());


    // let mut testing_macro_full: MacroData = get_configuration(APPLICATION_STATE);
    // println!("{:#?}", testing_macro_full);

    // // Serve to the frontend.
    // push_frontend_first();
    //
    // // Get the triggers linked correctly
    // let triggers = testing_macro_full.extract_triggers();

    //Print for a check (triggers)
    //println!("{:#?}", testing_macro_full);

    //println!("{:#?}", &APPLICATION_STATE.read().unwrap().data);

    //==================================================

    //TODO: make this a grab instead of listen
    //TODO: try to make this interact better (cleanup the code a bit)
    //TODO: make the pressed keys vector and compare to the hashmap
    //TODO: try to execute the macros in order (make the executor)
    //TODO: async the executor of the presses
    //
    let (schan, rchan) = channel();
    let _listener = thread::spawn(move || {
        //TESTING
        //let trigger_hash = APPLICATION_STATE.data.read().unwrap();

        //println!("{:#?}", trigger_hash);

        listen(move |event| {
            schan
                .send(event)
                .unwrap_or_else(|e| println!("Could not send event {:?}", e));
        })
            .expect("Could not listen");
    });

    let mut events = Vec::new();

    for event in rchan.iter() {
        events.push(event);

        for i in &events {
            //println!("{:?}", events.len());
            match i.event_type {
                EventType::KeyPress(s) => {
                    //TODO: Make this a hashtable or smth
                    println!("Pressed: {:?}", s);

                    if s == Key::KpMultiply {
                        println!("WRITING DATA");

                        set_data_write_manually_backend(incoming_test.clone());

                        println!("NEW CONFIG LOADED?");
                    }
                    check_key(&s);
                }
                EventType::KeyRelease(s) => {
                    println!("Released: {:?}", s)
                }
                EventType::ButtonPress(s) => {
                    println!("MB Pressed:{:?}", s)
                }
                EventType::ButtonRelease(s) => {
                    println!("MB Released:{:?}", s)
                }
                EventType::MouseMove { x, y } => (),
                EventType::Wheel { delta_x, delta_y } => {}
            }
        }
        events.pop();
    }
    //TODO: Make a translation table to a hashmap from a keycode HID compatible -> library rdev enums.
}

fn send(event_type: &EventType) {
    let delay = time::Duration::from_millis(20);
    match simulate(event_type) {
        Ok(()) => (),
        Err(SimulateError) => {
            println!("We could not send {:?}", event_type);
        }
    }
    // Let ths OS catchup (at least MacOS)
    thread::sleep(delay);
}

fn get_user_input(display_text: String) -> String {
    println!("{}\n", display_text);

    let mut buffer: String = String::new();

    std::io::stdin()
        .read_line(&mut buffer)
        .expect("Invalid type");
    buffer.trim().to_string()
}

//
// fn callback_grab_win_osx(event: Event) -> Option<Event> {
//     println!("My callback {:?}", event);
//
//     match event.event_type {
//         EventType::KeyPress(Key::Comma) => {
//             println!("Comma pressed");
//             None
//         }
//         //EventType::KeyPress(Key::Kp7)
//         _ => Some(event),
//     }
// }

fn callback_listen_only(event: Event) {
    println!("My callback {:?}", event);
}

// fn execute_special_function(input: &MacroGroup) -> MacroGroup {
//     let device_state = DeviceState::new();
//     let mut key_watched_send: Keycode = Keycode::A;
//
//     let mut _guard = device_state.on_key_down(move |key_watched| {
//         println!("Down: {:#?}", key_watched);
//         //key_watched_send = key_watched.clone();
//
//         check_key(&input, &key_watched);
//
//
//     });
//
//     let _guard = device_state.on_key_up(|key| {
//         println!("Up: {:#?}", key);
//     });
//
//
//     loop {}
// }
