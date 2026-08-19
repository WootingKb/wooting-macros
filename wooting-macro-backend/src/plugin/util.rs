use crate::hid_table::RDEV_MODIFIER_KEYS;
use anyhow::Result;
use log::*;
use rdev;
use tokio::sync::mpsc::UnboundedSender;

#[cfg(target_os = "windows")]
use winapi::um::winuser::{SendInput, INPUT, INPUT_MOUSE, MOUSEEVENTF_WHEEL, MOUSEEVENTF_HWHEEL};
#[cfg(target_os = "windows")]
use std::mem;

/// Sends an event to the library to Execute on an OS level. This makes it easier to implement keypresses in custom code.
pub fn direct_send_event(event_type: &rdev::EventType) -> Result<()> {
    trace!("Sending event: {:?}", event_type);
    
    // Special handling for scroll events - they might fail on some platforms
    if let rdev::EventType::Wheel { delta_x, delta_y } = event_type {
        debug!("Sending scroll event: delta_x={}, delta_y={}", delta_x, delta_y);
        
        // Try Windows-specific scroll handling first on Windows
        #[cfg(target_os = "windows")]
        {
            if let Ok(_) = send_scroll_windows(*delta_x, *delta_y) {
                return Ok(());
            }
        }
    }
    
    match rdev::simulate(event_type) {
        Ok(_) => {
            if let rdev::EventType::Wheel { .. } = event_type {
                trace!("Scroll event successfully simulated");
            }
            Ok(())
        }
        Err(e) => {
            error!("Failed to simulate event {:?}: {}", event_type, e);
            Err(anyhow::anyhow!("Failed to simulate event: {}", e))
        }
    }
}

#[cfg(target_os = "windows")]
fn send_scroll_windows(delta_x: i64, delta_y: i64) -> Result<()> {
    unsafe {
        // For vertical scrolling
        if delta_y != 0 {
            let mut input: INPUT = mem::zeroed();
            input.type_ = INPUT_MOUSE;
            input.u.mi_mut().dwFlags = MOUSEEVENTF_WHEEL;
            input.u.mi_mut().mouseData = (delta_y * 120) as u32; // Convert to wheel units (120 per notch)
            
            if SendInput(1, &mut input, mem::size_of::<INPUT>() as i32) == 0 {
                return Err(anyhow::anyhow!("SendInput failed for vertical scroll"));
            }
            debug!("Windows scroll (vertical) sent: {}", delta_y);
        }
        
        // For horizontal scrolling
        if delta_x != 0 {
            let mut input: INPUT = mem::zeroed();
            input.type_ = INPUT_MOUSE;
            input.u.mi_mut().dwFlags = MOUSEEVENTF_HWHEEL;
            input.u.mi_mut().mouseData = (delta_x * 120) as u32; // Convert to wheel units (120 per notch)
            
            if SendInput(1, &mut input, mem::size_of::<INPUT>() as i32) == 0 {
                return Err(anyhow::anyhow!("SendInput failed for horizontal scroll"));
            }
            debug!("Windows scroll (horizontal) sent: {}", delta_x);
        }
    }
    
    Ok(())
}
/// Sends a vector of keys to get processed
pub async fn direct_send_key(
    send_channel: &UnboundedSender<rdev::EventType>,
    key: Vec<rdev::Key>,
) -> Result<()> {
    for press in key.iter() {
        send_channel.send(rdev::EventType::KeyPress(*press))?;

        send_channel.send(rdev::EventType::KeyRelease(*press))?;
    }
    Ok(())
}

/// Sends a vector of hotkeys to get processed
pub async fn direct_send_hotkey(
    send_channel: &UnboundedSender<rdev::EventType>,
    key: Vec<rdev::Key>,
) -> Result<()> {
    for press in key.iter() {
        send_channel.send(rdev::EventType::KeyPress(*press))?;
    }

    for press in key.iter().rev() {
        send_channel.send(rdev::EventType::KeyRelease(*press))?;
    }

    Ok(())
}

// Disabled until a better fix is done
// /// Lifts the keys pressed
pub fn lift_keys(
    pressed_events: &[u32],
    channel_sender: &UnboundedSender<rdev::EventType>,
) -> Result<()> {
    let mut pressed_events_local = pressed_events.to_owned();

    pressed_events_local.retain(|id_key| {
        RDEV_MODIFIER_KEYS
            .iter()
            .any(|rdev_key| super::super::SCANCODE_TO_RDEV[id_key] == *rdev_key)
    });

    for key in pressed_events_local.iter() {
        channel_sender.send(rdev::EventType::KeyRelease(
            super::super::SCANCODE_TO_RDEV[key],
        ))?;
    }

    Ok(())
}
