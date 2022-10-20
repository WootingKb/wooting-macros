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
#[derive(Debug, Clone)]
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

    /// Constructs and returns a new empty type.
    fn new() -> KeyPress {
        KeyPress {
            keypress: rdev::Key::Unknown(0),
            press_wait_delay_after: time::Duration::default(),
            press_duration: time::Duration::default(),
        }
    }
}

/// Action event type is the *output* action that is sent to the system after being processed by the backend.
/// Each of these have a struct embedded within them to provide the necessary data for the execution.
/// Think of this as plugins. Currently supported:
/// * `KeyPressEvent` - A simple keypress (which releases after a while).
/// * `SystemEvent` - An action like launching a browser, copying a file, pasting from the clipboard, etc.
/// * `PhillipsHueCommand` - After initializing, you can use this to control lights via the BridgeV2.
/// * `OBS` - OpenBroadcastSoftware integration
/// * `DiscordCommand` - Discord integration (muting microphone, deafening)
/// * `UnicodeDirect` - Output a Unicode symbol of choice
#[derive(Debug, Clone)]
pub enum ActionEventType {
    KeyPressEvent(KeyPress),
    SystemEvent(Action),
    PhillipsHueCommand(),
    OBS(),
    DiscordCommand(),
    UnicodeDirect(),
}

impl ActionEventType {
    //TODO: Right now unused for unknown reasons
    fn press_key_down(&self) {}
}

/// These are the events that can come from within the OS and are supported as triggers for running a macro.
/// Currently supported:
/// * `KeyPressEvent` - Very much like the output counterpart, a key event that can be caught using a grab feature and processed.
#[derive(Debug, Clone)]
pub enum TriggerEventType {
    KeyPressEvent(KeyPress),
}

impl TriggerEventType {
    //TODO: Right now unused for unknown reasons
}

/// The list of events that are currently happening (basically a list of all keys or buttons currently being pressed).
/// Helps to check this list after a change to see if to trigger a macro.
#[derive(Debug, Clone)]
struct EventList(Vec<rdev::Key>);

impl EventList {
    /// Returns a new empty event list ready to be populated
    fn new() -> EventList {
        EventList { 0: vec![] }
    }
    //TODO: Push and pop methods?
}

/// Action is a structure currently unused.
/// Action serves for the system actions (paste clipboard, etc). Not used yet.
#[derive(Debug, Clone)]
pub struct Action {
    pub action: char,
    pub press_wait_delay_after: time::Duration,
}

impl Action {}

/// Macro is the main building block that has several fields.
/// * `name` - Name of the macro.
/// * `body` - Actions to execute within a macro.
/// * `trigger` - The trigger event that can trigger the macro to execute
/// * `active` - whether the macro is active (should be executed when conditions meet) or not.
#[derive(Debug, Clone)]
pub struct Macro {
    name: String,
    //TODO: really think about the timeline as it ties into here
    body: Vec<ActionEventType>,
    trigger: TriggerEventType,
    active: bool,
}

impl Macro {
    /// Creates a new macro with parameters.
    /// * `name` - Name of the macro.
    /// * `body` - Actions to execute within a macro.
    /// * `trigger` - The trigger event that can trigger the macro to execute
    /// * `active` - Always set to false. Whether the macro is active (should be executed when conditions meet) or not.
    fn new_construct(name: String, body: Vec<ActionEventType>, trigger: TriggerEventType) -> Macro {
        Macro {
            name,
            body,
            trigger,
            active: false,
        }
    }

    /// Returns a clear new Macro struct
    fn new() -> Macro {
        Macro {
            name: "".to_string(),
            body: vec![],
            trigger: TriggerEventType::KeyPressEvent(KeyPress::new()),
            active: false,
        }
    }

    /// Sets the name of the Macro to something else
    pub fn set_name(&mut self, new_name: String) {
        self.name = new_name;
    }

    /// Sets the macro to be either active or inactive
    pub fn set_active(&mut self, active: bool) {
        self.active;
    }

    /// Gets the active status
    pub fn get_active(&self) -> bool {
        self.active
    }

    /// Gets the name
    pub fn get_name(&self) -> String {
        self.name.clone()
    }

    /// Get trigger event type
    fn get_trigger_event(&self) -> TriggerEventType {
        self.trigger.clone()
    }

    /// Get the trigger key
    pub fn get_trigger_event_key(&self) -> rdev::Key {
        match self.get_trigger_event() {
            TriggerEventType::KeyPressEvent(s) => s.keypress,
        }
    }

    // //TODO: We cannot convert to strings yet. Manually need to add a method for that...
    // pub fn get_actions_key_names_string(&self) -> Vec<String> {
    //     let mut vector: Vec<String> = vec![];
    //
    //     for items in self.body {
    //         match items {
    //             ActionEventType::KeyPressEvent(s) => {
    //                 match s.keypress{
    //
    //                 }
    //
    //             },
    //             _ => {
    //
    //             }
    //         };
    //     }
    //
    //     vector
    //
    // }
}

// /// Check if the key matches with the macro
// fn check_key(checked_macro_trigger: &MacroGroup, to_check_with_key: &rdev::Key) {
//     for macro_items in &checked_macro_trigger.items {
//         if macro_items.active == true {
//             match &macro_items.trigger {
//                 TriggerEventType::KeyPressEvent(s) => {
//                     if s.keypress == *to_check_with_key {
//                         println!("MATCHED!!!! EXECUTING MACRO");
//                         s.execute_key_down();
//                     };
//                 }
//                 _ => (),
//             }
//         }
//     }
// }

pub struct MacroData(Vec<MacroGroup>);

impl MacroData {
    /// Checks and triggers the macro if there is such trigger
    // TODO: remake this into a hashmap check
    pub fn check_key(&self, to_check_with_key: &rdev::Key) {
        for macro_group in &self.0 {
            for macro_items in &macro_group.items {
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

    let mut testing_macro_full: MacroData = MacroData {
        0: vec![MacroGroup {
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
        }],
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

                testing_macro_full.check_key(&s);
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
