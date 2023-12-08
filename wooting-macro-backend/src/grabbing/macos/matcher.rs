#[cfg(target_os = "macos")]
pub mod input {
    use crate::grabbing::executor::input::MacroExecutorEvent;

    use log::{debug, error, info, trace, warn};
    use std::sync::Arc;
    use tokio::sync::mpsc::UnboundedSender;
    use tokio::sync::RwLock;

    use crate::macros::events::triggers::TriggerEventType;
    use crate::macros::macro_data::MacroLookup;
    use crate::macros::macros::MacroType;


    pub fn check_macro_execution_simply(
        current_pressed_keys: &Vec<u32>,
        previously_pressed_keys: &Vec<u32>,
        triggers: Arc<RwLock<MacroLookup>>,
        schan_macro_execute: &UnboundedSender<MacroExecutorEvent>,
    ) {
        for (macro_id, macro_data) in triggers.blocking_read().id_map.iter() {
            // Get the macro trigger
            if let TriggerEventType::KeyPressEvent { data, .. } = &macro_data.config.trigger {
                match (data, &current_pressed_keys, &previously_pressed_keys) {
                    // If the keys are the same, skip checking
                    (_trigger_combo, pressed, pressed_previous)
                    if pressed == pressed_previous
                        && macro_data.config.macro_type == MacroType::OnHold => {}
                    // If the keys are different and its a trigger key pressed, start a macro
                    (trigger_combo, pressed, _pressed_previous)
                    if trigger_combo.iter().any(|x| pressed.contains(x)) =>
                        {
                            schan_macro_execute
                                .send(MacroExecutorEvent::Start(macro_id.clone()))
                                .unwrap();
                        }
                    // If the keys are different and its a trigger key released, stop a macro
                    (trigger_combo, _pressed, pressed_previous)
                    if trigger_combo.iter().any(|x| pressed_previous.contains(x)) =>
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
    }

    /// A more efficient way using hashtable to check whether the trigger keys match the macro.
    ///
    /// `pressed_events` - the keys pressed in HID format (use the conversion HID hashtable to get the number).
    ///
    /// `trigger_overview` - Macros that need to be checked. Should be picked by matching the hashtable of triggers, and those should be checked here.
    ///
    /// `channel_sender` - a copy of the channel sender to use later when executing various macros.
    fn check_macro_execution_efficiently(
        pressed_events: Vec<u32>,
        check_macros: Vec<String>,
        macro_data: Arc<RwLock<MacroLookup>>,
        macro_channel_sender: UnboundedSender<MacroExecutorEvent>,
        event_type: rdev::EventType,
        identical_keys: bool, // keypress_sender: UnboundedSender<rdev::EventType>,
    ) -> bool {
        let trigger_overview_print = check_macros.clone();
        let macro_data_id_map_cloned = &macro_data.blocking_read().id_map;

        warn!("calling function check_macro_execution_efficiently");

        trace!("Got data: {:?}", trigger_overview_print);
        trace!("Got keys: {:?}", pressed_events);

        for (macro_id, macros) in check_macros
            .iter()
            .map(|id| (id.clone(), (*macro_data_id_map_cloned).get(id).unwrap()))
        {
            // Must be cloned here otherwise Rust will cry

            let macro_sender = macro_channel_sender.clone();
            match &macros.config.trigger {
                TriggerEventType::KeyPressEvent { data, .. } => {
                    match data.len() {
                        1 => {
                            if pressed_events.iter().any(|i| *data.first().unwrap() == *i) {
                                error!(
                                "MATCHED MACRO single key: {} contains {:?}",
                                *data.first().unwrap(),
                                pressed_events
                            );
                                // if identical_keys
                                //     && macros.config.is_running
                                //     && macros.config.macro_type != MacroType::Toggle
                                // {
                                //     info!("Ignoring the macro, just consuming");
                                //     return true;
                                // }

                                let id_cloned = macro_id.clone();
                                // let channel_clone_execute = macro_sender.clone();
                                // Disabled until a better fix is done

                                // plugin::util::lift_trigger_key(
                                //     *data.first().unwrap(),
                                //     &keypress_sender,
                                // )
                                // .unwrap();

                                let event = match event_type {
                                    // TODO: This can be a more generic event that can also have ABORT as its command,
                                    // tho we can also bypass this function and abort directly to the executor (preferred way imo)
                                    rdev::EventType::KeyPress { .. } => {
                                        MacroExecutorEvent::Start(id_cloned)
                                    }
                                    rdev::EventType::KeyRelease { .. } => {
                                        MacroExecutorEvent::Stop(id_cloned)
                                    }
                                    _ => {
                                        todo!("not implemented yet.");
                                    }
                                };

                                macro_sender.send(event).unwrap_or_else(|err| {
                                    error!("Error sending macro ID to execute: {}", err)
                                });

                                // output = true;
                                return true;
                            }
                        }
                        2..=4 => {
                            // This check makes sure the modifier keys (up to 3 keys in each trigger) can be of any order, and ensures the last key must match to the proper one.
                            if data[..(data.len() - 1)]
                                .iter()
                                .all(|x| pressed_events[..(pressed_events.len() - 1)].contains(x))
                                && pressed_events[pressed_events.len() - 1] == data[data.len() - 1]
                            {
                                debug!("MATCHED MACRO multi key: {:#?}", pressed_events);
                                if identical_keys {
                                    info!("Ignoring the macro, just consuming");
                                    return true;
                                }
                                let id_cloned = macro_id.clone();

                                let event = match event_type {
                                    // TODO: This can be a more generic event that can also have ABORT as its command,
                                    // tho we can also bypass this function and abort directly to the executor (preferred way imo)
                                    rdev::EventType::KeyPress { .. } => {
                                        MacroExecutorEvent::Start(id_cloned)
                                    }
                                    rdev::EventType::KeyRelease { .. } => {
                                        MacroExecutorEvent::Stop(id_cloned)
                                    }
                                    _ => {
                                        todo!("not implemented yet.");
                                    }
                                };
                                macro_sender.send(event).unwrap_or_else(|err| {
                                    error!("Error sending macro ID to execute: {}", err)
                                });

                                return true;
                            }
                        }
                        _ => (),
                    }
                }
                TriggerEventType::MouseEvent { data } => {
                    let event_to_check: Vec<u32> = vec![data.into()];

                    trace!(
                    "CheckMacroExec: Converted mouse buttons to vec<u32>\n {:#?}",
                    event_to_check
                );

                    if event_to_check == pressed_events {
                        let id_cloned = macro_id.clone();

                        macro_sender
                            .send(MacroExecutorEvent::Start(id_cloned))
                            .unwrap_or_else(|err| error!("Error sending macro ID to execute: {}", err));

                        return true;
                    }
                }
            }
        }

        return false;
    }
}