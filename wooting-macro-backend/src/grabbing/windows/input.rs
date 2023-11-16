use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::{thread, time};

use itertools::Itertools;
use log::*;
use multiinput::*;
use tokio::sync::mpsc::UnboundedSender;

use crate::grabbing::executor::input::MacroExecutorEvent;
use crate::hid_table::*;
use crate::macros::events::triggers::TriggerEventType;
use crate::macros::macro_data::MacroLookup;
use crate::macros::macros::MacroType;
use crate::plugin::delay::DEFAULT_DELAY;
use crate::RwLock;

#[cfg(target_os = "windows")]
pub async fn check_keypress_simon(
    inner_is_listening: Arc<AtomicBool>,
    schan_macro_execute: UnboundedSender<MacroExecutorEvent>,
    map: Arc<RwLock<MacroLookup>>,
) {
    thread::sleep(time::Duration::from_millis(3000));

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

                            let triggers = map.read().await;

                            // Macro executor
                            for (macro_id, macro_data) in triggers.id_map.iter() {
                                // Get the macro trigger
                                if let TriggerEventType::KeyPressEvent { data, .. } =
                                    &macro_data.config.trigger
                                {
                                    match (data, &current_pressed_keys, &previously_pressed_keys) {
                                        // If the keys are the same, skip checking
                                        (_trigger_combo, pressed, pressed_previous)
                                            if pressed == pressed_previous
                                                && macro_data.config.macro_type
                                                    == MacroType::OnHold => {}
                                        // If the keys are different and its a trigger key pressed, start a macro
                                        (trigger_combo, pressed, _pressed_previous)
                                            if trigger_combo
                                                .iter()
                                                .any(|x| pressed.contains(x)) =>
                                        {
                                            schan_macro_execute
                                                .send(MacroExecutorEvent::Start(macro_id.clone()))
                                                .unwrap();
                                        }
                                        // If the keys are different and its a trigger key released, stop a macro
                                        (trigger_combo, _pressed, pressed_previous)
                                            if trigger_combo
                                                .iter()
                                                .any(|x| pressed_previous.contains(x)) =>
                                        {
                                            schan_macro_execute
                                                .send(MacroExecutorEvent::Stop(macro_id.clone()))
                                                .unwrap();
                                        }
                                        // Anything else just ignore
                                        _ => {}
                                    }
                                }
                            }
                            //TODO: Search all the macros
                            //TODO: is this macro trigger fulfilled by the previous one?
                            //TODO: is this trigger fulfilled by the current one?

                            //TODO: if its the same nothing happens
                            //TODO: if it was fulfilled before it releases
                            //TODO: if it was fulfilled now it presses
                            if current_pressed_keys != previously_pressed_keys {
                                debug!("PRESSED");
                                debug!("Key status Current: {:?}", current_pressed_keys);
                                debug!("Key status Previous: {:?}", previously_pressed_keys);
                                debug!("----------");
                            }
                        }
                        State::Released => {
                            previously_pressed_keys = current_pressed_keys.clone();

                            current_pressed_keys
                                .retain(|x| x != MULTIINPUT_TO_HID.get(&key).unwrap_or_else(|| &0));

                            if current_pressed_keys != previously_pressed_keys {
                                debug!("RELEASED");
                                debug!("Key status Current: {:?}", current_pressed_keys);
                                debug!("Key status Previous: {:?}", previously_pressed_keys);
                                debug!("----------");
                            }
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
