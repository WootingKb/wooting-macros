use copypasta::{ClipboardContext, ClipboardProvider};
use fastrand;
use rdev;
use tokio::sync::mpsc::Sender;

#[cfg(any(target_os = "windows", target_os = "linux"))]
use brightness::{windows::BrightnessExt, Brightness, BrightnessDevice};
#[cfg(any(target_os = "windows", target_os = "linux"))]
use futures::{StreamExt, TryFutureExt, TryStreamExt};

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
#[serde(tag = "type")]
/// Types of actions related to the OS to perform.
pub enum SystemAction {
    Open { action: String },
    Volume { action: VolumeAction },
    Brightness { action: MonitorBrightnessAction },
    Clipboard { action: ClipboardAction },
}

// const COPY_HOTKEY: Vec<rdev::Key> = vec![rdev::Key::ControlLeft, rdev::Key::C];


impl SystemAction {
    /// Execute the keys themselves
    pub async fn execute(&self, send_channel: Sender<rdev::EventType>) {
        match &self {
            SystemAction::Open { action: path } => {
                match opener::open(std::path::Path::new(path)) {
                    Ok(x) => x,
                    Err(e) => eprintln!("Error: {}", e),
                };
            }
            SystemAction::Volume { action } => match action {
                VolumeAction::ToggleMute => {
                    send_channel
                        .send(rdev::EventType::KeyPress(rdev::Key::Unknown(173)))
                        .await
                        .unwrap();

                    send_channel
                        .send(rdev::EventType::KeyRelease(rdev::Key::Unknown(173)))
                        .await
                        .unwrap();
                }
                VolumeAction::LowerVolume => {
                    send_channel
                        .send(rdev::EventType::KeyPress(rdev::Key::Unknown(174)))
                        .await
                        .unwrap();

                    send_channel
                        .send(rdev::EventType::KeyRelease(rdev::Key::Unknown(174)))
                        .await
                        .unwrap();
                }
                VolumeAction::IncreaseVolume => {
                    // TODO: Make some nice helper func that can do a simple keypress
                    // send_key(send_channel, rdev::Key::Unknown(175)).await;

                    
                    send_channel
                        .send(rdev::EventType::KeyPress(rdev::Key::Unknown(175)))
                        .await
                        .unwrap();

                    send_channel
                        .send(rdev::EventType::KeyRelease(rdev::Key::Unknown(175)))
                        .await
                        .unwrap();
                }
            },
            SystemAction::Brightness { action } => match action {
                MonitorBrightnessAction::Get => {
                    #[cfg(any(target_os = "windows", target_os = "linux"))]
                    // brightness_get_info().await;
                    #[cfg(target_os = "macos")]
                    println!("Not supported on macOS");
                }
                MonitorBrightnessAction::SetAll { level } => {
                    #[cfg(any(target_os = "windows", target_os = "linux"))]
                    brightness_set_all_device(*level).await;
                    #[cfg(target_os = "macos")]
                    println!("Not supported on macOS");
                }
                MonitorBrightnessAction::Decrease => {
                    #[cfg(any(target_os = "windows", target_os = "linux"))]
                    brightness_decrease(2).await;
                    #[cfg(target_os = "macos")]
                    println!("Not supported on macOS");
                }
                MonitorBrightnessAction::Increase => {
                    #[cfg(any(target_os = "windows", target_os = "linux"))]
                    brightness_increase(2).await;
                    #[cfg(target_os = "macos")]
                    println!("Not supported on macOS");
                }
                MonitorBrightnessAction::Set { level, name } => {
                    brightness_set_specific_device(*level, name).await;
                }
            },
            SystemAction::Clipboard { action } => match action {
                ClipboardAction::SetClipboard { data } => {
                    let mut ctx = ClipboardContext::new().unwrap();

                    ctx.set_contents(data.to_owned()).unwrap();
                }
                ClipboardAction::Copy => {
                    // TODO: Make a nice helper function that accepts a vec of keys and inputs them like a hotkey
                    // send_hotkey(send_channel, COPY_HOTKEY).await;

                    send_channel
                        .send(rdev::EventType::KeyPress(rdev::Key::ControlLeft))
                        .await
                        .unwrap();
                    send_channel
                        .send(rdev::EventType::KeyPress(rdev::Key::KeyC))
                        .await
                        .unwrap();
                    send_channel
                        .send(rdev::EventType::KeyRelease(rdev::Key::KeyC))
                        .await
                        .unwrap();
                    send_channel
                        .send(rdev::EventType::KeyRelease(rdev::Key::ControlLeft))
                        .await
                        .unwrap();
                }
                ClipboardAction::GetClipboard => {
                    let mut ctx = ClipboardContext::new().unwrap();

                    ctx.get_contents().unwrap();
                }
                ClipboardAction::Paste => {
                    send_channel
                        .send(rdev::EventType::KeyPress(rdev::Key::ControlLeft))
                        .await
                        .unwrap();
                    send_channel
                        .send(rdev::EventType::KeyPress(rdev::Key::KeyV))
                        .await
                        .unwrap();
                    send_channel
                        .send(rdev::EventType::KeyRelease(rdev::Key::KeyV))
                        .await
                        .unwrap();
                    send_channel
                        .send(rdev::EventType::KeyRelease(rdev::Key::ControlLeft))
                        .await
                        .unwrap();
                }

                ClipboardAction::PasteUserDefinedString { data } => {
                    let mut ctx = ClipboardContext::new().unwrap();

                    ctx.set_contents(data.to_owned()).unwrap();

                    send_channel
                        .send(rdev::EventType::KeyPress(rdev::Key::ControlLeft))
                        .await
                        .unwrap();
                    send_channel
                        .send(rdev::EventType::KeyPress(rdev::Key::KeyV))
                        .await
                        .unwrap();
                    send_channel
                        .send(rdev::EventType::KeyRelease(rdev::Key::KeyV))
                        .await
                        .unwrap();
                    send_channel
                        .send(rdev::EventType::KeyRelease(rdev::Key::ControlLeft))
                        .await
                        .unwrap();
                }

                ClipboardAction::Sarcasm => {
                    let mut ctx = ClipboardContext::new().unwrap();

                    //Get the text into clipboard
                    send_channel
                        .send(rdev::EventType::KeyPress(rdev::Key::ControlLeft))
                        .await
                        .unwrap();
                    send_channel
                        .send(rdev::EventType::KeyPress(rdev::Key::KeyC))
                        .await
                        .unwrap();
                    send_channel
                        .send(rdev::EventType::KeyRelease(rdev::Key::KeyC))
                        .await
                        .unwrap();
                    send_channel
                        .send(rdev::EventType::KeyRelease(rdev::Key::ControlLeft))
                        .await
                        .unwrap();

                    //Transform the text
                    let content = ctx.get_contents().unwrap();

                    let content_new = transform_text(content);

                    ctx.set_contents(content_new).unwrap();

                    //Paste the text again
                    send_channel
                        .send(rdev::EventType::KeyPress(rdev::Key::ControlLeft))
                        .await
                        .unwrap();
                    send_channel
                        .send(rdev::EventType::KeyPress(rdev::Key::KeyV))
                        .await
                        .unwrap();
                    send_channel
                        .send(rdev::EventType::KeyRelease(rdev::Key::KeyV))
                        .await
                        .unwrap();
                    send_channel
                        .send(rdev::EventType::KeyRelease(rdev::Key::ControlLeft))
                        .await
                        .unwrap();
                }
            },
        }
    }
}

// trait Helpers {
//     async fn send_key(&self, key: rdev::Key);
// }

// impl Helpers for Sender<rdev::EventType> {
//     async fn send_key(&self, key: rdev::Key) {
//         self.send(rdev::EventType::KeyPress(key)).await
//             .unwrap();
//         self.send(rdev::EventType::KeyRelease(key)).await
//             .unwrap();
//     }
// }

// async fn send_key(sender: Sender<rdev::EventType>, key: rdev::Key) {
//     sender.send(rdev::EventType::KeyPress(key)).await
//         .unwrap();
//     sender.send(rdev::EventType::KeyRelease(key)).await
//         .unwrap();
// }

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
/// Monitor information.
pub struct Monitor {
    pub device_id: String,
    pub brightness: u32,
    pub display_name: String,
}
/// Loads the monitors and sends them to the frontend
pub async fn backend_load_monitors() -> Vec<Monitor> {
    let mut monitors = Vec::new();

    for i in brightness::brightness_devices()
        .into_future()
        .await
        .0
        .unwrap()
    {
        //println!("{:#?}", i);
        monitors.push(Monitor {
            device_id: i.device_name().into_future().await.unwrap(),
            brightness: i.get().into_future().await.unwrap(),
            display_name: i.device_description().unwrap(),
        });
    }

    monitors
}

#[cfg(any(target_os = "windows", target_os = "linux"))]
/// Sets brightness of all monitors to the given level.
async fn brightness_set_all_device(percentage_level: u32) {
    brightness::brightness_devices()
        .try_fold(0, |count, mut dev| async move {
            set_brightness(&mut dev, percentage_level).await?;
            Ok(count + 1)
        })
        .await
        .unwrap();
}

#[cfg(any(target_os = "windows", target_os = "linux"))]
/// Sets brightness of a specific device (it's name) to the given level.
async fn brightness_set_specific_device(percentage_level: u32, name: &str) {
    for mut devices in brightness::brightness_devices()
        .into_future()
        .await
        .0
        .unwrap()
    {
        if devices.device_name().into_future().await.unwrap() == name {
            set_brightness(&mut devices, percentage_level)
                .await
                .unwrap();
        }
        println!("{:#?}", devices);
    }
}

//TODO: accept device from frontend
#[cfg(any(target_os = "windows", target_os = "linux"))]
/// Increases brightness of all devices by 2%
async fn brightness_increase(percentage_level: u32) {
    let count = brightness::brightness_devices()
        .try_fold(0, |count, mut dev| async move {
            let current_brightness = dev.get().await.unwrap();

            set_brightness(&mut dev, current_brightness + percentage_level).await?;
            Ok(count + 1)
        })
        .await
        .unwrap();
    println!("Found {} displays", count);
}

//TODO: accept device from frontend
#[cfg(any(target_os = "windows", target_os = "linux"))]
/// Decrements brightness of all devices by 2%
async fn brightness_decrease(percentage_level: u32) {
    let count = brightness::brightness_devices()
        .try_fold(0, |count, mut dev| async move {
            let current_brightness = dev.get().await.unwrap();

            set_brightness(&mut dev, current_brightness - percentage_level).await?;
            Ok(count + 1)
        })
        .await
        .unwrap();
    println!("Found {} displays", count);
}

#[cfg(any(target_os = "windows", target_os = "linux"))]
/// Sets brightness for a device
async fn set_brightness(
    dev: &mut BrightnessDevice,
    percentage_level: u32,
) -> Result<(), brightness::Error> {
    println!("Display {}", dev.device_name().await?);
    dev.set(percentage_level).await?;
    show_platform_specific_info(dev).await?;
    Ok(())
}

#[cfg(windows)]
/// Shows more information about displays connected
async fn show_platform_specific_info(dev: &BrightnessDevice) -> Result<(), brightness::Error> {
    println!("\tDevice description = {}", dev.device_description()?);
    println!("\tDevice registry key = {}", dev.device_registry_key()?);
    Ok(())
}

#[cfg(target_os = "linux")]
async fn show_platform_specific_info(_: &BrightnessDevice) -> Result<(), brightness::Error> {
    Ok(())
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
/// Monitor get, set brightness (currently Get is unused).
pub enum MonitorBrightnessAction {
    Get,
    SetAll { level: u32 },
    Set { level: u32, name: String },
    Decrease,
    Increase,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
#[serde(tag = "type")]
/// Key shortcut alias to mute/increase/decrease volume.
pub enum VolumeAction {
    LowerVolume,
    IncreaseVolume,
    ToggleMute,
}
