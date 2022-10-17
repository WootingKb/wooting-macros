use std::{result, thread, time};
use std::collections::HashMap;
use std::str::{Bytes, FromStr};
use std::time::Duration;

use device_query::{DeviceEvents, DeviceQuery, DeviceState, Keycode, MouseState};
use rdev::{Button, Event, EventType, grab, Key, listen, simulate, SimulateError};

use crate::wooting_macros_library::KeyEventType::KeyPressEvent;

// Primitive configuration stuff
// TODO: JSON config import
const USE_INPUT_GRAB: bool = true;
const STARTUP_DELAY: time::Duration = time::Duration::from_secs(3);

/// MacroType that wraps the Macro struct. Depending on the type we decide what to do.
///
#[derive(Debug)]
pub enum MacroType {
    Single(Macro),
    Repeating(Macro),
    OnHold(Macro),
    MultiLevel(Macro),
}

impl MacroType {}

/// Key contains a temporary char that needs to be changed,
/// the delay after pressing and pressing duration.
#[derive(Debug)]
pub struct KeyPress {
    pub keypress: Keycode,
    pub press_wait_delay_after: time::Duration,
    pub press_duration: time::Duration,
}

///This basically serves as the implementation that gets called from the methods on KeyPress enum.
/// We always handle the input as: Keypress comes in -> triage -> call the execute according to logic -> process.
// TODO: This poses a question: do we change the enum variants to just a struct field instead of the enum embodying the struct?
impl KeyPress {
    fn execute_key_up(&self) {

        //send(&EventType::KeyRelease(key_to_press));
    }
    fn execute_key_down(&self) {
        // let key_to_press = Key::Unknown(self.keypress as u32);

        //let key_to_press = Key::KeyO;
        //rdev::simulate(&EventType::KeyPress(self.keypress.to_string()));
    }

    fn get_wait_delay(&self) -> time::Duration {
        self.press_wait_delay_after
    }

    fn new(
        keypress: Keycode,
        press_wait_delay_after: time::Duration,
        press_duration: time::Duration,
    ) -> KeyPress {
        KeyPress {
            keypress,
            press_wait_delay_after,
            press_duration,
        }
    }
}

///KeyPress wraps the type of a keypress (Action, KeyUp, KeyDown). For parsing the output (using it).
/// example
/// ```
///  let testing_keypress = KeyPress::KeyUpEvent(Key {
///         keypress: 'c',
///         press_wait_delay_after: time::Duration::from_millis(50),
///         press_duration: time::Duration::from_millis(50),
///     });
///
/// ```
#[derive(Debug)]
pub enum KeyEventType {
    KeyPressEvent(KeyPress),
    SystemEvent(Action),
    PhillipsHueCommand(),
    DiscordCommand(),
    UnicodeDirect(),
}

/*
trait Execute{
    fn execute (&self) {

    }
}




impl Execute for KeyPress {
    fn execute(&self) {
    }
}

 */

impl KeyEventType {
    //TODO: execute function? Seems a bit annoying but could work.
    //TODO: Make a trait probably, that has an "execute" function, implemented individually. Special logic for the KeyUp and Down linking.
    fn press_key_down(&self) {
        match self {
            KeyEventType::KeyPressEvent(s) => {
                s.execute_key_down();
            }
            KeyEventType::SystemEvent(s) => {
                todo!("Not yet done");
            }
            KeyEventType::PhillipsHueCommand() => {
                todo!("Not yet done");
            }
            KeyEventType::DiscordCommand() => {
                todo!("Not yet done");
            }
            KeyEventType::UnicodeDirect() => {
                todo!("Not yet done");
            }
            _ => unimplemented!("Error! Implement this!"),
        }
    }
}

#[derive(Debug)]
pub struct Action {
    pub action: char,
    pub press_wait_delay_after: time::Duration,
}

impl Action {}

#[derive(Debug)]
pub struct Macro {
    name: String,
    //TODO: really think about the timeline as it ties into here
    body: Vec<KeyEventType>,
    trigger: KeyEventType,
    active: bool,
}

impl Macro {
    fn rename(&mut self, new_name: String) {
        self.name = new_name;
    }
    fn new(name: String, body: Vec<KeyEventType>, trigger: KeyEventType) -> Macro {
        Macro {
            name,
            body,
            trigger,
            active: false,
        }
    }
    fn activate(&mut self) {
        self.active = true;
    }
    fn deactivate(&mut self) {
        self.active = false;
    }
    fn is_active(&self) -> bool {
        self.active
    }
}

///Interop between libraries (temporary).
fn check_key(checked_macro_trigger: &MacroGroup, to_check_with_key: &Keycode) {
    let to_check_with_key_string = to_check_with_key.to_string();

    for item in &checked_macro_trigger.items {
        match &item.trigger {


            //TODO: FINISH THE COMPARISON TODAY!!!
            KeyEventType::KeyPressEvent(s) => {
                let checked_macro_trigger_string: String = match s.keypress {
                    Keycode::Comma => "Semicolon".to_string(),
                    _ => "".to_string(),
                };


                println!("Found, debug info: {} compared to {}", checked_macro_trigger_string, to_check_with_key_string);

                if checked_macro_trigger_string == to_check_with_key_string && item.active == true {
                    for macro_to_press in &item.body {
                        match macro_to_press {
                            KeyEventType::KeyPressEvent(s) => {
                                println!("EXECUTING MACRO!!");
                                s.execute_key_down();
                                thread::sleep(time::Duration::from_millis(
                                    s.get_wait_delay().as_secs(),
                                ));
                            }
                            _ => (),
                        }
                    }
                }
            }

            _ => (),
        }
    }
}

//TODO: Macro group functionality?
pub struct MacroGroup {
    name: String,
    //TODO: PNG/WEBP image?
    icon: char,
    items: Vec<Macro>,
    active: bool,
}

impl MacroGroup {
    ///Renames the Group of Macros
    fn rename(&mut self, new_name: String) {
        self.name = new_name;
    }
    ///Creates a new empty group (must have a name and an icon)
    fn new_group(name_of_group: &String, icon: char) -> MacroGroup {
        MacroGroup {
            name: name_of_group.to_string(),
            icon,
            items: vec![Macro {
                name: name_of_group.to_string(),
                body: vec![KeyPressEvent(KeyPress {
                    keypress: Keycode::O,
                    press_wait_delay_after: Default::default(),
                    press_duration: Default::default(),
                })],
                trigger: KeyPressEvent(KeyPress {
                    keypress: Keycode::O,
                    press_wait_delay_after: Default::default(),
                    press_duration: Default::default(),
                }),
                active: false,
            }],
            active: false,
        }
    }
    ///Adds a member to a group
    fn add_to_group(&mut self, macro_to_add: Macro) {
        self.items.push(macro_to_add);
    }

    ///List the macros
    fn list_macros(&self) {
        for macro_item in &self.items {
            println!("Macro: {:#?}", macro_item);
        }
    }
    ///Removes a macro from the group
    fn remove_macro_from_group(&mut self, macro_to_remove: String) {
        self.items.retain(|x| x.name != macro_to_remove);
    }
}

pub fn run_this() {
    println!("Character {}: {}", 'c', 'c' as u32);

    let testing_action = KeyEventType::SystemEvent(Action {
        action: 'd',
        press_wait_delay_after: time::Duration::from_millis(5),
    });

    let mut testing_macro_full = MacroGroup {
        name: "Main group".to_string(),
        icon: 'i',
        items: vec![Macro {
            name: "Paste".to_string(),
            body: vec![
                KeyEventType::KeyPressEvent(KeyPress {
                    keypress: Keycode::LControl,
                    press_wait_delay_after: time::Duration::from_millis(50),
                    press_duration: time::Duration::from_millis(50),
                }),
                KeyEventType::KeyPressEvent(KeyPress {
                    keypress: Keycode::V,
                    press_wait_delay_after: time::Duration::from_millis(50),
                    press_duration: time::Duration::from_millis(50),
                }),
            ],
            trigger: KeyEventType::KeyPressEvent(KeyPress {
                keypress: Keycode::Semicolon,
                press_wait_delay_after: time::Duration::from_millis(50),
                press_duration: time::Duration::from_millis(50),
            }),
            active: true,
        }],
        active: true,
    };

    loop {
        let user_input = get_user_input(format!(
            "Select what you want to do:
        1 - Start the key {}
        2 - List the macros in the group
        3 - Add a macro to the group
        4 - Remove a macro from the group",
            if USE_INPUT_GRAB == true {
                "grabber"
            } else {
                "logger"
            }
        ));

        let user_input: u8 = match user_input.trim().parse::<u8>() {
            Ok(T) => T,
            Err(E) => {
                println!("Error: {}", E);
                continue;
            }
        };

        match user_input {
            1 => {
                //execute_special_function(&testing_macro_full);

                let device_state = DeviceState::new();

                let mut _guard = device_state.on_key_down(move |key_watched| {
                    println!("Down: {:#?}", key_watched);
                    //key_watched_send = key_watched.clone();

                    check_key(&testing_macro_full, &key_watched);
                });

                let _guard = device_state.on_key_up(|key| {
                    println!("Up: {:#?}", key);
                });


                loop {}
            },

            2 => {
                testing_macro_full.list_macros();
            }
            3 => testing_macro_full.add_to_group(Macro::new(
                get_user_input("Enter the name of the macro: ".to_string()),
                vec![KeyPressEvent(KeyPress::new(
                    Keycode::from_str(get_user_input("Enter the key to press: ".to_string()).as_str()).unwrap(),
                    time::Duration::from_millis(get_user_input_int(
                        "Enter how many millisecond delay after pressing: ".to_string(),
                    ) as u64),
                    time::Duration::from_millis(get_user_input_int(
                        "Enter how many millisecond time to hold the key for: ".to_string(),
                    ) as u64),
                ))],
                KeyPressEvent(KeyPress::new(
                    Keycode::from_str(get_user_input("Enter the key to press: ".to_string()).as_str()).unwrap(),
                    Default::default(),
                    Default::default(),
                )),
            )),
            4 => {
                testing_macro_full.list_macros();
                testing_macro_full.remove_macro_from_group(get_user_input(
                    "Enter the name of the macro to remove: ".to_string(),
                ))
            }
            _ => {
                println!("Invalid input");
                continue;
            }
        };
    }

    //Temporary "option" for either using the input grab or not.
}

// fn send(event_type: &EventType) {
//     let delay = time::Duration::from_millis(20);
//     match simulate(event_type) {
//         Ok(()) => (),
//         Err(SimulateError) => {
//             println!("We could not send {:?}", event_type);
//         }
//     }
//     // Let ths OS catchup (at least MacOS)
//     thread::sleep(delay);
// }

///Gets user's text.
fn get_user_input(display_text: String) -> String {
    println!("{}\n", display_text);

    let mut buffer: String = String::new();

    std::io::stdin()
        .read_line(&mut buffer)
        .expect("Invalid type");
    buffer.trim().to_string()
}

///Gets user's text and parse into i64. TODO: This needs much more work
fn get_user_input_int(display_text: String) -> i64 {
    println!("{}\n", display_text);

    let mut buffer: String = String::new();

    std::io::stdin()
        .read_line(&mut buffer)
        .expect("Invalid type");

    let vector_chars = buffer.trim().chars().next().unwrap();

    println!("Vector chars: {}", vector_chars);

    return vector_chars as i64;
}

//
// //TODO: Match this with an event table.. fork the library to do that..?
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
//
// fn callback_listen_only(event: Event) {
//     println!("My callback {:?}", event);
// }

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
