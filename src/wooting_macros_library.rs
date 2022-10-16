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

impl MacroType {

}

/// Key contains a temporary char that needs to be changed,
/// the delay after pressing and pressing duration.
#[derive(Debug)]
pub struct Key {
    pub keypress: char,
    pub press_wait_delay_after: time::Duration,
    pub press_duration: time::Duration,
}

///This basically serves as the implementation that gets called from the methods on KeyPress enum.
/// We always handle the input as: Keypress comes in -> triage -> call the execute according to logic -> process.
// TODO: This poses a question: do we change the enum variants to just a struct field instead of the enum embodying the struct?
impl Key {
    fn execute_key_up(&self){

    }
    fn execute_key_down(&self){

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
pub enum KeyPress {
    KeyUpEvent(Key),
    KeyDownEvent(Key),
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

impl KeyPress {

    //TODO: execute function? Seems a bit annoying but could work.
    //TODO: Make a trait probably, that has an "execute" function, implemented indivudally. Special logic for the KeyUp and Down linking.
    fn press_key_down(&self){
        match self {
            KeyPress::KeyDownEvent(s) =>{
                s.execute_key_down();
            },
            KeyPress::KeyUpEvent(s) => {
                s.execute_key_up();
            },
            KeyPress::SystemEvent(s) => {
                todo!("Not yet done");
            },
            KeyPress::PhillipsHueCommand() => {
                todo!("Not yet done");
            },
            KeyPress::DiscordCommand() => {
                todo!("Not yet done");
            },
            KeyPress::UnicodeDirect() => {
                todo!("Not yet done");
            },
            _ => unimplemented!("Error! Implement this!"),

        }

    }
}



#[derive(Debug)]
pub struct Action {
    pub action: char,
    pub press_wait_delay_after: time::Duration,
}

impl Action {

}

#[derive(Debug)]
pub struct Macro {
    name: String,
    //TODO: really think about the timeline as it ties into here
    trigger: Vec<KeyPress>,
}

impl Macro {

}

//TODO: Macro group functionality?
#[derive(Debug)]
pub struct MacroGroup {
    name: String,
    //TODO: PNG/WEBP image?
    icon: char,
    items: Vec<Macro>,
}

impl MacroGroup {

}

pub fn run_this() {
    let testing_keypress = KeyPress::KeyDownEvent(Key {
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
