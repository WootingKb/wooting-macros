use log::{info};
use rdev::EventType;
use serde_repr;
use tokio::sync::mpsc::Sender;

pub use rdev;

use std::time;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
#[serde(tag = "type")]
/// Mouse action: Press presses a defined button. Move moves to absolute coordinates X and Y.
pub enum MouseAction {
    Press { data: MousePressAction },
    Move { x: i32, y: i32 },
}

#[derive(
    Debug, Clone, serde_repr::Serialize_repr, serde_repr::Deserialize_repr, PartialEq, Hash, Eq,
)]
#[serde(tag = "type")]
#[repr(u16)]
/// Mouse buttons have a specified non-collisional number with the HID codes internally used within the library.
pub enum MouseButton {
    Left = 0x101,
    Right = 0x102,
    Middle = 0x103,
    Mouse4 = 0x104,
    Mouse5 = 0x105,
}

// impl Into<rdev::Button> for &MouseButton {
//     fn into(self) -> rdev::Button {
//         match *self {
//             MouseButton::Left => rdev::Button::Left,
//             MouseButton::Right => rdev::Button::Right,
//             MouseButton::Middle => rdev::Button::Middle,
//             MouseButton::Mouse4 => rdev::Button::Unknown(1),
//             MouseButton::Mouse5 => rdev::Button::Unknown(2),
//         }
//     }
// }


impl From<&rdev::Button> for &MouseButton {
    fn from(value: &rdev::Button) -> Self {
        match *value {
            rdev::Button::Left => &MouseButton::Left,
            rdev::Button::Right => &MouseButton::Right,
            rdev::Button::Middle => &MouseButton::Middle,
            rdev::Button::Unknown(1) => &MouseButton::Mouse4,
            rdev::Button::Unknown(2) => &MouseButton::Mouse5,
            rdev::Button::Unknown(_) => &MouseButton::Left,
        }
    }
}



impl From<&MouseButton> for &rdev::Button {
    fn from(item: &MouseButton) -> Self {
        match *item {
            MouseButton::Left => &rdev::Button::Left,
            MouseButton::Right => &rdev::Button::Right,
            MouseButton::Middle => &rdev::Button::Middle,
            MouseButton::Mouse4 => &rdev::Button::Unknown(1),
            MouseButton::Mouse5 => &rdev::Button::Unknown(2),
        }
    }
}

// impl From<&rdev::Button> for &MouseButton {
//     fn from(item: &rdev::Button) -> Self {
//         match *item {
//             rdev::Button::Left => &MouseButton::Left,
//             rdev::Button::Right => &MouseButton::Right,
//             rdev::Button::Middle => &MouseButton::Middle,
//             rdev::Button::Unknown(1) => &MouseButton::Mouse4,
//             rdev::Button::Unknown(2) => &MouseButton::Mouse5,
//             _ => &MouseButton::Left,
//         }
//     }
// }
//
// impl Into<MouseButton> for rdev::Button {
//     fn into(self) -> MouseButton {
//         match self {
//             rdev::Button::Left => MouseButton::Left,
//             rdev::Button::Right => MouseButton::Right,
//             rdev::Button::Middle => MouseButton::Middle,
//             rdev::Button::Unknown(1) => MouseButton::Mouse4,
//             rdev::Button::Unknown(2) => MouseButton::Mouse5,
//             rdev::Button::Unknown(_) => MouseButton::Left,
//         }
//     }
// }
// impl Into<u32> for &MouseButton {
//     fn into(self) -> u32 {
//         match *self {
//             MouseButton::Left => 0x101,
//             MouseButton::Right => 0x102,
//             MouseButton::Middle => 0x103,
//             MouseButton::Mouse4 => 0x104,
//             MouseButton::Mouse5 => 0x105,
//         }
//     }
// }

impl From<&MouseButton> for &u32 {
    fn from(value: &MouseButton) -> Self {
        match *value {
            MouseButton::Left => &0x101,
            MouseButton::Right => &0x102,
            MouseButton::Middle => &0x103,
            MouseButton::Mouse4 => &0x104,
            MouseButton::Mouse5 => &0x105,
        }
    }
}


#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
#[serde(tag = "type")]
/// Mouse press action: Press presses a defined button. Release releases a defined button.
/// DownUp presses and releases a defined button.
pub enum MousePressAction {
    Down { button: MouseButton },
    Up { button: MouseButton },
    DownUp { button: MouseButton, duration: u32 },
}

impl MouseAction {
    /// Creates a new MouseAction from a rdev event and sends it to the channel for async execution.
    pub async fn execute(&self, send_channel: Sender<EventType>) {
        match &self {
            MouseAction::Press { data } => match data {
                MousePressAction::Down { button } => {
                    send_channel
                        .send(rdev::EventType::ButtonPress(*<&MouseButton as Into<&rdev::Button>>::into(button)))
                        .await
                        .unwrap();
                }
                MousePressAction::Up { button } => {
                    send_channel
                        .send(rdev::EventType::ButtonRelease(*<&MouseButton as Into<&rdev::Button>>::into(button)))
                        .await
                        .unwrap();
                }
                MousePressAction::DownUp { button, duration } => {
                    send_channel
                        .send(rdev::EventType::ButtonPress(*<&MouseButton as Into<&rdev::Button>>::into(button)))
                        .await
                        .unwrap();

                    tokio::time::sleep(time::Duration::from_millis(*duration as u64)).await;

                    send_channel
                        .send(rdev::EventType::ButtonRelease(*<&MouseButton as Into<&rdev::Button>>::into(button)))
                        .await
                        .unwrap();
                }
            },

            MouseAction::Move { x, y } => {
                let display_size = rdev::display_size().unwrap();
                info!("Display size: {:?}", display_size);

                send_channel
                    .send(rdev::EventType::MouseMove {
                        x: *x as f64,
                        y: *y as f64,
                    })
                    .await
                    .unwrap();
            }
        }
    }
}
