use std::{fs, result, thread, time};
use std::collections::HashMap;
use std::fmt::{format, Formatter};
use std::fs::File;
use std::hash::Hash;
use std::str::{Bytes, FromStr};
use std::sync::mpsc::{channel, SendError};
use std::sync::RwLock;
use std::time::Duration;

use lazy_static::lazy_static;
use rdev::{Button, Event, EventType, grab, Key, listen, simulate, SimulateError};
use serde::Serialize;
use tauri::{Config, State};

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
    //KeyON
    //KeyOFF
    //SystemEvent { action: Action },
    PhillipsHueCommand {},
    OBS {},
    DiscordCommand {},
    //IKEADesk
    //MouseMovement
    UnicodeDirect {},
    Delay { data: Delay },

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
pub fn get_macros(state: tauri::State<MacroDataState>) -> MacroData {
    let test = state.data.read().unwrap();
    test.clone()
}

#[tauri::command]
/// Sets the configuration from frontend and updates the state for everything on backend.
pub fn set_macros(state: tauri::State<MacroDataState>, frontend_data: MacroData) {
    let mut tauri_state = state.data.write().unwrap();
    *tauri_state = frontend_data.clone();
    tauri_state.export_data();

    let mut app_state = APPLICATION_STATE.data.write().unwrap();
    *app_state = frontend_data;
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
                                    println!(
                                        "FOUND THE TRIGGER, WOULD EXECUTE MACRO: {}",
                                        macros.name
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct MacroDataState {
    pub data: RwLock<MacroData>,
    pub config: RwLock<ApplicationConfig>,
}

impl MacroDataState {
    pub fn new() -> Self {
        MacroDataState {
            data: RwLock::from(MacroData::read_data()),
            config: RwLock::from(ApplicationConfig::read_data()),
        }
    }
}


type Collections = Vec<Collection>;

///MacroData is the main data structure that contains all macro data.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct MacroData(pub Collections);

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
        let path = "../data_json.json";

        let incoming_test: MacroData = MacroData(vec![Collection {
            name: "Default".to_string(),
            icon: 'i'.to_string(),
            macros: vec![],
            active: true,
        }]);

        //TODO: Make this create a new file when needed.
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
pub fn run_this() {
    //==================================================
    //TODO: make this a grab instead of listen
    //TODO: try to make this interact better (cleanup the code a bit)
    //TODO: make the pressed keys vector and compare to the hashmap
    //TODO: try to execute the macros in order (make the executor)
    //TODO: async the executor of the presses


    match APPLICATION_STATE.config.read().unwrap().use_input_grab {
        true => {
            let mut events = Vec::new();
            let (schan, rchan) = channel();
            let _grabber = thread::spawn(move || {
                grab(move |event| match schan.send(event.clone()) {
                    Ok(T) => {
                        match &event.event_type {
                            //TODO: Make this hash the trigger keys
                            EventType::KeyPress(Key::Comma) => {
                                println!("BLOCKING THE COMMA");
                                None
                            }
                            _ => Some(event),
                        }
                    }
                    Err(_) => None,
                })
            });

            for event in rchan.iter() {
                events.push(event);

                for i in &events {
                    //println!("{:?}", events.len());
                    match i.event_type {
                        EventType::KeyPress(s) => {
                            //TODO: Make this a hashtable or smth
                            println!("Pressed: {:?}", s);
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
        }
        false => {
            let mut events = Vec::new();

            let (schan, rchan) = channel();
            let _listener = thread::spawn(move || {
                listen(move |event| {
                    schan
                        .send(event)
                        .unwrap_or_else(|e| println!("Could not send event {:?}", e));
                })
                    .expect("Could not listen");
            });

            for event in rchan.iter() {
                events.push(event);

                for i in &events {
                    //println!("{:?}", events.len());
                    match i.event_type {
                        EventType::KeyPress(s) => {
                            //TODO: Make this a hashtable or smth
                            println!("Pressed: {:?}", s);
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
        }
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


