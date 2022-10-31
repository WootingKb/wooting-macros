use std::{fs, result, thread, time};
use std::collections::HashMap;
use std::fmt::{format, Formatter};
use std::fs::File;
use std::hash::Hash;
use std::str::{Bytes, FromStr};
use std::sync::mpsc::channel;
use std::time::Duration;

use rdev::{Button, Event, EventType, grab, Key, listen, simulate, SimulateError};
use serde::Serialize;

use crate::{ApplicationConfig, hid_table};
use crate::hid_table::*;

#[derive(Debug)]
pub enum MacroType {
    Single { data: Macro },
    Repeating { data: Macro },
    OnHold { data: Macro },
    MultiLevel { data: Macro },
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
struct KeyPress {
    keypress: u32,
    press_duration: Delay,
}

impl KeyPress {
    fn execute_key_up(&self, key_to_release: &rdev::Key) {
        send(&EventType::KeyRelease(*key_to_release));
    }

    fn execute_key_down(&self) {}
}

///Delay for the sequence
type Delay = u32;

//TODO: Make a hashmap that links to trigger:&macro

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
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
pub enum TriggerEventType {
    KeyPressEvent { data: Vec<KeyPress> },
}

#[derive(Debug, Clone)]
struct EventList(Vec<rdev::Key>);

#[derive(Debug, Clone)]
pub struct Action {
    pub action: char,
    pub press_wait_delay_after: time::Duration,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Macro {
    name: String,
    sequence: Vec<ActionEventType>,
    trigger: TriggerEventType,
    active: bool,
}

#[tauri::command]
pub fn export_frontend(data: MacroData) -> String {
    let data_return = data.export_data();
    data_return
}

#[tauri::command]
pub fn push_frontend_first() -> Result<String, String> {
    let path = "./data_json.json";
    let data = fs::read_to_string(path).expect("Unable to read file");
    let res: serde_json::Value = serde_json::from_str(&data).expect("Unable to parse");

    Ok(res.to_string())
}

fn push_backend_first() -> MacroData {
    let path = "./data_json.json";
    let data = fs::read_to_string(path).expect("Unable to read file");

    let deserialized: MacroData = serde_json::from_str(&data).unwrap();
    deserialized
}

#[tauri::command]
pub fn import_frontend(mut data: MacroData, input: MacroData) {
    data.import_data(input);
}

///MacroData is the main data structure that contains all macro data.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct MacroData(Vec<Collection>);

impl MacroData {
    /// This exports data for the frontend to process it.
    /// Basically sends the entire struct to the frontend
    pub fn export_data(&self) -> String {
        std::fs::write(
            "./data_json.json",
            serde_json::to_string_pretty(&self).unwrap(),
        )
            .unwrap();

        serde_json::to_string_pretty(&self).unwrap()
    }

    /// Imports data from the frontend (when updated) to update the background data structure
    /// This overwrites the datastructure
    pub fn import_data(&mut self, input: MacroData) -> TriggerHash {
        *self = input;
        self.export_data();
        self.extract_triggers()
    }

    /// Extracts the data
    fn extract_triggers(&self) -> TriggerHash {
        let mut trigger_hash_list: TriggerHash = HashMap::new();

        for search in &self.0 {
            for trig in &search.macros {
                match &trig.trigger {
                    TriggerEventType::KeyPressEvent { data } => {
                        trigger_hash_list.insert(data.clone(), &trig);
                    }
                }
            }
        }

        trigger_hash_list
    }
}

///Hash list
type TriggerHash<'a> = HashMap<Vec<KeyPress>, &'a Macro>;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Collection {
    name: String,
    //TODO: base64 encoding
    icon: String,
    macros: Vec<Macro>,
    active: bool,
}

///Main loop for now (of the library)
/// * `config` - &ApplicationConfig from the parsed JSON config file of the app.
pub fn run_this(config: &ApplicationConfig) {
    // let mut incoming_test: MacroData = MacroData {
    //     0: vec![Collection {
    //         name: "LOL".to_string(),
    //         icon: 'i'.to_string(),
    //         macros: vec![Macro {
    //             name: "Newer string".to_string(),
    //             sequence: vec![
    //                 ActionEventType::KeyPressEvent {
    //                     data: KeyPress {
    //                         keypress: 12,
    //
    //                         press_duration: 50,
    //                     },
    //                 },
    //                 ActionEventType::KeyPressEvent {
    //                     data: KeyPress {
    //                         keypress: 13,
    //
    //                         press_duration: 50,
    //                     },
    //                 },
    //             ],
    //             trigger: TriggerEventType::KeyPressEvent {
    //                 data: vec![KeyPress {
    //                     keypress: 14,
    //
    //                     press_duration: 50,
    //                 }],
    //             },
    //             active: true,
    //         }],
    //         active: true,
    //     }],
    // };

    //testing_macro_full.export_data();

    // Get data from the config file.
    let mut testing_macro_full: MacroData = push_backend_first();

    // Serve to the frontend.
    push_frontend_first();

    // Get the triggers linked correctly
    let triggers = testing_macro_full.extract_triggers();

    //Print for a check (triggers)
    println!("{:#?}", triggers);

    //==================================================

    //TODO: make this a grab instead of listen
    //TODO: try to make this interact better (cleanup the code a bit)
    //TODO: make the pressed keys vector and compare to the hashmap
    //TODO: try to execute the macros in order (make the executor)
    //TODO: async the executor of the presses
    //
    let (schan, rchan) = channel();
    let _listener = thread::spawn(move || {
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
                    //testing_macro_full.check_key(&s);
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
