mod hid_table;
pub mod plugin;

use std::fs::File;
use std::sync::atomic::{AtomicBool, Ordering};
use std::{thread, time};

use std::sync::Arc;
use tokio::sync::RwLock;

use crate::ActionEventType::{KeyPressEventAction, MouseEventAction};
use halfbrown::HashMap;
use rdev::{grab, simulate, Event, EventType, GrabError, SimulateError};
use tokio::sync::mpsc::{Receiver, Sender};
use tokio::task;

use crate::hid_table::*;
use crate::plugin::delay;
#[allow(unused_imports)]
use crate::plugin::discord;
use crate::plugin::key_press;
use crate::plugin::mouse;
use crate::plugin::mouse::{MouseAction, MousePressAction};
#[allow(unused_imports)]
use crate::plugin::obs;
use crate::plugin::phillips_hue;
use crate::plugin::system_event;
#[allow(unused_imports)]
use crate::plugin::system_event::{
    ClipboardAction, MonitorBrightnessAction, SystemAction, VolumeAction,
};
#[allow(unused_imports)]
use crate::plugin::unicode_direct;

///Type of a macro.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub enum MacroType {
    Single,
    // single macro fire
    Toggle,
    // press to start, press to finish cycle and terminate
    OnHold, // while held Execute macro (repeats)
}

//TODO: SERDE CAMEL CASE RENAME
//TODO: Press a key to open file browser with a specific path

///This enum is the registry for all actions that can be executed
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(tag = "type")]
pub enum ActionEventType {
    KeyPressEventAction {
        data: key_press::KeyPress,
    },
    SystemEventAction {
        data: system_event::SystemAction,
    },
    //Paste, Run commandline program (terminal run? standard user?), audio, open filemanager, workspace switch left, right,
    //TODO: System event - notification
    PhillipsHueEventAction {
        data: phillips_hue::PhillipsHueStatus,
    },
    //TODO: Phillips hue notification
    OBSEventAction {},
    DiscordEventAction {},
    //IKEADesk
    MouseEventAction {
        data: mouse::MouseAction,
    },
    UnicodeEventAction {},
    //TODO: Sound effects? Soundboards?
    //TODO: Sending a message through online webapi (twitch)
    DelayEventAction {
        data: delay::Delay,
    },
}

/// This enum is the registry for all incoming actions that can be analyzed for macro execution
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(tag = "type")]
pub enum TriggerEventType {
    KeyPressEvent {
        // TODO: This should be a Vec of u32, it shouldn't be sharing the type of the KeyPressEventAction
        data: Vec<key_press::KeyPress>,
        allow_while_other_keys: bool,
    },
    MouseEvent {
        data: mouse::MouseButton,
    },
    //TODO: computer time (have timezone support?)
    //TODO: computer temperature?
}

#[derive(Debug, Clone)]
pub struct EventList(Vec<rdev::Key>);

///This is a macro struct. Includes all information a macro needs to run
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Macro {
    pub name: String,
    pub sequence: Vec<ActionEventType>,
    pub macro_type: MacroType,
    pub trigger: TriggerEventType,
    pub active: bool,
}

impl Macro {
    fn new() -> Macro {
        Macro {
            name: "".to_string(),
            sequence: vec![],
            macro_type: MacroType::Single,
            trigger: TriggerEventType::KeyPressEvent {
                data: vec![],
                allow_while_other_keys: false,
            },
            active: false,
        }
    }

    async fn execute(&self, send_channel: Sender<EventType>) {
        for action in &self.sequence {
            match action {
                //TODO: make a channel for send to accept stuff
                //TODO: all of these should be sent onto a channel, while another thread is listening and executing
                //TODO: Keypress manager task <- enum EventType send and channel recv. Keypress manager task would spawn tasks for the actions
                //TODO: one task: listening for events and enforcing sleep time
                //TODO: keypressevent has access to the data and spawns a task for downup
                ActionEventType::KeyPressEventAction { data } => match data.keytype {
                    key_press::KeyType::Down => {
                        send_channel
                            .send(rdev::EventType::KeyPress(SCANCODE_TO_RDEV[&data.keypress]))
                            .await
                            .unwrap();
                        //send(&rdev::EventType::KeyPress(SCANCODE_TO_RDEV[&data.keypress]))
                    }
                    key_press::KeyType::Up => {
                        //     send(&rdev::EventType::KeyRelease(
                        //     SCANCODE_TO_RDEV[&data.keypress],
                        // ))
                        //TODO: send only event_type
                        send_channel
                            .send(rdev::EventType::KeyRelease(
                                SCANCODE_TO_RDEV[&data.keypress],
                            ))
                            .await
                            .unwrap();
                    }
                    key_press::KeyType::DownUp => {
                        //send(&rdev::EventType::KeyPress(SCANCODE_TO_RDEV[&data.keypress]));
                        //thread::sleep(time::Duration::from_millis(*&data.press_duration as u64));
                        //send(&rdev::EventType::KeyRelease(
                        //    SCANCODE_TO_RDEV[&data.keypress],
                        //));

                        //println!("Found a press/release event, sending it now");

                        send_channel
                            .send(rdev::EventType::KeyPress(SCANCODE_TO_RDEV[&data.keypress]))
                            .await
                            .unwrap();
                        thread::sleep(time::Duration::from_millis(*&data.press_duration as u64));
                        send_channel
                            .send(rdev::EventType::KeyRelease(
                                SCANCODE_TO_RDEV[&data.keypress],
                            ))
                            .await
                            .unwrap();
                    }
                },
                ActionEventType::PhillipsHueEventAction { .. } => {}
                ActionEventType::OBSEventAction { .. } => {}
                ActionEventType::DiscordEventAction { .. } => {}
                ActionEventType::UnicodeEventAction { .. } => {}
                ActionEventType::DelayEventAction { data } => {
                    thread::sleep(time::Duration::from_millis(*data))
                }

                ActionEventType::SystemEventAction { data } => {
                    let action_copy = data.clone();
                    let channel_copy = send_channel.clone();
                    task::spawn(async move { action_copy.execute(channel_copy).await });
                }
                ActionEventType::MouseEventAction { data } => {
                    let action_copy = data.clone();
                    let channel_copy = send_channel.clone();
                    task::spawn(async move { action_copy.execute(channel_copy).await });
                }
            }
        }
    }
}

///Collections are groups of macros.
type Collections = Vec<Collection>;

// struct MacroExecutor {
//     data: Macro,
//     event_channel: Sender<Event>,
//     task: JoinHandle<()>
// }

// impl MacroExecutor {
//     fn new(data: Macro, event_channel: Sender<Event>) -> MacroExecutor {
//         let (tx, rx) = channel();
//         let handle = task::spawn(async move {
//             let is_running = false;
//             loop {

//                 let event = rx.try_recv().await;
//                 if let Ok(event) = event {
//                    // if event === keypress { is_running = true; }
//                     // if event === keyrelease { is_running = false; }
//                 }

//                 // if is_running { execute macro }

//                 let event = rx.recv().await;
//                 match event {
//                     Some(event) => {

//                         data.execute(event_channel).await;
//                     }
//                     None => {

//                     }
//                 }
//             }
//         });

//         MacroExecutor {
//             data,
//             event_channel,
//             task: handle
//         }
//     }

//     fn event(&self, event: Event) {
//         self.event_channel.send(event);
//     }
// }

// struct TriggerLookup2<'a>
// {
//     macros:  Vec<MacroExecutor>,
//     lookup: HashMap<u32, Vec<&'a MacroExecutor>>,
// }

type MacroTriggerLookup = HashMap<u32, Vec<Macro>>;
//type MouseButtonTriggerLookup = HashMap<u32, Vec<Macro>>;

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "PascalCase")]
pub struct ApplicationConfig {
    pub use_input_grab: bool,
    pub startup_delay: u64,
}

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
pub struct BrightnessDevice {
    pub device_id: String,
    pub display_name: String,
    pub brightness: u32,
}

///State of the application in RAM (rwlock).
#[derive(Debug)]
pub struct MacroBackend {
    pub data: Arc<RwLock<MacroData>>,
    pub config: Arc<RwLock<ApplicationConfig>>,
    pub triggers: Arc<RwLock<MacroTriggerLookup>>,
    pub is_listening: Arc<AtomicBool>,
}

impl MacroBackend {
    ///Generates a new state.
    pub fn new() -> Self {
        let macro_data = MacroData::read_data();
        let triggers = macro_data.extract_triggers();
        MacroBackend {
            data: Arc::new(RwLock::from(macro_data)),
            config: Arc::new(RwLock::from(ApplicationConfig::read_data())),
            triggers: Arc::new(RwLock::from(triggers)),
            is_listening: Arc::new(AtomicBool::new(true)),
        }
    }

    pub fn set_is_listening(&self, is_listening: bool) {
        self.is_listening.store(is_listening, Ordering::Relaxed);
    }

    pub async fn get_brightness_devices(&self) -> Vec<BrightnessDevice> {
        #[cfg(any(target_os = "windows", target_os = "linux"))]
        {
            let result = brightness::brightness_devices();
            vec![]
        }

        #[cfg(target_os = "macos")]
        {
            vec![]
        }
    }

    pub async fn set_macros(&self, macros: MacroData) {
        macros.export_data();
        *self.triggers.write().await = macros.extract_triggers();
        *self.data.write().await = macros;
    }

    pub async fn set_config(&self, config: ApplicationConfig) {
        // TODO: async this
        config.write_to_file();
        *self.config.write().await = config;
    }

    pub async fn init(&self) {
        let (schan_execute, rchan_execute) = tokio::sync::mpsc::channel(1);

        task::spawn(async move {
            keypress_executor_sender(rchan_execute).await;
        });

        // let channel_execute_copy = schan_execute.clone();

        // task::spawn(async move {
        //     //==============TESTING GROUND======================
        //     let action_type = ActionEventType::MouseEventAction {
        //         data: MouseAction::Move { x: 1920, y: 1080 },
        //     };

        //     match action_type {
        //         ActionEventType::MouseEventAction { data } => {
        //             println!("RUNNING MOUSE ACTION {:?}", data);
        //             let channel_send = channel_execute_copy.clone();
        //             data.execute(channel_send).await;
        //         }
        //         _ => {}
        //     }
        // });

        //==============TESTING GROUND======================
        //==================================================

        //TODO: make this a grab instead of listen
        //TODO: try to make this interact better (cleanup the code a bit)

        //TODO: io-uring async read files and write files
        //TODO: implement drop when the application ends to clean up the downed keys

        //TODO: Make the modifier keys non-ordered?
        //==================================================

        //let (schan_grab, rchan_grab) = tokio::sync::mpsc::channel(1); //TODO: async tokio version

        let inner_config = self.config.clone();
        let inner_data = self.data.clone();
        let inner_triggers = self.triggers.clone();

        let inner_is_listening = self.is_listening.clone();
        println!("TRIGGERS: {:?}", inner_triggers.read().await);

        // let inner_keys_pressed = self.keys_pressed.clone();

        let _grabber = task::spawn_blocking(move || {
            let keys_pressed: Arc<RwLock<Vec<rdev::Key>>> = Arc::new(RwLock::new(vec![]));
            let keys_pressed = keys_pressed.clone();
            grab(move |event: rdev::Event| {
                match Ok::<&rdev::Event, GrabError>(&event) {
                    Ok(_data) => {
                        if inner_is_listening.load(Ordering::Relaxed) {
                            match event.event_type.clone() {
                                //TODO: Grab and discard the trigger actually
                                EventType::KeyPress(key) => {
                                    let key_to_push = key.clone();

                                    // println!("Key pressed: {:?}", key);

                                    let mut keys_pressed = keys_pressed.blocking_write();

                                    keys_pressed.push(key_to_push);

                                    // keys_pressed.push(key_to_push);

                                    println!("Pressed Keys: {:?}", keys_pressed);

                                    let pressed_keys_copy_converted: Vec<u32> = keys_pressed
                                        .iter()
                                        .map(|x| *SCANCODE_TO_HID.get(&x).unwrap_or(&0))
                                        .collect();

                                    let first_key: u32 = match pressed_keys_copy_converted.first() {
                                        None => 0,
                                        Some(data_first) => *data_first,
                                    };

                                    let trigger_list = inner_triggers.blocking_read().clone();

                                    let check_these_macros = match trigger_list.get(&first_key) {
                                        None => {
                                            vec![]
                                        }
                                        Some(data_found) => data_found.to_vec(),
                                    };

                                    let channel_copy_send = schan_execute.clone();

                                    let should_grab = check_macro_execution_efficiently(
                                        pressed_keys_copy_converted,
                                        check_these_macros,
                                        channel_copy_send,
                                    );

                                    if should_grab {
                                        None
                                    } else {
                                        Some(event)
                                    }
                                }

                                EventType::KeyRelease(key) => {
                                    let key_to_remove = key.clone();

                                    keys_pressed
                                        .blocking_write()
                                        .retain(|x| *x != key_to_remove);
                                    println!("Conifg: {:?}", keys_pressed.blocking_read());

                                    Some(event)
                                }

                                EventType::ButtonPress(button) => {
                                    // BUTTON_TO_HID[key]
                                    //TODO: Make a simple one click mouse button lookup here
                                    //let button_32_pushed: u32 = button.into();




                                   // println!("Button pressed: {:?}", button);
                                    //println!("Button pressed: {:?}", button);
                                    Some(event)
                                }
                                EventType::ButtonRelease(key) => {
                                    println!("Button pressed: {:?}", key);
                                    Some(event)
                                }
                                EventType::MouseMove { .. } => Some(event),
                                EventType::Wheel { delta_x, delta_y } => {
                                    println!("Button pressed: {:?} {:?}", delta_x, delta_y);
                                    Some(event)
                                }
                            }
                        } else {
                            println!("Event: {:?}", event);
                            Some(event)
                        }
                    }
                    Err(_) => None,
                }
            })
        });

        // let (schan_grab, rchan_grab) = channel(); //TODO: async tokio version
        // let _grabber = thread::spawn(move || {
        //     grab(
        //         move |event: rdev::Event| match schan_grab.send(event.clone()) {
        //             Ok(T) => {
        //                 let mut keys_pressed: Vec<rdev::Key>;
        //                 match &event.event_type {
        //                     //TODO: Grab and discard the trigger actually
        //                     EventType::KeyPress(key) => Some(event),
        //
        //
        //
        //                     _ => Some(event),
        //                 }
        //             }
        //             Err(_) => None,
        //         },
        //     )
        // });
        //
        // for event in &rchan_grab {
        //     events.push(event);
        //
        //     let test = 0;
        //     //TODO: channel this
        //     let macro_collections = APPLICATION_STATE.data.read().unwrap();
        //     let triggers = TRIGGERS_LIST.data.read().unwrap();
        //
        //     for i in &events {
        //         match i.event_type {
        //             EventType::KeyPress(listened_key) => {
        //                 pressed_keys.push(listened_key.clone());
        //
        //                 print!("\n{:?}", pressed_keys);
        //             }
        //             EventType::KeyRelease(listened_key) => {
        //                 pressed_keys.retain(|x| *x != listened_key);
        //                 println!("{:?}", pressed_keys);
        //             }
        //             EventType::ButtonPress(listened_key) => {
        //                 println!("MB Pressed:{:?}", listened_key)
        //             }
        //             EventType::ButtonRelease(listened_key) => {
        //                 println!("MB Released:{:?}", listened_key)
        //             }
        //             EventType::MouseMove { x, y } => (),
        //             EventType::Wheel { delta_x, delta_y } => {}
        //         }
        //
        //         let pressed_keys_copy_converted: Vec<u32> = pressed_keys
        //             .iter()
        //             .map(|x| *SCANCODE_TO_HID.get(&x).unwrap_or(&0))
        //             .collect();
        //
        //         let first_key: u32 = match pressed_keys_copy_converted.first() {
        //             None => 0,
        //             Some(T) => *T,
        //         };
        //
        //         let trigger_list = TRIGGERS_LIST.data.read().unwrap();
        //
        //         let check_these_macros = match trigger_list.get(&first_key) {
        //             None => {
        //                 vec![]
        //             }
        //             Some(T) => T.to_vec(),
        //         };
        //
        //         let channel_copy_send = schan_execute.clone();
        //
        //         task::spawn(async move {
        //             check_macro_execution_efficiently(
        //                 pressed_keys_copy_converted,
        //                 check_these_macros,
        //                 channel_copy_send,
        //             )
        //                 .await;
        //         });
        //     }
        //
        //     events.pop();
        // }
        //     });
    }
}

pub trait StateManagement {
    fn read_data() -> Self;

    fn write_to_file(&self);
}

impl StateManagement for ApplicationConfig {
    fn read_data() -> ApplicationConfig {
        let default: ApplicationConfig = ApplicationConfig {
            use_input_grab: false,
            startup_delay: 0,
        };
        return match File::open("../config.json") {
            Ok(data) => {
                let data: ApplicationConfig = serde_json::from_reader(&data).unwrap();
                data
            }

            Err(err) => {
                eprintln!("Error opening file, using default config {}", err);
                default.write_to_file();
                default
            }
        };
    }

    fn write_to_file(&self) {
        match std::fs::write(
            "../config.json",
            serde_json::to_string_pretty(&self).unwrap(),
        ) {
            Ok(_) => {
                println!("Success writing a new file");
            }
            Err(err) => {
                eprintln!(
                    "Error writing a new file, using only read only defaults. {}",
                    err
                );
            }
        };
    }
}

///MacroData is the main data structure that contains all macro data.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct MacroData {
    pub data: Collections,
}

impl MacroData {
    /// This exports data for the frontend to process it.
    /// Basically sends the entire struct to the frontend
    pub fn export_data(&self) {
        std::fs::write(
            "../data_json.json",
            serde_json::to_string_pretty(&self).unwrap(),
        )
        .unwrap();
    }

    pub fn extract_triggers(&self) -> MacroTriggerLookup {
        // let mut output_tuple: Vec<(rdev::Key, u32)> = vec![];

        let mut output_hashmap = MacroTriggerLookup::new();

        for collections in &self.data {
            if collections.active == true {
                for macros in &collections.macros {
                    if macros.active == true {
                        match &macros.trigger {
                            TriggerEventType::KeyPressEvent { data, .. } => {
                                // output_tuple.push((
                                //     SCANCODE_TO_RDEV[&data.first().unwrap().keypress],
                                //     data.first().unwrap().keypress.clone(),
                                // ));
                                //output_hashmap.insert_nocheck(data.clone().first().unwrap().keypress, macros.clone());

                                match output_hashmap.get_mut(&data.first().unwrap().keypress) {
                                    Some(value) => value.push(macros.clone()),
                                    None => output_hashmap.insert_nocheck(
                                        data.clone().first().unwrap().keypress,
                                        vec![macros.clone()],
                                    ),
                                }
                            }
                            TriggerEventType::MouseEvent { data } => {
                                let data: u32 = data.into();

                                match output_hashmap.get_mut(&data) {
                                    Some(value) => value.push(macros.clone()),
                                    None => output_hashmap.insert_nocheck(
                                        data,
                                        vec![macros.clone()],
                                    ),
                                }
                            }
                        }
                    }
                }
            }
        }

        output_hashmap
    }
}

impl StateManagement for MacroData {
    fn write_to_file(&self) {
        match std::fs::write(
            "../data_json.json",
            serde_json::to_string_pretty(&self).unwrap(),
        ) {
            Ok(_) => {
                println!("Success writing a new file");
            }
            Err(err) => {
                eprintln!(
                    "Error writing a new file, using only read only defaults. {}",
                    err
                );
            }
        };
    }
    ///Reads the data.json file and loads it into a struct, passes to the application at first launch (backend).
    fn read_data() -> MacroData {
        let default: MacroData = MacroData {
            data: vec![Collection {
                name: "Default".to_string(),
                icon: 'i'.to_string(),
                macros: vec![],
                active: true,
            }],
        };

        return match File::open("../data_json.json") {
            Ok(data) => {
                let data: MacroData = serde_json::from_reader(&data).unwrap();
                data
            }

            Err(err) => {
                eprintln!("Error opening file, using default macrodata {}", err);
                default.write_to_file();
                default
            }
        };
    }
}

///Collection struct that defines what a group of macros looks like and what properties it carries
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Collection {
    pub name: String,
    //TODO: base64 encoding
    pub icon: String,
    pub macros: Vec<Macro>,
    pub active: bool,
}

//TODO: trait generic this executing
//TODO: async
///Executes a given macro (requires a reference to a macro).
async fn execute_macro(macros: Macro, channel: Sender<rdev::EventType>) {
    match macros.macro_type {
        MacroType::Single => {
            println!("\nEXECUTING A SINGLE MACRO: {:#?}", macros.name);
            let cloned_channel = channel.clone();

            task::spawn(async move {
                macros.execute(cloned_channel).await;
            });
        }
        MacroType::Toggle => {
            //TODO: async channel (event)
            //execute_macro_toggle(&macros).await;
        }
        MacroType::OnHold => {
            //TODO: async
            //execute_macro_onhold(&macros).await;
        }
    }
}

async fn keypress_executor_sender(mut rchan_execute: Receiver<rdev::EventType>) {
    loop {
        let result = rchan_execute.recv().await.unwrap();

        //println!("RECEIVED RESULT {:#?}", &result);
        send(&result);
        thread::sleep(time::Duration::from_millis(20));
    }
}

fn check_macro_execution_efficiently(
    pressed_keys: Vec<u32>,
    trigger_overview: Vec<Macro>,
    channel_sender: Sender<rdev::EventType>,
) -> bool {
    let mut output = false;
    for macros in &trigger_overview {
        match &macros.trigger {
            TriggerEventType::KeyPressEvent { data, .. } => {
                let keypress_to_check: Vec<u32> = data.iter().map(|x| x.keypress).collect();

                println!(
                    "CheckMacroExec: Converted keys to vec<u32>\n {:#?}",
                    keypress_to_check
                );

                if keypress_to_check == pressed_keys {
                    let channel_clone = channel_sender.clone();
                    let macro_clone = macros.clone();

                    task::spawn(async move {
                        execute_macro(macro_clone, channel_clone).await;
                    });
                    output = output || true;
                }
            }
            TriggerEventType::MouseEvent { data } => {}
        }
    }

    return output;
}

///Sends an event to the library to Execute on an OS level.
fn send(event_type: &EventType) {
    //let delay = time::Duration::from_millis(20);
    match simulate(event_type) {
        Ok(()) => (),
        Err(SimulateError) => {
            println!("We could not send {:?}", event_type);
        }
    }
    // Let ths OS catchup (at least MacOS)
    //TODO: remove the delay at least for windows, mac needs testing (done by executor)
    //thread::sleep(delay);
}

///Gets user input on the backend. Dev purposes only.
fn get_user_input(display_text: String) -> String {
    println!("{}\n", display_text);

    let mut buffer: String = String::new();

    std::io::stdin()
        .read_line(&mut buffer)
        .expect("Invalid type");
    buffer.trim().to_string()
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
