use std::path::PathBuf;
use std::{time, vec};

use anyhow::Result;
use copypasta::{ClipboardContext, ClipboardProvider};
use fastrand;
use rdev;
use tokio::sync::mpsc::UnboundedSender;
use url::Url;

use super::util;

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
    pub async fn execute(&self, send_channel: &UnboundedSender<rdev::EventType>) -> Result<()> {
        match &self {
            SystemAction::Open { action } => match action {
                DirectoryAction::Directory { data } | DirectoryAction::File { data } => {
                    opener::open(data)?;
                }
                DirectoryAction::Website { data } => {
                    // The open_browser explicitly opens the path in a browser window.
                    opener::open_browser(data.as_str())?;
                }
            },
            SystemAction::Volume { action } => match action {
                VolumeAction::ToggleMute => {
                    util::direct_send_key(&send_channel, vec![rdev::Key::VolumeMute])?;
                }
                VolumeAction::LowerVolume => {
                    util::direct_send_key(&send_channel, vec![rdev::Key::VolumeDown])?;
                }
                VolumeAction::IncreaseVolume => {
                    util::direct_send_key(&send_channel, vec![rdev::Key::VolumeUp])?;
                }
            },
            SystemAction::Clipboard { action } => match action {
                ClipboardAction::SetClipboard { data } => {
                    ClipboardContext::new()
                        .map_err(|err| anyhow::Error::msg(err.to_string()))?
                        .set_contents(data.to_owned())
                        .map_err(|err| anyhow::Error::msg(err.to_string()))?;
                }
                ClipboardAction::Copy => {
                    util::direct_send_hotkey(&send_channel, COPY_HOTKEY.to_vec())?;
                }
                ClipboardAction::GetClipboard => {
                    ClipboardContext::new()
                        .map_err(|err| anyhow::Error::msg(err.to_string()))?
                        .get_contents()
                        .map_err(|err| anyhow::Error::msg(err.to_string()))?;
                }
                ClipboardAction::Paste => {
                    util::direct_send_hotkey(&send_channel, PASTE_HOTKEY.to_vec())?;
                }

                ClipboardAction::PasteUserDefinedString { data } => {
                    ClipboardContext::new()
                        .map_err(|err| anyhow::Error::msg(err.to_string()))?
                        .set_contents(data.to_owned())
                        .map_err(|err| anyhow::Error::msg(err.to_string()))?;

                    util::direct_send_hotkey(&send_channel, PASTE_HOTKEY.to_vec())?;
                }

                ClipboardAction::Sarcasm => {
                    let mut ctx = ClipboardContext::new()
                        .map_err(|err| anyhow::Error::msg(err.to_string()))?;

                    // Copy the text
                    util::direct_send_hotkey(&send_channel, COPY_HOTKEY.to_vec())?;

                    // Delay is required to make Discord, and some other apps cooperate properly.
                    tokio::time::sleep(time::Duration::from_millis(10)).await;

                    // Transform the text
                    let content = transform_text(
                        ctx.get_contents()
                            .map_err(|err| anyhow::Error::msg(err.to_string()))?,
                    );

                    ctx.set_contents(content)
                        .map_err(|err| anyhow::Error::msg(err.to_string()))?;

                    // Paste the text again
                    util::direct_send_hotkey(&send_channel, PASTE_HOTKEY.to_vec())?;
                }
            },
        }
        Ok(())
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
