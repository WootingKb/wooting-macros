use std::str::Bytes;
use std::time;

/// MacroType that wraps the Macro struct. Depending on the type we decide what to do.
///
#[derive(Debug)]
pub enum MacroType {
    Single(Macro),
    Repeating(Macro),
    OnHold(Macro),
    MultiLevel(Macro),
}

/// Key contains a temporary char that needs to be changed,
/// the delay after pressing and pressing duration
#[derive(Debug)]
pub struct Key {
    pub keypress: char,
    pub press_wait_delay_after: time::Duration,
    pub press_duration: time::Duration,
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
pub enum KeyPress {
    KeyUpEvent(Key),
    KeyDownEvent(Key),
    SystemEvent(Action),
    PhillipsHueCommand(),
    DiscordCommand(),
    UnicodeDirect(),
}

#[derive(Debug)]
pub struct Action {
    pub action: char,
    pub press_wait_delay_after: time::Duration,
}

#[derive(Debug)]
pub struct Macro {
    name: String,
    //TODO: really think about the timeline as it ties into here
    trigger: Vec<KeyPress>,
}

//TODO: Macro group functionality?
#[derive(Debug)]
pub struct MacroGroup {
    name: String,
    //TODO: PNG/WEBP image?
    icon: char,
    items: Vec<Macro>,
}

pub fn run_this() {
    let testing_keypress = KeyPress::KeyUpEvent(Key {
        keypress: 'c',
        press_wait_delay_after: time::Duration::from_millis(50),
        press_duration: time::Duration::from_millis(50),
    });

    let testing_action = KeyPress::SystemEvent(Action {
        action: 'd',
        press_wait_delay_after: time::Duration::from_millis(5),
    });

    match testing_keypress {
        KeyPress::KeyUpEvent(s) => println!("Result: {}", s.keypress),
        _ => (),
    }
}
