use log::*;
use rdev;
use tokio::sync::mpsc::UnboundedSender;

/// Sends an event to the library to Execute on an OS level. This makes it easier to implement keypresses in custom code.
pub fn direct_send_event(event_type: &rdev::EventType) -> Result<(), String> {
    trace!("Sending event: {:?}", event_type);
    rdev::simulate(event_type).map_err(|err| {
        format!(
            "Error occurred while sending key release event: {}",
            err.to_string()
        )
        .to_string()
    })?;
    Ok(())
}
/// Sends a vector of keys to get processed
pub async fn direct_send_key(
    send_channel: &UnboundedSender<rdev::EventType>,
    key: Vec<rdev::Key>,
) -> Result<(), String> {
    for press in key.iter() {
        send_channel
            .send(rdev::EventType::KeyPress(*press))
            .map_err(|err| {
                format!(
                    "Error occurred while sending key release event: {}",
                    err.to_string()
                )
                .to_string()
            })?;

        send_channel
            .send(rdev::EventType::KeyRelease(*press))
            .map_err(|err| {
                format!(
                    "Error occurred while sending key release event: {}",
                    err.to_string()
                )
                .to_string()
            })?;
    }
    Ok(())
}

/// Sends a vector of hotkeys to get processed
pub async fn direct_send_hotkey(
    send_channel: &UnboundedSender<rdev::EventType>,
    key: Vec<rdev::Key>,
) -> Result<(), String> {
    for press in key.iter() {
        send_channel
            .send(rdev::EventType::KeyPress(*press))
            .map_err(|err| {
                format!(
                    "Error occurred while sending key release event: {}",
                    err.to_string()
                )
                .to_string()
            })?;
    }

    for press in key.iter().rev() {
        send_channel
            .send(rdev::EventType::KeyRelease(*press))
            .map_err(|err| {
                format!(
                    "Error occurred while sending key release event: {}",
                    err.to_string()
                )
                .to_string()
            })?;
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
