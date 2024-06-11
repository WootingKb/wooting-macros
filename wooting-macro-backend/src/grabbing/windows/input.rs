#[cfg(target_os = "windows")]
pub mod input {
    use std::sync::atomic::{AtomicBool, Ordering};
    use std::sync::Arc;
    use std::time;

    use itertools::Itertools;
    use log::*;
    use multiinput::*;
    use rdev::EventType;
    use tokio::sync::mpsc::UnboundedSender;

    use crate::grabbing::executor::input::MacroExecutorEvent;
    use crate::grabbing::windows::matcher::input::{
        check_macro_execution_simply, check_macro_execution_simply_async,
    };
    use crate::hid_table::*;
    use crate::macros::macro_data::MacroLookup;
    use crate::plugin::delay::DEFAULT_DELAY;

    use crate::RwLock;

    pub async fn check_keypress_simon(
        inner_is_listening: Arc<AtomicBool>,
        schan_macro_execute: UnboundedSender<MacroExecutorEvent>,
        map: Arc<RwLock<MacroLookup>>,
    ) {
        tokio::time::sleep(time::Duration::from_millis(3000)).await;

        let mut manager = RawInputManager::new().unwrap();
        manager.register_devices(DeviceType::Keyboards);
        warn!("Device list {:#?}", manager.get_device_list());

        for device in manager.get_device_list().keyboards.iter() {
            warn!("Device status {:#?}", device);
        }

        let og_previously_pressed_keys: Arc<RwLock<Vec<u32>>> = Arc::new(RwLock::from(vec![]));
        let og_current_pressed_keys: Arc<RwLock<Vec<u32>>> = Arc::new(RwLock::from(vec![]));

        let _grabber = tokio::task::spawn_blocking(move || {
            let schan_macro_execute_inner = schan_macro_execute.clone();
            let current_pressed_keys = og_current_pressed_keys.clone();
            let previously_pressed_keys = og_previously_pressed_keys.clone();

            rdev::grab(move |event: rdev::Event| {
                if inner_is_listening.load(Ordering::Relaxed) {
                    match event.event_type {
                        // Only check KeyPress and not SimulatedKeyPress
                        EventType::KeyPress(key) => {
                            // Add the keys to the array
                            current_pressed_keys
                                .blocking_write()
                                .push(*RDEV_TO_HID.get(&key).unwrap_or(&0));

                            // Make a copy of current values to prevent a deadlock
                            let current_pressed_keys_clone =
                                current_pressed_keys.blocking_read().clone();

                            // Rewrite the current values with unique values
                            *current_pressed_keys.blocking_write() =
                                current_pressed_keys_clone.into_iter().unique().collect();

                            // Check if the macro corresponds and if to consume the trigger
                            let consume = check_macro_execution_simply(
                                &current_pressed_keys.blocking_read(),
                                &previously_pressed_keys.blocking_read(),
                                map.clone(),
                                &schan_macro_execute_inner,
                            );

                            // Consume trigger if matched a macro, else let all keys pass
                            if consume {
                                // debug!("CONSUMING {:?}", key);
                                None
                            } else {
                                Some(event)
                            }
                        }
                        // Only check KeyRelease and not Simulated Key Release
                        EventType::KeyRelease(key) => {
                            previously_pressed_keys
                                .blocking_write()
                                .clone_from(&current_pressed_keys.blocking_read());

                            current_pressed_keys
                                .blocking_write()
                                .retain(|x| x != RDEV_TO_HID.get(&key).unwrap_or(&0));

                            // Check if the macro corresponds and if to consume the trigger
                            let _ = check_macro_execution_simply(
                                &current_pressed_keys.blocking_read(),
                                &previously_pressed_keys.blocking_read(),
                                map.clone(),
                                &schan_macro_execute_inner,
                            );

                            Some(event)
                        }
                        EventType::ButtonPress(button) => {
                            let converted_button_hid: Vec<u32> =
                                vec![BUTTON_TO_HID.get(&button).unwrap_or(&0x101).to_owned()];

                            let consume = check_macro_execution_simply(
                                &converted_button_hid,
                                &previously_pressed_keys.blocking_read(),
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

    pub async fn check_keypress_simon_multiinput(
        inner_is_listening: Arc<AtomicBool>,
        schan_macro_execute: UnboundedSender<MacroExecutorEvent>,
        map: Arc<RwLock<MacroLookup>>,
    ) {
        tokio::time::sleep(time::Duration::from_millis(3000)).await;

        let mut manager = RawInputManager::new().unwrap();
        manager.register_devices(DeviceType::Keyboards);
        warn!("Device list {:#?}", manager.get_device_list());

        for device in manager.get_device_list().keyboards.iter() {
            warn!("Device status {:#?}", device);
        }

        let mut previously_pressed_keys: Vec<u32> = vec![];
        let mut current_pressed_keys: Vec<u32> = vec![];

        loop {
            if inner_is_listening.load(Ordering::Relaxed) {
                if let Some(event) = manager.get_event() {
                    if let RawEvent::KeyboardEvent(_, key, event) = event {
                        match event {
                            State::Pressed => {
                                current_pressed_keys
                                    .push(*MULTIINPUT_TO_HID.get(&key).unwrap_or(&0));
                                current_pressed_keys =
                                    current_pressed_keys.into_iter().unique().collect();

                                check_macro_execution_simply_async(
                                    &current_pressed_keys,
                                    &previously_pressed_keys,
                                    map.clone(),
                                    &schan_macro_execute,
                                )
                                .await;
                            }
                            State::Released => {
                                previously_pressed_keys.clone_from(&current_pressed_keys);

                                current_pressed_keys
                                    .retain(|x| x != MULTIINPUT_TO_HID.get(&key).unwrap_or(&0));
                            }
                        }
                    }
                }
                tokio::time::sleep(time::Duration::from_millis(DEFAULT_DELAY)).await;
                // thread::sleep(time::Duration::from_millis(DEFAULT_DELAY));
            } else {
                // thread::sleep(time::Duration::from_millis(2000));
                tokio::time::sleep(time::Duration::from_millis(2000)).await;
            }
        }
    }
}
