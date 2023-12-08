#[cfg(target_os = "windows")]
pub mod input {
    use std::sync::atomic::{AtomicBool, Ordering};
    use std::sync::Arc;
    use std::time;

    use itertools::Itertools;
    use log::*;
    use multiinput::*;
    use tokio::sync::mpsc::UnboundedSender;

    use crate::grabbing::executor::input::MacroExecutorEvent;
    use crate::grabbing::windows::matcher::input::check_macro_execution_simply;
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

        let mut previously_pressed_keys: Vec<u32> = vec![];
        let mut current_pressed_keys: Vec<u32> = vec![];

        loop {
            if inner_is_listening.load(Ordering::Relaxed) {
                if let Some(event) = manager.get_event() {
                    match event {
                        RawEvent::KeyboardEvent(_, key, event) => match event {
                            State::Pressed => {
                                current_pressed_keys
                                    .push(*MULTIINPUT_TO_HID.get(&key).unwrap_or_else(|| &0));
                                current_pressed_keys =
                                    current_pressed_keys.into_iter().unique().collect();

                                check_macro_execution_simply(
                                    &current_pressed_keys,
                                    &previously_pressed_keys,
                                    map.clone(),
                                    &schan_macro_execute,
                                )
                                .await;

                                // if current_pressed_keys != previously_pressed_keys {
                                //     debug!("PRESSED");
                                //     debug!("Key status Current: {:?}", current_pressed_keys);
                                //     debug!("Key status Previous: {:?}", previously_pressed_keys);
                                //     debug!("----------");
                                // }
                            }
                            State::Released => {
                                previously_pressed_keys = current_pressed_keys.clone();

                                current_pressed_keys.retain(|x| {
                                    x != MULTIINPUT_TO_HID.get(&key).unwrap_or_else(|| &0)
                                });

                                // if current_pressed_keys != previously_pressed_keys {
                                //     debug!("RELEASED");
                                //     debug!("Key status Current: {:?}", current_pressed_keys);
                                //     debug!("Key status Previous: {:?}", previously_pressed_keys);
                                //     debug!("----------");
                                // }
                            }
                        },
                        _ => {}
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
