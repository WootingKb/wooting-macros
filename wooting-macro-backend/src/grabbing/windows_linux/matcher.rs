#[cfg(any(target_os = "windows", target_os = "linux"))]
pub mod input {
    use std::sync::Arc;

    use tokio::sync::mpsc::UnboundedSender;
    use tokio::sync::RwLock;

    use crate::grabbing::executor::input::MacroExecutorEvent;

    use crate::macros::events::triggers::TriggerEventType;
    use crate::macros::macro_data::MacroLookup;

    pub fn check_press_macro_execution(
        pressed_modifier_keys: &Vec<u32>,
        key: &u32,
        triggers: Arc<RwLock<MacroLookup>>,
        schan_macro_execute: &UnboundedSender<MacroExecutorEvent>,
    ) -> bool {
        let mut return_value = false;
        for (macro_id, macro_data) in triggers.blocking_read().id_map.iter() {
            match &macro_data.config.trigger {
                TriggerEventType::KeyPressEvent { data, .. } => {
                    let mut keys = pressed_modifier_keys.clone();
                    keys.push(*key);
                    if data.iter().all(|x| keys.contains(x)) {
                        schan_macro_execute
                            .send(MacroExecutorEvent::Start(macro_id.clone()))
                            .unwrap();
                        return_value = true;
                    }
                }
                TriggerEventType::MouseEvent { data } => {
                    if *key == u32::from(data) {
                        schan_macro_execute
                            .send(MacroExecutorEvent::Start(macro_id.clone()))
                            .unwrap();
                        return_value = true;
                    }
                }
            }
        }

        return_value
    }

    pub fn check_release_macro_execution(
        _pressed_modifier_keys: &Vec<u32>,
        key: &u32,
        triggers: Arc<RwLock<MacroLookup>>,
        schan_macro_execute: &UnboundedSender<MacroExecutorEvent>,
    ) -> bool {
        let mut return_value = false;
        for (macro_id, macro_data) in triggers.blocking_read().id_map.iter() {
            match &macro_data.config.trigger {
                TriggerEventType::KeyPressEvent { data, .. } => {
                    if data.last().unwrap() == key {
                        schan_macro_execute
                            .send(MacroExecutorEvent::Stop(macro_id.clone()))
                            .unwrap();
                        return_value = true;
                    }

                }
                TriggerEventType::MouseEvent { data } => {
                    if *key == u32::from(data) {
                        schan_macro_execute
                            .send(MacroExecutorEvent::Stop(macro_id.clone()))
                            .unwrap();
                        return_value = true;
                    }
                }
            }
        }
        return_value
    }
}

