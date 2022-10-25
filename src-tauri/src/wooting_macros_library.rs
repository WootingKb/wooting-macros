use std::{result, thread, time};
use std::collections::HashMap;
use std::fmt::{format, Formatter};
use std::str::{Bytes, FromStr};
use std::sync::mpsc::channel;
use std::time::Duration;

use rdev::{Button, Event, EventType, grab, Key, listen, simulate, SimulateError};
use serde::Serialize;

use crate::ApplicationConfig;

//TODO: Move all the specific functions here.
trait MacroFunctions {
    fn check_key(&self, to_check_with_key: &rdev::Key) {}

    fn list_macros(&self) {}

    fn set_name(&mut self, new_name: String) {}

    fn get_name(&self) -> String {
        unimplemented!("Unimplemented string")
    }

    fn set_active(&mut self, active: bool) {}

    fn get_active(&self) -> bool {
        unimplemented!("Unimplemented value")
    }

    fn push_new(&mut self, macro_to_add: Macro) {}

    fn remove(&mut self, macro_name_to_remove: String) {}
}

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
    /// TODO: Meant to search the event list and remove all duplicates of the keys being pressed.
    ///  This should be either paired with each keypress, or called after registering that key release to clean up the array
    fn execute_key_up(&self, key_to_release: &rdev::Key) {
        send(&EventType::KeyRelease(*key_to_release));
    }

    /// Executes the actual keypress according to what it should be
    fn execute_key_down(&self) {
        send(&EventType::KeyPress(self.keypress));
        thread::sleep(self.press_duration);

        self.execute_key_up(&self.keypress);
        thread::sleep(self.press_wait_delay_after);
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

impl std::fmt::Display for ActionEventType {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        let mut buffer_text: String = "".to_string();
        let mut number = 0;

        match &self {
            ActionEventType::KeyPressEvent(i) => {
                buffer_text += format!(
                    "\n\t\tKey #{}\n\t\tKey: {:?}\tDelayAfterPress: {} ms\tDuration: {} ms",
                    number,
                    i.keypress,
                    i.press_wait_delay_after.as_millis(),
                    i.press_duration.as_millis()
                )
                    .as_str();
                number += 1;
            }
            ActionEventType::SystemEvent(_) => {}
            ActionEventType::PhillipsHueCommand() => {}
            ActionEventType::OBS() => {}
            ActionEventType::DiscordCommand() => {}
            ActionEventType::UnicodeDirect() => {}
        }

        write!(f, "{}", buffer_text)
    }
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

impl MacroFunctions for Macro {
    /// Sets the name of the Macro to something else
    fn set_name(&mut self, new_name: String) {
        self.name = new_name;
    }

    /// Gets the name
    fn get_name(&self) -> String {
        self.name.clone()
    }

    /// Sets the macro to be either active or inactive
    fn set_active(&mut self, active: bool) {
        self.active;
    }

    /// Gets the active status
    fn get_active(&self) -> bool {
        self.active
    }

    fn check_key(&self, to_check_with_key: &rdev::Key) {
        if self.active == true {
            match &self.trigger {
                TriggerEventType::KeyPressEvent(s) => {
                    if s.keypress == *to_check_with_key {
                        println!("MATCHED!!!! EXECUTING MACRO");
                        for body in &self.body {
                            match body {
                                ActionEventType::KeyPressEvent(s) => {
                                    s.execute_key_down()
                                }
                                ActionEventType::SystemEvent(_) => {}
                                ActionEventType::PhillipsHueCommand() => {}
                                ActionEventType::OBS() => {}
                                ActionEventType::DiscordCommand() => {}
                                ActionEventType::UnicodeDirect() => {}
                            }
                        }
                    };
                }
                _ => (),
            }
        }
    }
}

impl std::fmt::Display for Macro {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        let mut buffer_text: String = "".to_string();
        let mut number = 0;

        buffer_text += format!(
            "There are {} keys in the macro {}.\n",
            self.body.len(),
            self.name
        )
            .as_str();

        for i in &self.body {
            buffer_text += format!("Key {}: {}", number, i).as_str();
            number += 1;
        }

        write!(f, "{}", buffer_text)
    }
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
}

///MacroData is the main data structure that contains all macro data.
#[derive(Debug, Clone)]
pub struct MacroData(Vec<MacroGroup>);

impl MacroData {
    ///Search for a macro group in all macro groups.
    fn find(&self, search_string: String) -> Option<Vec<MacroGroup>> {
        let mut result: Vec<MacroGroup> = vec![];

        for i in &self.0 {
            if i.name == search_string {
                result.push(i.clone());
            }
        }

        match result.len() {
            0 => None,
            _ => Some(result),
        }
    }

    fn new_group(&mut self, name: String) {
        self.0.push(MacroGroup::new_group(&name, 'c'));
    }
}

impl std::fmt::Display for MacroData {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        let mut buffer_text: String = "".to_string();
        let mut number = 0;

        buffer_text += format!("There are {} macro groups.\n", &self.0.len()).as_str();

        for i in &self.0 {
            buffer_text += format!(
                "\tGroup {}\n\tGroupName: {}\n\tActive: {}\n+++++++++++\n",
                number, i.name, i.active
            )
                .as_str();
            number += 1;
            buffer_text += format!("\nMacro {}\n{}", i.name, i).as_str();
        }

        write!(f, "{}", buffer_text)
    }
}

///Trait implementation for MacroData
impl MacroFunctions for MacroData {
    fn check_key(&self, to_check_with_key: &rdev::Key) {
        println!("Checking against {:?}", to_check_with_key);

        for macro_group in &self.0 {
            println!("Checking group");
            for macro_items in &macro_group.items {
                macro_items.check_key(to_check_with_key);
                // println!("Checking item");
                // if macro_items.active == true {
                //     println!("Checking item allowed");
                //     match &macro_items.trigger {
                //         TriggerEventType::KeyPressEvent(s) => {
                //             println!("Checking with");
                //
                //             if s.keypress == *to_check_with_key {
                //                 println!("MATCHED!!!! EXECUTING MACRO");
                //                 s.execute_key_down();
                //                 break
                //             };
                //         }
                //         _ => (),
                //     }
                // }
            }
        }
    }
    fn list_macros(&self) {
        for macro_groups in &self.0 {
            println!("Listing Macros:\n{}", macro_groups);
        }
    }
    fn push_new(&mut self, macro_to_add: Macro) {
        //show macro list
        self.list_macros();

        //choose to which group to push it
        let selection_level: usize = get_user_input("Enter the macro group ID".to_string())
            .parse()
            .unwrap();

        for (i, j) in self.0.iter_mut().enumerate() {
            if selection_level == i {
                j.items.push(macro_to_add.clone())
            }
        }
    }

    ///Removes a group entirely
    fn remove(&mut self, macro_to_remove: String) {
        self.0.retain(|x| x.name != macro_to_remove);
    }
}

//TODO: Macro group functionality?
///MacroGroup is a group of macros. It can be active or inactive. Contains an icon and a name.
/// * `name` - String based name of the MacroGroup
/// * `icon` - Placeholder for now
/// * `items` - Macros (vector) that belong to a group
/// * `active` - Whether they should be executable
#[derive(Debug, Clone)]
pub struct MacroGroup {
    name: String,
    //TODO: PNG/WEBP image?
    icon: char,
    items: Vec<Macro>,
    active: bool,
}

impl std::fmt::Display for MacroGroup {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        let mut buffer_text: String = "".to_string();
        let mut number = 0;

        buffer_text += format!(
            "There are {} macros in the group {}.\n",
            &self.items.len(),
            &self.name
        )
            .as_str();

        for i in &self.items {
            buffer_text += format!(
                "========\n\tMacro # {}\n\tMacroName: {}\tActive: {}",
                number, i.name, i.active
            )
                .as_str();
            for j in &i.body {
                buffer_text += format!("\n\t\tKeys: {}\n", j).as_str();

            }
            number += 1;
        }

        write!(f, "{}", buffer_text)
    }
}

///Trait implementation for MacroGroup
impl MacroFunctions for MacroGroup {
    fn list_macros(&self) {
        for macro_item in &self.items {
            println!("Macro: {:#?}", macro_item);
        }
    }

    /// Sets the name of the Macro to something else
    fn set_name(&mut self, new_name: String) {
        self.name = new_name;
    }

    /// Gets the name
    fn get_name(&self) -> String {
        self.name.clone()
    }

    /// Sets the macro to be either active or inactive
    fn set_active(&mut self, active: bool) {
        self.active;
    }

    /// Gets the active status
    fn get_active(&self) -> bool {
        self.active
    }

    /// Pushes a new Macro to the group
    /// * `macro_to_add` - Macro type to add (construct using a new operator)
    fn push_new(&mut self, macro_to_add: Macro) {
        self.items.push(macro_to_add);
    }

    ///Removes a macro from a group
    fn remove(&mut self, macro_to_remove: String) {
        self.items.retain(|x| x.name != macro_to_remove);
    }
}

///Individual methods for MacroGroup
impl MacroGroup {
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

    ///Search for a macro in a group
    fn find(&self, search_string: &String) -> Option<Vec<Macro>> {
        let mut result = vec![];
        self.items.iter().for_each(|x| {
            if x.name.contains(search_string) {
                println!("Result is: {:?}", x);
                result.push(x.clone());
            }
        });

        match result.len() {
            0 => None,
            _ => Some(result),
        }
    }
}

///Main loop for now (of the library)
/// * `config` - &ApplicationConfig from the parsed JSON config file of the app.
pub fn run_this(config: &ApplicationConfig) {
    println!("Character {}: {}", 'c', 'c' as u32);

    let testing_action = ActionEventType::SystemEvent(Action {
        action: 'd',
        press_wait_delay_after: time::Duration::from_millis(5),
    });

    //Very temporary debugging only variable (so I can precisely see and manipulate data
    let mut testing_macro_full: MacroData = MacroData {
        0: vec![
            MacroGroup {
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
            },
            MacroGroup {
                name: "Fun macro group".to_string(),
                icon: 'i',
                items: vec![
                    Macro {
                        name: "Havo".to_string(),
                        body: vec![
                            ActionEventType::KeyPressEvent(KeyPress {
                                keypress: rdev::Key::KeyL,
                                press_wait_delay_after: time::Duration::from_millis(50),
                                press_duration: time::Duration::from_millis(50),
                            }),
                            ActionEventType::KeyPressEvent(KeyPress {
                                keypress: rdev::Key::KeyO,
                                press_wait_delay_after: time::Duration::from_millis(50),
                                press_duration: time::Duration::from_millis(50),
                            }),
                            ActionEventType::KeyPressEvent(KeyPress {
                                keypress: rdev::Key::KeyL,
                                press_wait_delay_after: time::Duration::from_millis(50),
                                press_duration: time::Duration::from_millis(50),
                            }),
                        ],
                        trigger: TriggerEventType::KeyPressEvent(KeyPress {
                            keypress: rdev::Key::KpMultiply,
                            press_wait_delay_after: time::Duration::from_millis(50),
                            press_duration: time::Duration::from_millis(50),
                        }),
                        active: true,
                    },
                    Macro {
                        name: "Svorka".to_string(),
                        body: vec![ActionEventType::KeyPressEvent(KeyPress {
                            keypress: rdev::Key::KeyS,
                            press_wait_delay_after: time::Duration::from_millis(50),
                            press_duration: time::Duration::from_millis(50),
                        })],
                        trigger: TriggerEventType::KeyPressEvent(KeyPress {
                            keypress: rdev::Key::KpMinus,
                            press_wait_delay_after: time::Duration::from_millis(50),
                            press_duration: time::Duration::from_millis(50),
                        }),
                        active: true,
                    },
                ],
                active: true,
            },
        ],
    };

    //let mut events = Vec::new();

    loop {
        let user_input = get_user_input(format!(
            "Select what you want to do:
        1 - Start the key {}
        2 - List the macros in the group
        3 - Add a new group
        4 - Add a macro to the group
        5 - Remove a group of macros
        6 - Remove a macro from a specific group
        7 - Search for a group
        8 - Search for a macro",
            if config.use_input_grab == true {
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

                let mut events = Vec::new();

                for event in rchan.iter() {
                    events.push(event);

                    for i in &events {
                        //println!("{:?}", events.len());
                        match i.event_type {
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
                    events.pop();
                }
            }

            2 => {
                println!("{}", testing_macro_full);
                // testing_macro_full.list_macros();
            }
            3 => testing_macro_full
                .new_group(get_user_input("Enter the macro group name".to_string())),
            4 => {
                let push_this = Macro::new_construct(
                    get_user_input("Enter the name for the macro".to_string()),
                    vec![ActionEventType::KeyPressEvent(KeyPress {
                        keypress: Key::KeyC,
                        press_wait_delay_after: time::Duration::from_millis(get_user_input_int(
                            "Enter how many millisecond delay after pressing: ".to_string(),
                        )
                            as u64),
                        press_duration: Default::default(),
                    })],
                    TriggerEventType::KeyPressEvent(KeyPress {
                        keypress: Key::KpPlus,
                        press_wait_delay_after: time::Duration::from_millis(get_user_input_int(
                            "Enter how many millisecond delay after pressing: ".to_string(),
                        )
                            as u64),
                        press_duration: Default::default(),
                    }),
                );

                testing_macro_full.push_new(push_this)
            }

            5 => {
                testing_macro_full
                    .0
                    .iter()
                    .for_each(|x| println!("{}", x.name));
                testing_macro_full.remove(get_user_input(
                    "Enter the name of the macro to remove: ".to_string(),
                ))
            }
            6 => {
                testing_macro_full.list_macros();

                for i in &mut testing_macro_full.0 {
                    for mut j in &mut i.items {
                        j.remove(get_user_input(
                            "Enter the name of the macro to remove: ".to_string(),
                        ))
                    }
                }
            }
            7 => {
                match testing_macro_full.find(get_user_input("Enter the search term\n".to_string()))
                {
                    None => println!("No groups with that name exist"),
                    Some(T) => T.iter().for_each(|x| println!("Found: {}", x)),
                }
            }
            8 => {
                let result = get_user_input("Enter the search term\n".to_string());

                for i in &testing_macro_full.0 {
                    match i.find(&result) {
                        None => println!("No macro with that name exists in group {}", i.name),
                        Some(T) => T.iter().for_each(|x| println!("Found: {}", x)),
                    }
                }
            }
            _ => {
                println!("Invalid input");
                continue;
            }
        };
    }

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
