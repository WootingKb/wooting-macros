use std::str::Bytes;
use std::time;

#[derive(Debug)]
pub enum MacroType {
    Single,
    Repeating,
    OnHold,
    MultiLevel,
}

#[derive(Debug)]
pub struct Key {
    pub keypress: char,
    pub press_wait_delay_after: time::Duration,
    pub press_duration: time::Duration,
}
#[derive(Debug)]
pub enum KeyPress {
    KeyEvent(Key),
    ActionEvent(Action),
}

pub fn run_this() {
    let testing_keypress = KeyPress::KeyEvent(Key {
        keypress: 'c',
        press_wait_delay_after: time::Duration::from_millis(50),
        press_duration: time::Duration::from_millis(50),
    });

    let testing_action = KeyPress::ActionEvent(Action {
        action: 'd',
        press_wait_delay_after: time::Duration::from_millis(5),
    });

    match testing_keypress {
        KeyPress::KeyEvent(s) => println!("Result: {}", s.keypress),
        _ => (),
    }



}

#[derive(Debug)]
pub struct Action {
    pub action: char,
    pub press_wait_delay_after: time::Duration,
}
