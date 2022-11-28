use rdev::{Button, Event};
use tokio::sync::mpsc::Sender;

use crate::hid_table::SCANCODE_TO_RDEV;
use std::time;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
pub enum MouseAction {
    Press { data: MousePressAction },
    Move { x: i32, y: i32 },
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
pub enum MousePressAction {
    Down { button: rdev::Button },
    Up { button: rdev::Button },
    DownUp { button: rdev::Button, duration: u32 },
}

impl MouseAction {
    pub async fn execute(&self, send_channel: Sender<Event>) {
        match &self {
            MouseAction::Press { data } => match data {
                MousePressAction::Down { button } => {
                    send_channel
                        .send(Event {
                            time: time::SystemTime::now(),
                            name: None,
                            event_type: rdev::EventType::ButtonPress(*button),
                        })
                        .await
                        .unwrap();
                }
                MousePressAction::Up { button } => {
                    send_channel
                        .send(Event {
                            time: time::SystemTime::now(),
                            name: None,
                            event_type: rdev::EventType::ButtonRelease(*button),
                        })
                        .await
                        .unwrap();
                }
                MousePressAction::DownUp { button, duration } => {
                    send_channel
                        .send(Event {
                            time: time::SystemTime::now(),
                            name: None,
                            event_type: rdev::EventType::ButtonPress(*button),
                        })
                        .await
                        .unwrap();

                    tokio::time::sleep(time::Duration::from_millis(*duration as u64)).await;

                    send_channel
                        .send(Event {
                            time: time::SystemTime::now(),
                            name: None,
                            event_type: rdev::EventType::ButtonRelease(*button),
                        })
                        .await
                        .unwrap();
                }
            },

            MouseAction::Move { x, y } => {
                let display_size = rdev::display_size().unwrap();
                println!("Display size: {:?}", display_size);

                send_channel
                    .send(Event {
                        time: time::SystemTime::now(),
                        name: None,
                        event_type: rdev::EventType::MouseMove {
                            x: *x as f64,
                            y: *y as f64,
                        },
                    })
                    .await
                    .unwrap();

            }
        }
    }
}
