use log::*;
use rdev;
use tokio::sync::mpsc::UnboundedSender;

/// Sends an event to the library to Execute on an OS level. This makes it easier to implement keypresses in custom code.
pub fn send(event_type: &rdev::EventType) {
    trace!("Sending event: {:?}", event_type);
    match rdev::simulate(event_type) {
        Ok(()) => (),
        Err(err) => {
            error!("We could not send {:?}.\n{}", event_type, err);
        }
    }
}
/// Sends a vector of keys to get processed
pub async fn send_key(send_channel: &UnboundedSender<rdev::EventType>, key: Vec<rdev::Key>) {
    key.iter().for_each(|press| {
        send_channel
            .send(rdev::EventType::KeyPress(*press))
            .unwrap();
        send_channel
            .send(rdev::EventType::KeyRelease(*press))
            .unwrap();
    });
}

/// Sends a vector of hotkeys to get processed
pub async fn send_hotkey(send_channel: &UnboundedSender<rdev::EventType>, key: Vec<rdev::Key>) {
    key.iter().for_each(|press| {
        send_channel
            .send(rdev::EventType::KeyPress(*press))
            .unwrap()
    });

    // Release the keys in opposite order
    key.iter().rev().for_each(|press| {
        send_channel
            .send(rdev::EventType::KeyRelease(*press))
            .unwrap()
    });
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
