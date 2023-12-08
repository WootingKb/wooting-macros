#[cfg(target_os = "windows")]
pub mod input {
    use std::sync::Arc;
    use std::{thread, time};

    use log::{error, trace};
    use tokio::sync::mpsc::UnboundedReceiver;
    use tokio::sync::RwLock;

    use crate::macros::events::triggers::MacroTriggerEvent;
    use crate::macros::macro_data::MacroLookup;
    use crate::plugin::delay::DEFAULT_DELAY;

    #[derive(Debug)]
    pub enum MacroExecutorEvent {
        Start(String),
        Stop(String),
        Abort(String),
        AbortAll,
    }

    /// Receives and executes a macro based on the trigger event.
    /// Puts a mandatory 0-20 ms delay between each macro execution (depending on the platform).
    pub fn keypress_executor_receiver(mut rchan_execute: UnboundedReceiver<rdev::EventType>) {
        loop {
            let received_event = match &rchan_execute.blocking_recv() {
                Some(event) => *event,
                None => {
                    trace!("Failed to receive an event!");
                    continue;
                }
            };
            crate::plugin::util::direct_send_event(&received_event).unwrap_or_else(|err| {
                error!("Error directly sending an event to keyboard: {}", err)
            });

            thread::sleep(time::Duration::from_millis(DEFAULT_DELAY));
        }
    }

    pub async fn macro_executor(
        mut rchan_execute: UnboundedReceiver<MacroExecutorEvent>,
        macro_id_list: Arc<RwLock<MacroLookup>>,
        // schan_keypress_execute: UnboundedSender<rdev::EventType>,
    ) {
        loop {
            if let Some(macro_event) = rchan_execute.recv().await {
                let mut macro_id_list = macro_id_list.write().await;
                let macro_id_list = &mut macro_id_list.id_map;

                match macro_event {
                    MacroExecutorEvent::Start(macro_id) => {
                        // let schan_keypress_execute_clone = schan_keypress_execute.clone();
                        macro_id_list
                            .get_mut(&macro_id)
                            .unwrap()
                            .on_event(MacroTriggerEvent::Pressed)
                    }
                    MacroExecutorEvent::Stop(macro_id) => macro_id_list
                        .get_mut(&macro_id)
                        .unwrap()
                        .on_event(MacroTriggerEvent::Released),
                    MacroExecutorEvent::Abort(macro_id) => macro_id_list
                        .get_mut(&macro_id)
                        .unwrap()
                        .on_event(MacroTriggerEvent::Abort),
                    MacroExecutorEvent::AbortAll => {
                        for (_, macro_item) in macro_id_list.iter_mut() {
                            macro_item.on_event(MacroTriggerEvent::Abort)
                        }
                    }
                }
            }
            tokio::time::sleep(time::Duration::from_millis(DEFAULT_DELAY)).await;
        }
    }
}
