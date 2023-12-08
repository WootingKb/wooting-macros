use crate::hid_table::HID_TO_RDEV;
use crate::plugin::delay::DEFAULT_DELAY;
use crate::plugin::{delay, key_press, mouse, phillips_hue, system_event};

use std::time;
use tokio::sync::mpsc::UnboundedSender;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(tag = "type")]
/// This enum is the registry for all actions that can be executed.
pub enum ActionEventType {
    KeyPressEventAction {
        data: key_press::KeyPress,
    },
    SystemEventAction {
        data: system_event::SystemAction,
    },
    //Paste, Run commandline program (terminal run? standard user?), audio, open file-manager, workspace switch left, right,
    //IDEA: System event - notification
    PhillipsHueEventAction {
        data: phillips_hue::PhillipsHueStatus,
    },
    //IDEA: Phillips hue notification
    OBSEventAction {},

    DiscordEventAction {},
    //IDEA: IKEADesk
    MouseEventAction {
        data: mouse::MouseAction,
    },
    //IDEA: Sound effects? Soundboards?
    //IDEA: Sending a message through online webapi (twitch)
    DelayEventAction {
        data: delay::Delay,
    },
}

impl ActionEventType {
    /// This function is used to execute a macro. It is called by the macro checker.
    /// It spawns async tasks to execute said events specifically.
    /// Make sure to expand this if you implement new action types.
    pub(crate) async fn execute(
        &self,
        send_channel: &UnboundedSender<rdev::EventType>,
    ) -> anyhow::Result<()> {
        match self {
            ActionEventType::KeyPressEventAction { data } => match data.key_type {
                key_press::KeyType::Down => {
                    // One key press down
                    send_channel.send(rdev::EventType::KeyPress(HID_TO_RDEV[&data.keypress]))?;
                    // plugin::util::direct_send_event(&rdev::EventType::KeyPress(
                    //     RDEV_TO_HID[&data.keypress],
                    // ))?;
                    tokio::time::sleep(time::Duration::from_millis(DEFAULT_DELAY)).await;
                }
                key_press::KeyType::Up => {
                    // One key lift up
                    send_channel.send(rdev::EventType::KeyRelease(HID_TO_RDEV[&data.keypress]))?;
                    // plugin::util::direct_send_event(&rdev::EventType::KeyRelease(
                    //     RDEV_TO_HID[&data.keypress],
                    // ))?;
                    tokio::time::sleep(time::Duration::from_millis(DEFAULT_DELAY)).await;
                }
                key_press::KeyType::DownUp => {
                    // Key press
                    send_channel.send(rdev::EventType::KeyPress(HID_TO_RDEV[&data.keypress]))?;
                    // plugin::util::direct_send_event(&rdev::EventType::KeyPress(
                    //     RDEV_TO_HID[&data.keypress],
                    // ))?;
                    tokio::time::sleep(time::Duration::from_millis(DEFAULT_DELAY)).await;

                    // Wait the set delay by user
                    tokio::time::sleep(time::Duration::from_millis(data.press_duration)).await;

                    // Lift the key
                    send_channel.send(rdev::EventType::KeyRelease(HID_TO_RDEV[&data.keypress]))?;
                    // plugin::util::direct_send_event(&rdev::EventType::KeyRelease(
                    //     RDEV_TO_HID[&data.keypress],
                    // ))?;
                    tokio::time::sleep(time::Duration::from_millis(DEFAULT_DELAY)).await;
                }
            },
            ActionEventType::PhillipsHueEventAction { .. } => {}
            ActionEventType::OBSEventAction { .. } => {}
            ActionEventType::DiscordEventAction { .. } => {}
            ActionEventType::DelayEventAction { data } => {
                tokio::time::sleep(time::Duration::from_millis(*data)).await;
            }
            ActionEventType::SystemEventAction { data } => {
                data.execute(&send_channel).await?;
                tokio::time::sleep(time::Duration::from_millis(DEFAULT_DELAY)).await;
            }
            ActionEventType::MouseEventAction { data } => {
                data.execute(&send_channel).await?;
                tokio::time::sleep(time::Duration::from_millis(DEFAULT_DELAY)).await;
            }
        }

        Ok(())
    }
}
