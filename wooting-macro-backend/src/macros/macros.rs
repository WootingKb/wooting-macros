use log::*;
use rdev::EventType;
use tokio::sync::mpsc::UnboundedSender;

use crate::macros::events::triggers::MacroTriggerEvent;
use crate::macros::macro_config::{Macro, MacroConfig};
use crate::macros::macro_task::{MacroTask, MacroTaskEvent};

impl Macro {
    pub fn new(
        macro_config: MacroConfig,
        macro_keypress_sender: UnboundedSender<EventType>,
    ) -> Self {
        // Create a new associated task with the macro
        let (task_sender, task_receiver) = tokio::sync::mpsc::unbounded_channel();
        let macro_keypress_sender_clone = macro_keypress_sender.clone();
        let macro_clone = macro_config.clone();
        tokio::task::spawn(async move {
            info!("Spawned a macro task");
            MacroTask::new(task_receiver, macro_clone, macro_keypress_sender_clone).await;
        });

        debug!("Created a macro, name: {}", &macro_config.name);
        // Return the macro
        Macro {
            config: macro_config,
            task_sender,
            macro_keypress_sender,
        }
    }

    pub fn on_event(&mut self, event: MacroTriggerEvent) {
        info!("Event: {:?}", event);

        if let MacroTriggerEvent::Abort = event {
            self.task_sender.send(MacroTaskEvent::Abort).unwrap();
            return;
        }

        match self.config.macro_type {
            MacroType::Single => {
                if let MacroTriggerEvent::Pressed = event {
                    warn!("Sending oneshot macro");
                    self.task_sender.send(MacroTaskEvent::OneShot).unwrap();
                }
            }
            MacroType::Toggle => {
                if let MacroTriggerEvent::Pressed = event {
                    warn!("Toggling");
                    self.task_sender.send(MacroTaskEvent::Toggle).unwrap();
                }
            }
            MacroType::OnHold => match event {
                MacroTriggerEvent::Pressed => {
                    warn!("Starting repeat of onhold macro");
                    self.task_sender.send(MacroTaskEvent::RepeatStart).unwrap();
                }
                MacroTriggerEvent::Released => {
                    warn!("Stopping repeat of onhold macro");
                    self.task_sender.send(MacroTaskEvent::RepeatStop).unwrap();
                }
                _ => {}
            },
            MacroType::RepeatX => {
                if let MacroTriggerEvent::Pressed = event {
                    warn!("Starting a repeatX macro");
                    self.task_sender
                        .send(MacroTaskEvent::RepeatX(self.config.repeat_amount))
                        .unwrap();
                }
            }
        }
    }
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, Eq, PartialEq)]
/// Type of a macro. Currently only Single is implemented. Others have been postponed for now.
///
/// ! **UNIMPLEMENTED** - Only the `Single` macro type is implemented for now. Feel free to contribute ideas.
pub enum MacroType {
    // Single macro fire
    Single,
    // press to start, press to finish cycle and terminate
    Toggle,
    // while held Execute macro (repeats)
    OnHold,
    // X amount of times repeat
    RepeatX, //  Unused currently
}
