use crate::macros::macro_config::MacroConfig;
use crate::macros::macros::MacroType;
use crate::plugin::delay::DEFAULT_DELAY;

use log::*;
use rdev;
use std::time;
use tokio::sync::mpsc::error::TryRecvError;
use tokio::sync::mpsc::{UnboundedReceiver, UnboundedSender};

#[derive(Debug)]
pub enum MacroTaskEvent {
    OneShot,
    RepeatStart,
    RepeatStop,
    RepeatX(u32),
    Toggle,
    Abort,
    Kill,
}

pub struct MacroTask {
    pub task_receiver: UnboundedReceiver<MacroTaskEvent>,
}

impl MacroTask {
    pub async fn new(
        mut receive_channel: UnboundedReceiver<MacroTaskEvent>,
        // Only sequence probably needed here
        // TODO: Config will be a part of the Macro itself
        macro_data: MacroConfig,
        send_channel: UnboundedSender<rdev::EventType>,
    ) {
        let mut is_running = false;
        let mut stop_after_running: Option<u32> = None;
        let mut buffer = vec![];
        let mut message_len = 0;

        loop {
            if receive_channel.len() > 0 {
                message_len = receive_channel
                    .recv_many(&mut buffer, receive_channel.len())
                    .await;
            }

            if buffer.len() > 0 {
                println!(
                    "value in channel: {:?}, received {message_len} messages",
                    buffer
                );
                match buffer.last().unwrap() {
                    MacroTaskEvent::OneShot => {
                        error!("Executing oneshot macro");
                        is_running = true;
                        stop_after_running = Some(1);
                    }
                    MacroTaskEvent::RepeatX(amount) => {
                        error!("Executing repeat macro, {} times", amount);
                        is_running = true;
                        stop_after_running = Some(*amount);
                    }
                    MacroTaskEvent::RepeatStart => {
                        if is_running == false {
                            error!("Executing starting a repeat macro");
                            is_running = true;
                            stop_after_running = None;
                        }
                    }
                    MacroTaskEvent::RepeatStop => {
                        error!("Executing stopping a repeat macro");
                        is_running = false;
                    }
                    MacroTaskEvent::Toggle => {
                        error!("Executing toggling a macro");
                        is_running = !is_running;
                        stop_after_running = None;
                    }
                    MacroTaskEvent::Abort => {
                        error!("Executing aborting a macro");
                        is_running = false;
                    }
                    MacroTaskEvent::Kill => {
                        error!("EXECUTING KILLING OF THE TASK OF A MACRO");
                        return;
                    }
                }
            }
            buffer = vec![];

            if is_running {
                for action in macro_data.sequence.iter() {
                    action.execute(&send_channel).await.unwrap();
                }

                if let Some(amount) = stop_after_running {
                    error!("Macro will run {} times", amount - 1);
                    if amount - 1 == 0 {
                        is_running = false;
                        stop_after_running = None;
                    } else {
                        stop_after_running = Some(amount - 1);
                    }
                }
                match macro_data.macro_type {
                    MacroType::Single => {
                        is_running = false;
                    }
                    _ => (),
                }
            } else {
                tokio::time::sleep(time::Duration::from_millis(DEFAULT_DELAY)).await;
            }
        }
    }
}
