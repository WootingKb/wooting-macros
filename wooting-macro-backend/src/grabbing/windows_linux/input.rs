#[cfg(any(target_os = "windows", target_os = "linux"))]
pub mod input {
    use std::sync::atomic::{AtomicBool, Ordering};
    use std::sync::Arc;
    use std::time;

    use rdev::EventType;
    use tokio::sync::mpsc::UnboundedSender;

    use crate::grabbing::executor::input::MacroExecutorEvent;
    use crate::grabbing::windows_linux::matcher::input::{check_release_macro_execution, check_press_macro_execution};
    use crate::hid_table::*;
    use crate::macros::macro_data::MacroLookup;

    use crate::RwLock;

    pub async fn check_keypress_simon(
        inner_is_listening: Arc<AtomicBool>,
        schan_macro_execute: UnboundedSender<MacroExecutorEvent>,
        map: Arc<RwLock<MacroLookup>>,
    ) {
        tokio::time::sleep(time::Duration::from_millis(3000)).await;

        let og_pressed_modifier_keys: Arc<RwLock<Vec<u32>>> = Arc::new(RwLock::from(vec![]));

        let _grabber = tokio::task::spawn_blocking(move || {
            let schan_macro_execute_inner = schan_macro_execute.clone();
            let pressed_modifier_keys = og_pressed_modifier_keys.clone();

            rdev::grab(move |event: rdev::Event| {
                if inner_is_listening.load(Ordering::Relaxed) {
                    match event.event_type {
                        EventType::KeyPress(key) => {
                            let hid_key = RDEV_TO_HID.get(&key).unwrap_or(&0);
                            if RDEV_MODIFIER_KEYS.contains(&key) {
                                pressed_modifier_keys.blocking_write().push(*hid_key);
                            }

                            let consume = check_press_macro_execution(
                                &pressed_modifier_keys.blocking_read(),
                                hid_key,
                                map.clone(),
                                &schan_macro_execute_inner,
                            );

                            if consume {
                                None
                            } else {
                                Some(event)
                            }
                        }

                        EventType::KeyRelease(key) => {
                            let hid_key = RDEV_TO_HID.get(&key).unwrap_or(&0);

                            if RDEV_MODIFIER_KEYS.contains(&key) {
                                pressed_modifier_keys
                                    .blocking_write()
                                    .retain(|x| x != hid_key);
                            }

                            let consume = check_release_macro_execution(
                                &pressed_modifier_keys.blocking_read(),
                                hid_key,
                                map.clone(),
                                &schan_macro_execute_inner,
                            );

                            if consume {
                                None
                            } else {
                                Some(event)
                            }
                        }

                        EventType::ButtonPress(button) => {
                            let hid_key: u32 =
                                BUTTON_TO_HID.get(&button).unwrap_or(&0x101).to_owned();

                            let consume = check_press_macro_execution(
                                &pressed_modifier_keys.blocking_read(),
                                &hid_key,
                                map.clone(),
                                &schan_macro_execute_inner,
                            );

                            if consume && button != rdev::Button::Left {
                                None
                            } else {
                                Some(event)
                            }
                        }
                        EventType::ButtonRelease(_) => Some(event),
                        _ => Some(event),
                    }
                } else {
                    Some(event)
                }
            })
        });
    }
}
