use anyhow::Result;
use log::*;
use rdev;
use tokio::sync::mpsc::UnboundedSender;

/// Sends an event to the library to Execute on an OS level. This makes it easier to implement keypresses in custom code.
pub fn direct_send_event(event_type: &rdev::EventType) -> Result<()> {
    trace!("Sending event: {:?}", event_type);
    rdev::simulate(event_type)?;
    Ok(())
}
/// Sends a vector of keys to get processed
pub fn direct_send_key(
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
pub fn direct_send_hotkey(
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
pub fn lift_trigger_key(
    key_to_release: u32,
    channel_sender: &UnboundedSender<rdev::EventType>,
) -> Result<()> {
    channel_sender.send(rdev::EventType::KeyRelease(
        super::super::HID_TO_RDEV[&key_to_release],
    ))?;

    Ok(())
}
