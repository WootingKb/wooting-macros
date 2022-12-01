use rdev::{Button, Event};
use tokio::sync::mpsc::Sender;
use serde_repr;

use crate::hid_table::SCANCODE_TO_RDEV;
use std::time;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
#[serde(tag = "type")]
pub enum MouseAction {
    Press { data: MousePressAction },
    Move { x: i32, y: i32 },
}

#[derive(Debug, Clone, serde_repr::Serialize_repr, serde_repr::Deserialize_repr, PartialEq, Hash, Eq)]
#[serde(tag = "type")]
#[repr(u8)]
// TODO: Implement https://serde.rs/enum-number.html to ensure representation to frontend is correct
pub enum MouseButton {
    Left = 1,
    Right = 2,
    Middle = 3,
    Mouse4 = 4,
    Mouse5 = 5,
}

impl Into<rdev::Button> for &MouseButton {
    fn into(self) -> rdev::Button {
        match *self {
            MouseButton::Left => rdev::Button::Left,
            MouseButton::Right => rdev::Button::Right,
            MouseButton::Middle => rdev::Button::Middle,
            MouseButton::Mouse4 => rdev::Button::Unknown(4),
            MouseButton::Mouse5 => rdev::Button::Unknown(5),
        }
    }
}

impl Into<MouseButton> for rdev::Button {
    fn into(self) -> MouseButton {
        match self {
            rdev::Button::Left => MouseButton::Left,
            rdev::Button::Right => MouseButton::Right,
            rdev::Button::Middle => MouseButton::Middle,
            rdev::Button::Unknown(4) => MouseButton::Mouse4,
            rdev::Button::Unknown(5) => MouseButton::Mouse5,
            rdev::Button::Unknown(_) => MouseButton::Left,
        }
    }
}
impl Into<u32> for &MouseButton {
    fn into(self) -> u32 {
        match *self {
            MouseButton::Left => 0x101,
            MouseButton::Right => 0x102,
            MouseButton::Middle => 0x103,
            MouseButton::Mouse4 => 0x104,
            MouseButton::Mouse5 => 0x105,
            _ => 0x101,
        }
    }
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
#[serde(tag = "type")]
pub enum MousePressAction {
    Down { button: MouseButton },
    Up { button: MouseButton },
    DownUp { button: MouseButton, duration: u32 },
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
                            event_type: rdev::EventType::ButtonPress(button.into()),
                        })
                        .await
                        .unwrap();
                }
                MousePressAction::Up { button } => {
                    send_channel
                        .send(Event {
                            time: time::SystemTime::now(),
                            name: None,
                            event_type: rdev::EventType::ButtonRelease(button.into()),
                        })
                        .await
                        .unwrap();
                }
                MousePressAction::DownUp { button, duration } => {
                    send_channel
                        .send(Event {
                            time: time::SystemTime::now(),
                            name: None,
                            event_type: rdev::EventType::ButtonPress(button.into()),
                        })
                        .await
                        .unwrap();

                    tokio::time::sleep(time::Duration::from_millis(*duration as u64)).await;

                    send_channel
                        .send(Event {
                            time: time::SystemTime::now(),
                            name: None,
                            event_type: rdev::EventType::ButtonRelease(button.into()),
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
