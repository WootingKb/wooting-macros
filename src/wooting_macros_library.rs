use std::{thread, time};
use std::str::Bytes;

use rdev::{Button, Event, EventType, grab, Key, simulate, SimulateError};

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
    pub keypress: char,
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
        //let key_to_press = Key::Unknown(self.keypress as u32);

        println!(
            "{:#?}\nCharacter: {} number {}",
            self, self.keypress, self.keypress as u32
        );
        //let key_to_press = Key::KeyO;
        //send(&EventType::KeyPress(key_to_press));
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
    trigger: Vec<KeyEventType>,
}

impl Macro {}

//TODO: Macro group functionality?
#[derive(Debug)]
pub struct MacroGroup {
    name: String,
    //TODO: PNG/WEBP image?
    icon: char,
    items: Vec<Macro>,
}

impl MacroGroup {}

pub fn run_this() {
    println!("Character {}: {}", 'c', 'c' as u32);

    let testing_keypress = KeyEventType::KeyPressEvent(KeyPress {
        keypress: 'c',
        press_wait_delay_after: time::Duration::from_millis(50),
        press_duration: time::Duration::from_millis(50),
    });

    let testing_action = KeyEventType::SystemEvent(Action {
        action: 'd',
        press_wait_delay_after: time::Duration::from_millis(5),
    });

    thread::sleep(time::Duration::from_secs(3));
    testing_keypress.press_key_down();


    // This will block.
    if let Err(error) = grab(callback) {
        println!("Error: {:?}", error)
    }
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


//TODO: Match this with an event table
fn callback(event: Event) -> Option<Event> {
    println!("My callback {:?}", event);
    match event.event_type {
        EventType::KeyPress(Key::Tab) => {
            println!("Cancelling tab !");
            None
        }
        _ => Some(event),
    }
}