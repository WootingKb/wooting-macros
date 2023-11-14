use crate::config::{ApplicationConfig, ConfigFile};
use crate::Macro;
use anyhow::Result;
use log::*;
use rdev;
use tauri::api::notification::Notification;
use tauri::api::notification::Sound::Default;
use tokio::sync::mpsc::UnboundedSender;

impl Macro {
    /// Shows a toast notification in the OS.
    pub fn show_notification(self, app_identifier: Option<String>) -> Self {
        match app_identifier {
            Some(app_ident) => {
                if self.show_notification {
                    Notification::new(app_ident)
                        .title("Executing Wootomation Macro")
                        .body(format!("Executed macro {}", &self.name))
                        .sound(Default)
                        .icon("wootomation")
                        .show()
                        .unwrap_or_else(|err| warn!("Failed to show notification: {}", err));
                }
            }
            None => warn!("No app identifier set for notification - Tauri is not running."),
        }

        self
    }
}

pub fn show_error_notification(action_name: String, app_identifier: Option<String>, error: String) {
    match app_identifier {
        Some(app_ident) => {
            let show_criticals = ApplicationConfig::read_data()
                .unwrap()
                .show_critical_notifications;
            if show_criticals {
                Notification::new(app_ident)
                    .title("Error Executing Wootomation Action")
                    .body(format!(
                        "Executing action: {}, could not be done, reason: {}",
                        action_name, error
                    ))
                    .sound(Default)
                    .icon("wootomation")
                    .show()
                    .unwrap_or_else(|err| warn!("Failed to show notification: {}", err));
            }
        }
        None => warn!("No app identifier set for notification - Tauri is not running."),
    }
}

/// Sends an event to the library to Execute on an OS level. This makes it easier to implement keypresses in custom code.
pub fn direct_send_event(event_type: &rdev::EventType) -> Result<()> {
    trace!("Sending event: {:?}", event_type);
    rdev::simulate(event_type)?;
    Ok(())
}
/// Sends a vector of keys to get processed
pub async fn direct_send_key(
    send_channel: &UnboundedSender<rdev::EventType>,
    key: Vec<rdev::Key>,
) -> Result<()> {
    for press in key.iter() {
        send_channel.send(rdev::EventType::KeyPress(*press))?;

        send_channel.send(rdev::EventType::KeyRelease(*press))?;
    }
    Ok(())
}

/// Sends a vector of hotkeys to get processed
pub async fn direct_send_hotkey(
    send_channel: &UnboundedSender<rdev::EventType>,
    key: Vec<rdev::Key>,
) -> Result<()> {
    for press in key.iter() {
        send_channel.send(rdev::EventType::KeyPress(*press))?;
    }

    for press in key.iter().rev() {
        send_channel.send(rdev::EventType::KeyRelease(*press))?;
    }

    Ok(())
}

// Disabled until a better fix is done
// /// Lifts the keys pressed
// pub fn lift_keys(pressed_events: &Vec<u32>, channel_sender: &UnboundedSender<rdev::EventType>) {
//     for x in pressed_events {
//         channel_sender
//             .send(rdev::EventType::KeyRelease(
//                 super::super::SCANCODE_TO_RDEV[x],
//             ))
//             .unwrap();
//     }
// }
