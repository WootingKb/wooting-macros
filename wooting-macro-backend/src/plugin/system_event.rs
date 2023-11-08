use super::util;
use copypasta::{ClipboardContext, ClipboardProvider};
use fastrand;
use log::*;
use rdev;
use std::path::PathBuf;
use std::vec;
use tokio::sync::mpsc::UnboundedSender;
use url::Url;

// Frequently used keys within the code.
const COPY_HOTKEY: [rdev::Key; 2] = [rdev::Key::ControlLeft, rdev::Key::KeyC];
const PASTE_HOTKEY: [rdev::Key; 2] = [rdev::Key::ControlLeft, rdev::Key::KeyV];

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
#[serde(tag = "type")]
pub enum DirectoryAction {
    File { data: PathBuf },
    Directory { data: PathBuf },
    Website { data: Url },
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
#[serde(tag = "type")]
/// Types of actions related to the OS to perform.
pub enum SystemAction {
    Open { action: DirectoryAction },
    Volume { action: VolumeAction },
    Clipboard { action: ClipboardAction },
}

impl SystemAction {
    /// Execute the keys themselves.

    pub async fn execute(&self, send_channel: UnboundedSender<rdev::EventType>) {
        match &self {
            SystemAction::Open { action } => match action {
                DirectoryAction::Directory { data } | DirectoryAction::File { data } => {
                    match opener::open(data) {
                        Ok(x) => x,
                        Err(e) => error!("Error: {}", e),
                    };
                }
                DirectoryAction::Website { data } => {
                    // The open_browser explicitly opens the path in a browser window.
                    match opener::open_browser(data.as_str()) {
                        Ok(x) => x,
                        Err(e) => error!("Error: {}", e),
                    };
                }
            },
            SystemAction::Volume { action } => match action {
                VolumeAction::ToggleMute => {
                    util::direct_send_key(&send_channel, vec![rdev::Key::VolumeMute]).await;
                }
                VolumeAction::LowerVolume => {
                    util::direct_send_key(&send_channel, vec![rdev::Key::VolumeDown]).await;
                }
                VolumeAction::IncreaseVolume => {
                    util::direct_send_key(&send_channel, vec![rdev::Key::VolumeUp]).await;
                }
            },
            SystemAction::Clipboard { action } => match action {
                ClipboardAction::SetClipboard { data } => {
                    match ClipboardContext::new() {
                        Ok(mut clipboard) => clipboard
                            .set_contents(data.to_owned())
                            .unwrap_or_else(|err| {
                                error!("Error setting clipboard data: {}", err);
                            }),
                        Err(err) => {
                            error!("Error creating clipboard {}", err);
                            return;
                        }
                    };
                }
                ClipboardAction::Copy => {
                    util::direct_send_hotkey(&send_channel, COPY_HOTKEY.to_vec()).await;
                }
                ClipboardAction::GetClipboard => {
                    match ClipboardContext::new() {
                        Ok(mut clipboard) => clipboard.get_contents().unwrap_or_else(|err| {
                            error!("Error getting clipboard data: {}", err);
                            String::default()
                        }),
                        Err(err) => {
                            error!("Error creating clipboard {}", err);
                            return;
                        }
                    };
                }
                ClipboardAction::Paste => {
                    util::direct_send_hotkey(&send_channel, PASTE_HOTKEY.to_vec()).await;
                }

                ClipboardAction::PasteUserDefinedString { data } => {
                    match ClipboardContext::new() {
                        Ok(mut clipboard) => clipboard
                            .set_contents(data.to_owned())
                            .unwrap_or_else(|err| error!("Error setting clipboard: {}", err)),
                        Err(err) => {
                            error!("Error getting clipboard{}", err);
                            return;
                        }
                    };

                    util::direct_send_hotkey(&send_channel, PASTE_HOTKEY.to_vec()).await;
                }

                ClipboardAction::Sarcasm => {
                    let mut ctx = match ClipboardContext::new() {
                        Ok(clipboard) => clipboard,
                        Err(err) => {
                            error!("Error creating clipboard {}", err);
                            return;
                        }
                    };
                    // Copy the text
                    util::direct_send_hotkey(&send_channel, COPY_HOTKEY.to_vec()).await;

                    // Transform the text
                    let content = transform_text(ctx.get_contents().unwrap_or_else(|err| {
                        error!("Error getting clipboard data: {}", err);
                        String::default()
                    }));

                    ctx.set_contents(content).unwrap_or_else(|err| {
                        error!("Error setting clipboard data: {}", err);
                    });

                    // Paste the text again
                    util::direct_send_hotkey(&send_channel, PASTE_HOTKEY.to_vec()).await;
                }
            },
        }
    }
}

/// Transforms the text into a sarcastic version.
fn transform_text(text: String) -> String {
    text.chars()
        .map(|c| {
            if c.is_ascii_alphabetic() && fastrand::bool() {
                if c.is_ascii_lowercase() {
                    c.to_ascii_uppercase()
                } else {
                    c.to_ascii_lowercase()
                }
            } else {
                c
            }
        })
        .collect()
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
#[serde(tag = "type")]
/// The type of action to perform. This is used to determine which action to perform.
pub enum ClipboardAction {
    SetClipboard { data: String },
    Copy,
    GetClipboard,
    Paste,
    PasteUserDefinedString { data: String },
    Sarcasm,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
#[serde(tag = "type")]
/// Key shortcut alias to mute/increase/decrease volume.
pub enum VolumeAction {
    LowerVolume,
    IncreaseVolume,
    ToggleMute,
}
