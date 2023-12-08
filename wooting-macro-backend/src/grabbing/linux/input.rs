#[cfg(target_os = "linux")]
pub mod input {
    use itertools::Itertools;
    use std::sync::atomic::{AtomicBool, Ordering};
    use std::sync::Arc;

    use rdev;
    use rdev::EventType;
    use tokio::sync::mpsc::UnboundedSender;
    use tokio::task;

    use crate::grabbing::executor::input::MacroExecutorEvent;
    use crate::grabbing::linux::matcher::input::check_macro_execution_simply;
    use crate::hid_table::RDEV_TO_HID;
    use crate::macros::macro_data::MacroLookup;
    use crate::RwLock;

    pub async fn check_keypress_simon(
        inner_is_listening: Arc<AtomicBool>,
        schan_macro_execute: UnboundedSender<MacroExecutorEvent>,
        map: Arc<RwLock<MacroLookup>>,
    ) {
        let _grabber = task::spawn_blocking(move || {
            let keys_pressed: Arc<RwLock<Vec<rdev::Key>>> = Arc::new(RwLock::new(vec![]));
            let mut previously_pressed_keys: Arc<RwLock<Vec<u32>>> = Arc::new(RwLock::from(vec![]));
            let mut current_pressed_keys: Arc<RwLock<Vec<u32>>> = Arc::new(RwLock::from(vec![]));

            rdev::grab(move |event: rdev::Event| {
                if inner_is_listening.load(Ordering::Relaxed) {
                    match event.event_type {
                        EventType::KeyPress(key) => {
                            current_pressed_keys
                                .blocking_write()
                                .push(*RDEV_TO_HID.get(&key).unwrap_or_else(|| &0));
                            let cloned_keys = current_pressed_keys.blocking_read().clone();
                            *current_pressed_keys.blocking_write() =
                                cloned_keys.into_iter().unique().collect();

                            check_macro_execution_simply(
                                &current_pressed_keys.blocking_read(),
                                &previously_pressed_keys.blocking_read(),
                                map.clone(),
                                &schan_macro_execute,
                            );

                            Some(event)
                        }
                        EventType::KeyRelease(key) => Some(event),
                        EventType::ButtonPress(_) => Some(event),
                        EventType::ButtonRelease(_) => Some(event),
                        EventType::MouseMove { .. } => Some(event),
                        EventType::Wheel { .. } => Some(event),
                    }
                } else {
                    None
                }
            })
        });
    }
}
