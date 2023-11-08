use super::util;
use copypasta::{ClipboardContext, ClipboardProvider};
use fastrand;
use log::*;
use rdev;
use std::path::PathBuf;
use std::vec;
use tokio::sync::mpsc::UnboundedSender;
use url::Url;

use crate::hid_table::SCANCODE_TO_RDEV;

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

                    util::send_key(&send_channel, vec![*SCANCODE_TO_RDEV.get(&0x7f).unwrap()])
                        .await;
                }
                VolumeAction::LowerVolume => {
                    util::send_key(&send_channel, vec![*SCANCODE_TO_RDEV.get(&0x81).unwrap()])
                        .await;
                }
                VolumeAction::IncreaseVolume => {
                    util::send_key(&send_channel, vec![*SCANCODE_TO_RDEV.get(&0x80).unwrap()])
                        .await;
                }
            },
            SystemAction::Clipboard { action } => match action {
                ClipboardAction::SetClipboard { data } => {
                    ClipboardContext::new()
                        .unwrap()
                        .set_contents(data.to_owned())
                        .unwrap();
                }
                ClipboardAction::Copy => {
                    util::send_hotkey(&send_channel, COPY_HOTKEY.to_vec()).await;
                }
                ClipboardAction::GetClipboard => {
                    ClipboardContext::new().unwrap().get_contents().unwrap();
                }
                ClipboardAction::Paste => {
                    util::send_hotkey(&send_channel, PASTE_HOTKEY.to_vec()).await;
                }

                ClipboardAction::PasteUserDefinedString { data } => {
                    ClipboardContext::new()
                        .unwrap()
                        .set_contents(data.to_owned())
                        .unwrap();

                    util::send_hotkey(&send_channel, PASTE_HOTKEY.to_vec()).await;
                }

                ClipboardAction::Sarcasm => {
                    let mut ctx = ClipboardContext::new().unwrap();

                    util::send_hotkey(&send_channel, COPY_HOTKEY.to_vec()).await;

                    //Transform the text
                    let content = transform_text(ctx.get_contents().unwrap());
                    ctx.set_contents(content).unwrap();

                    //Paste the text again
                    util::send_hotkey(&send_channel, PASTE_HOTKEY.to_vec()).await;
                }
            },
        }
    }
}

/// Transforms the text into a sarcastic version.
fn transform_text(text: String) -> String {
    let mut transformed_text = String::new();
    for c in text.chars() {
        if c.is_ascii_alphabetic() && fastrand::bool() {
            if c.is_ascii_lowercase() {
                transformed_text.push(c.to_ascii_uppercase());
            } else {
                transformed_text.push(c.to_ascii_lowercase());
            }
        } else {
            transformed_text.push(c);
        }
    }
    transformed_text
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
