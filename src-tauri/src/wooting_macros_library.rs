use std::{fs, result, thread, time};
use std::collections::HashMap;
use std::fmt::{format, Formatter};
use std::fs::File;
use std::str::{Bytes, FromStr};
use std::sync::mpsc::channel;
use std::time::Duration;

use rdev::{Button, Event, EventType, grab, Key, listen, simulate, SimulateError};
use serde::Serialize;

use crate::ApplicationConfig;

/// MacroType that wraps the Macro struct. Depending on the type we decide what to do.
/// This does not yet do anything.
#[derive(Debug)]
pub enum MacroType {
    Single { data: Macro },
    Repeating { data: Macro },
    OnHold { data: Macro },
    MultiLevel { data: Macro },
}

/// Key contains an rdev::Key enum to be pressed.
/// * `keypress` - an rdev::Key enum of the key that will be pressed
/// * `press_wait_delay_after` - time::Duration argument that makes the macro wait after (this is subject to change potentially)
/// * `press_duration` - time::Duration for how long the key should stay pressed for (currently not implemented or used)
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
struct KeyPress {
    keypress: u32,
    press_duration: Delay,
}

impl KeyPress {
    /// Executes an action on key up.
    /// TODO: Meant to search the event list and remove all duplicates of the keys being pressed.
    ///  This should be either paired with each keypress, or called after registering that key release to clean up the array
    fn execute_key_up(&self, key_to_release: &rdev::Key) {
        send(&EventType::KeyRelease(*key_to_release));
    }

    /// Executes the actual keypress according to what it should be
    fn execute_key_down(&self) {
        //send(&EventType::KeyPress(self.keypress));
        //thread::sleep(self.press_duration);

        //self.execute_key_up(&self.keypress);
    }
}

///Delay for the sequence
type Delay = u32;

//TODO: Make a hashmap that links to trigger:&macro

/// Action event type is the *output* action that is sent to the system after being processed by the backend.
/// Each of these have a struct embedded within them to provide the necessary data for the execution.
/// Think of this as plugins. Currently supported:
/// * `KeyPressEvent` - A simple keypress (which releases after a while).
/// * `SystemEvent` - An action like launching a browser, copying a file, pasting from the clipboard, etc.
/// * `PhillipsHueCommand` - After initializing, you can use this to control lights via the BridgeV2.
/// * `OBS` - OpenBroadcastSoftware integration
/// * `DiscordCommand` - Discord integration (muting microphone, deafening)
/// * `UnicodeDirect` - Output a Unicode symbol of choice
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

// impl std::fmt::Display for ActionEventType {
//     fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
//         let mut buffer_text: String = "".to_string();
//         let mut number = 0;
//
//         match &self {
//             ActionEventType::KeyPressEvent { data: i } => {
//                 buffer_text += format!(
//                     "\n\t\tKey #{}\n\t\tKey: {:?}\tDelayAfterPress: {} ms\tDuration: {} ms",
//                     number,
//                     i.keypress,
//                     i.press_wait_delay_after.as_millis(),
//                     i.press_duration.as_millis()
//                 )
//                     .as_str();
//                 number += 1;
//             }
//             ActionEventType::SystemEvent { action: _ } => {}
//             ActionEventType::PhillipsHueCommand() => {}
//             ActionEventType::OBS() => {}
//             ActionEventType::DiscordCommand {} => {}
//             ActionEventType::UnicodeDirect {} => {}
//         }
//
//         write!(f, "{}", buffer_text)
//     }
// }

/// These are the events that can come from within the OS and are supported as triggers for running a macro.
/// Currently supported:
/// * `KeyPressEvent` - Very much like the output counterpart, a key event that can be caught using a grab feature and processed.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub enum TriggerEventType {
    KeyPressEvent { data: KeyPress },
}

/// The list of events that are currently happening (basically a list of all keys or buttons currently being pressed).
/// Helps to check this list after a change to see if to trigger a macro.
#[derive(Debug, Clone)]
struct EventList(Vec<rdev::Key>);

/// Action is a structure currently unused.
/// Action serves for the system actions (paste clipboard, etc). Not used yet.
#[derive(Debug, Clone)]
pub struct Action {
    pub action: char,
    pub press_wait_delay_after: time::Duration,
}

/// Macro is the main building block that has several fields.
/// * `name` - Name of the macro.
/// * `body` - Actions to execute within a macro.
/// * `trigger` - The trigger event that can trigger the macro to execute
/// * `active` - whether the macro is active (should be executed when conditions meet) or not.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Macro {
    name: String,
    sequence: Vec<ActionEventType>,
    trigger: TriggerEventType,
    active: bool,
}

// impl std::fmt::Display for Macro {
//     fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
//         let mut buffer_text: String = "".to_string();
//         let mut number = 0;
//
//         buffer_text += format!(
//             "There are {} keys in the macro {}.\n",
//             self.body.len(),
//             self.name
//         )
//             .as_str();
//
//         for i in &self.body {
//             buffer_text += format!("Key {}: {}", number, i).as_str();
//             number += 1;
//         }
//
//         write!(f, "{}", buffer_text)
//     }
// }

#[tauri::command]
pub fn export_frontend(data: MacroData) -> String {
    let data_return = data.export_data();
    data_return
}

#[tauri::command]
pub fn push_frontend_first() -> String {
    let path = "./data_json.json";
    let data = fs::read_to_string(path).expect("Unable to read file");
    let res: serde_json::Value = serde_json::from_str(&data).expect("Unable to parse");

    res.to_string()
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
    pub fn import_data(&mut self, input: MacroData) {
        *self = input;
        self.export_data();
    }
}

//
// impl std::fmt::Display for MacroData {
//     fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
//         let mut buffer_text: String = "".to_string();
//         let mut number = 0;
//
//         buffer_text += format!("There are {} macro groups.\n", &self.0.len()).as_str();
//
//         for i in &self.0 {
//             buffer_text += format!(
//                 "\tGroup {}\n\tGroupName: {}\n\tActive: {}\n+++++++++++\n",
//                 number, i.name, i.active
//             )
//                 .as_str();
//             number += 1;
//             buffer_text += format!("\nMacro {}\n{}", i.name, i).as_str();
//         }
//
//         write!(f, "{}", buffer_text)
//     }
// }

///Trait implementation for MacroData

///MacroGroup is a group of macros. It can be active or inactive. Contains an icon and a name.
/// * `name` - String based name of the MacroGroup
/// * `icon` - Placeholder for now
/// * `items` - Macros (vector) that belong to a group
/// * `active` - Whether they should be executable
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Collection {
    name: String,
    //TODO: base64 encoding
    icon: String,
    items: Vec<Macro>,
    active: bool,
}
//
// impl std::fmt::Display for MacroGroup {
//     fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
//         let mut buffer_text: String = "".to_string();
//         let mut number = 0;
//
//         buffer_text += format!(
//             "There are {} macros in the group {}.\n",
//             &self.items.len(),
//             &self.name
//         )
//             .as_str();
//
//         for i in &self.items {
//             buffer_text += format!(
//                 "========\n\tMacro # {}\n\tMacroName: {}\tActive: {}",
//                 number, i.name, i.active
//             )
//                 .as_str();
//             for j in &i.body {
//                 buffer_text += format!("\n\t\tKeys: {}\n", j).as_str();
//             }
//             number += 1;
//         }
//
//         write!(f, "{}", buffer_text)
//     }
// }

///Main loop for now (of the library)
/// * `config` - &ApplicationConfig from the parsed JSON config file of the app.
pub fn run_this(config: &ApplicationConfig) {
    println!("Character {}: {}", 'c', 'c' as u32);

    push_frontend_first();

    // let testing_action = ActionEventType::SystemEvent {
    //     action: Action {
    //         action: 'd',
    //         press_wait_delay_after: time::Duration::from_millis(5),
    //     }
    // };

    //Very temporary debugging only variable (so I can precisely see and manipulate data
    let mut testing_macro_full: MacroData = MacroData {
        0: vec![
            Collection {
                name: "Main group".to_string(),
                icon: 'i'.to_string(),
                items: vec![Macro {
                    name: "Paste".to_string(),
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
                        data: KeyPress {
                            keypress: 14,

                            press_duration: 50,
                        },
                    },
                    active: true,
                }],
                active: true,
            },
            Collection {
                name: "Fun macro group".to_string(),
                icon: 'i'.to_string(),
                items: vec![
                    Macro {
                        name: "Havo".to_string(),
                        sequence: vec![
                            ActionEventType::KeyPressEvent {
                                data: KeyPress {
                                    keypress: 14,

                                    press_duration: 50,
                                },
                            },
                            ActionEventType::KeyPressEvent {
                                data: KeyPress {
                                    keypress: 13,

                                    press_duration: 50,
                                },
                            },
                            ActionEventType::KeyPressEvent {
                                data: KeyPress {
                                    keypress: 12,

                                    press_duration: 50,
                                },
                            },
                        ],
                        trigger: TriggerEventType::KeyPressEvent {
                            data: KeyPress {
                                keypress: 22,

                                press_duration: 50,
                            },
                        },
                        active: true,
                    },
                    Macro {
                        name: "Svorka".to_string(),
                        sequence: vec![ActionEventType::KeyPressEvent {
                            data: KeyPress {
                                keypress: 23,

                                press_duration: 50,
                            },
                        }],
                        trigger: TriggerEventType::KeyPressEvent {
                            data: KeyPress {
                                keypress: 24,

                                press_duration: 50,
                            },
                        },
                        active: true,
                    },
                ],
                active: true,
            },
        ],
    };

    //testing_macro_full.export_data();

    //TODO: make this a grab instead of listen
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
                EventType::Wheel { delta_x, delta_y } => {
                    println!("{}, {}", delta_x, delta_y)
                }
            }
        }
        events.pop();
    }
    //TODO: Make a translation table to a hashmap from a keycode HID compatible -> library rdev enums.
}

//Temporary "option" for either using the input grab or not.

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

///Gets user's text.
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
