use log::error;
use rdev;
use tokio::sync::mpsc::Sender;

/// Sends an event to the library to Execute on an OS level.
pub fn send(event_type: &rdev::EventType) {
    println!("Sending event: {:?}", event_type);
    match rdev::simulate(event_type) {
        Ok(()) => (),
        Err(_) => {
            error!("We could not send {:?}", event_type);
        }
    }
}
/// Sends a vector of keys to get processed
pub async fn send_key(send_channel: &Sender<rdev::EventType>, key: Vec<rdev::Key>) {
    for press in key {
        send_channel
            .send(rdev::EventType::KeyPress(press))
            .await
            .unwrap();
        send_channel
            .send(rdev::EventType::KeyRelease(press))
            .await
            .unwrap();
    }
}

/// Sends a vector of hotkeys to get processed
pub async fn send_hotkey(send_channel: &Sender<rdev::EventType>, key: Vec<rdev::Key>) {
    for press in &key {
        send_channel
            .send(rdev::EventType::KeyPress(*press))
            .await
            .unwrap();
    }

    for press in &key.into_iter().rev().collect::<Vec<rdev::Key>>() {
        send_channel
            .send(rdev::EventType::KeyRelease(*press))
            .await
            .unwrap();
    }
}
