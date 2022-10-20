use std::{result, thread, time};
use std::collections::HashMap;
use std::str::{Bytes, FromStr};
use std::sync::mpsc::channel;
use std::time::Duration;

use rdev::{Button, Event, EventType, grab, Key, listen, simulate, SimulateError};

use crate::ApplicationConfig;

/// MacroType that wraps the Macro struct. Depending on the type we decide what to do.
/// This does not yet do anything.
#[derive(Debug)]
pub enum MacroType {
    Single(Macro),
    Repeating(Macro),
    OnHold(Macro),
    MultiLevel(Macro),
}

impl MacroType {}

/// Key contains an rdev::Key enum to be pressed.
/// * `keypress` - an rdev::Key enum of the key that will be pressed
/// * `press_wait_delay_after` - time::Duration argument that makes the macro wait after (this is subject to change potentially)
/// * `press_duration` - time::Duration for how long the key should stay pressed for (currently not implemented or used)
#[derive(Debug)]
struct KeyPress {
    keypress: rdev::Key,
    press_wait_delay_after: time::Duration,
    press_duration: time::Duration,
}

impl KeyPress {
    /// Executes an action on key up.
    /// TODO: Meant to search the eventlist and remove all duplicates of the keys being pressed.
    ///  This should be either paired with each keypress, or called after registering that key release to clean up the array
    fn execute_key_up(&self, key_to_release: &rdev::Key, event_list: &EventList) {
        send(&EventType::KeyRelease(*key_to_release));
    }

    /// Executes the actual keypress according to what it should be
    fn execute_key_down(&self) {
        send(&EventType::KeyPress(self.keypress));
        thread::sleep(time::Duration::from_millis(50));
    }

    /// Getter function
    fn get_wait_delay(&self) -> time::Duration {
        self.press_wait_delay_after
    }

    /// Creates a new key from parameters provided right away.
    /// * `keypress` - rdev::Key in question
    /// * `press_wait_delay_after` - time::Duration for how long to wait after keypress (might get moved)
    /// * `press_duration` - time::Duration for how long the key should be pressed for (unimplemented for now)
    fn new_construct(
        keypress: rdev::Key,
        press_wait_delay_after: time::Duration,
        press_duration: time::Duration,
    ) -> KeyPress {
        KeyPress {
            keypress,
            press_wait_delay_after,
            press_duration,
        }
    }

    fn new() -> KeyPress {
        KeyPress {
            keypress: rdev::Key::Unknown(0),
            press_wait_delay_after: time::Duration::default(),
            press_duration: time::Duration::default(),
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
/// output
#[derive(Debug)]
pub enum ActionEventType {
    KeyPressEvent(KeyPress),
    SystemEvent(Action),
    PhillipsHueCommand(),
    OBS(),
    DiscordCommand(),
    UnicodeDirect(),
}

///input enum
#[derive(Debug)]
pub enum TriggerEventType {
    KeyPressEvent(KeyPress),
}

impl TriggerEventType {
    fn press_key_down(&self) {
        match self {
            TriggerEventType::KeyPressEvent(s) => {
                todo!("not yet done");
            }
            _ => unimplemented!("Error! Implement this!"),
        }
    }
}

impl ActionEventType {
    //TODO: execute function? Seems a bit annoying but could work.
    //TODO: Make a trait probably, that has an "execute" function, implemented individually. Special logic for the KeyUp and Down linking.
    fn press_key_down(&self) {
        match self {
            ActionEventType::KeyPressEvent(s) => {
                todo!("not yet done");
            }
            ActionEventType::SystemEvent(s) => {
                todo!("Not yet done");
            }
            ActionEventType::PhillipsHueCommand() => {
                todo!("Not yet done");
            }
            ActionEventType::DiscordCommand() => {
                todo!("Not yet done");
            }
            ActionEventType::UnicodeDirect() => {
                todo!("Not yet done");
            }
            _ => unimplemented!("Error! Implement this!"),
        }
    }
}

#[derive(Debug)]
struct EventList(Vec<rdev::Key>);

impl EventList {
    fn new() -> EventList {
        EventList { 0: vec![] }
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
    body: Vec<ActionEventType>,
    trigger: TriggerEventType,
    active: bool,
}

impl Macro {
    fn rename(&mut self, new_name: String) {
        self.name = new_name;
    }
    fn new(name: String, body: Vec<ActionEventType>, trigger: TriggerEventType) -> Macro {
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
fn check_key(checked_macro_trigger: &MacroGroup, to_check_with_key: &rdev::Key) {
    for macro_items in &checked_macro_trigger.items {
        if macro_items.active == true {
            match &macro_items.trigger {
                TriggerEventType::KeyPressEvent(s) => {
                    if s.keypress == *to_check_with_key {
                        println!("MATCHED!!!! EXECUTING MACRO");
                        s.execute_key_down();
                    };
                }
                _ => (),
            }
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
                body: vec![ActionEventType::KeyPressEvent(KeyPress {
                    keypress: rdev::Key::KeyO,
                    press_wait_delay_after: Default::default(),
                    press_duration: Default::default(),
                })],
                trigger: TriggerEventType::KeyPressEvent(KeyPress {
                    keypress: rdev::Key::KeyO,
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

pub fn run_this(config: &ApplicationConfig) {
    println!("Character {}: {}", 'c', 'c' as u32);

    let testing_action = ActionEventType::SystemEvent(Action {
        action: 'd',
        press_wait_delay_after: time::Duration::from_millis(5),
    });

    let mut testing_macro_full = MacroGroup {
        name: "Main group".to_string(),
        icon: 'i',
        items: vec![Macro {
            name: "Paste".to_string(),
            body: vec![
                ActionEventType::KeyPressEvent(KeyPress {
                    keypress: rdev::Key::ControlLeft,
                    press_wait_delay_after: time::Duration::from_millis(50),
                    press_duration: time::Duration::from_millis(50),
                }),
                ActionEventType::KeyPressEvent(KeyPress {
                    keypress: rdev::Key::KeyV,
                    press_wait_delay_after: time::Duration::from_millis(50),
                    press_duration: time::Duration::from_millis(50),
                }),
            ],
            trigger: TriggerEventType::KeyPressEvent(KeyPress {
                keypress: rdev::Key::SemiColon,
                press_wait_delay_after: time::Duration::from_millis(50),
                press_duration: time::Duration::from_millis(50),
            }),
            active: true,
        }],
        active: true,
    };

    // Testing this feature of rdev separate thread
    // spawn new thread because listen blocks
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

    //let mut events = Vec::new();


    let mut keys_pressed: EventList = EventList::new();

    for event in rchan.iter() {
        match event.event_type {
            EventType::KeyPress(s) => {
                //TODO: Make this a hashtable or smth
                println!("Pressed: {:?}", s);

                check_key(&testing_macro_full, &s)
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

    // loop {
    //     let user_input = get_user_input(format!(
    //         "Select what you want to do:
    //     1 - Start the key {}
    //     2 - List the macros in the group
    //     3 - Add a macro to the group
    //     4 - Remove a macro from the group",
    //         if USE_INPUT_GRAB == true {
    //             "grabber"
    //         } else {
    //             "logger"
    //         }
    //     ));
    //
    //     let user_input: u8 = match user_input.trim().parse::<u8>() {
    //         Ok(T) => T,
    //         Err(E) => {
    //             println!("Error: {}", E);
    //             continue;
    //         }
    //     };
    //
    //     match user_input {
    //         1 => {
    //             //execute_special_function(&testing_macro_full);
    //
    //             let device_state = DeviceState::new();
    //
    //
    //             let mut _guard = device_state.on_key_down(move |key_watched| {
    //                 println!("Down: {:#?}", key_watched);
    //                 //key_watched_send = key_watched.clone();
    //
    //
    //
    //                 check_key(&testing_macro_full, &key_watched);
    //             });
    //
    //             let _guard = device_state.on_key_up(|key| {
    //                 println!("Up: {:#?}", key);
    //             });
    //
    //             loop {}
    //         }
    //
    //         2 => {
    //             testing_macro_full.list_macros();
    //         }
    //         3 => {
    //             testing_macro_full.add_to_group(Macro::new(
    //                 get_user_input("Enter the name of the macro: ".to_string()),
    //                 vec![KeyPressEvent(KeyPress::new(
    //                     Keycode::from_str(
    //                         get_user_input("Enter the key to press: ".to_string()).as_str(),
    //                     )
    //                     .unwrap(),
    //                     time::Duration::from_millis(get_user_input_int(
    //                         "Enter how many millisecond delay after pressing: ".to_string(),
    //                     ) as u64),
    //                     time::Duration::from_millis(get_user_input_int(
    //                         "Enter how many millisecond time to hold the key for: ".to_string(),
    //                     ) as u64),
    //                 ))],
    //                 KeyPressEvent(KeyPress::new(
    //                     Keycode::from_str(
    //                         get_user_input("Enter the key to press: ".to_string()).as_str(),
    //                     )
    //                     .unwrap(),
    //                     Default::default(),
    //                     Default::default(),
    //                 )),
    //             ));
    //             println!("Macro Added!");
    //         }
    //         4 => {
    //             testing_macro_full.list_macros();
    //             testing_macro_full.remove_macro_from_group(get_user_input(
    //                 "Enter the name of the macro to remove: ".to_string(),
    //             ))
    //         }
    //         _ => {
    //             println!("Invalid input");
    //             continue;
    //         }
    //     };
    // }

    //Temporary "option" for either using the input grab or not.
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
