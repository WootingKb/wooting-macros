use log::*;
use rdev;
use tokio::sync::mpsc::UnboundedSender;

/// Sends an event to the library to Execute on an OS level. This makes it easier to implement keypresses in custom code.
pub fn send(event_type: &rdev::EventType) {
    info!("Sending event: {:?}", event_type);
    match rdev::simulate(event_type) {
        Ok(()) => (),
        Err(_) => {
            error!("We could not send {:?}", event_type);
        }
    }
}
/// Sends a vector of keys to get processed
pub async fn send_key(send_channel: &UnboundedSender<rdev::EventType>, key: Vec<rdev::Key>) {
    for press in key {
        send_channel.send(rdev::EventType::KeyPress(press)).unwrap();
        send_channel
            .send(rdev::EventType::KeyRelease(press))
            .unwrap();
    }
}

/// Sends a vector of hotkeys to get processed
pub async fn send_hotkey(send_channel: &UnboundedSender<rdev::EventType>, key: Vec<rdev::Key>) {
    for press in &key {
        send_channel
            .send(rdev::EventType::KeyPress(*press))
            .unwrap();
    }

    for press in &key.into_iter().rev().collect::<Vec<rdev::Key>>() {
        send_channel
            .send(rdev::EventType::KeyRelease(*press))
            .unwrap();
    }
}

/// Lifts the keys pressed
pub async fn lift_keys(pressed_events: Vec<u32>, channel_sender: UnboundedSender<rdev::EventType>) {
    for x in pressed_events {
        channel_sender
            .send(rdev::EventType::KeyRelease(
                super::super::SCANCODE_TO_RDEV[&x],
            ))
            .unwrap();
    }
}
