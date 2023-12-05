use crate::MacroExecutorEvent;
use crate::MacroLookup;
use crate::RwLock;
use crate::UnboundedSender;
use std::sync::atomic::AtomicBool;
use std::sync::Arc;

#[cfg(target_os = "macos")]
pub async fn check_keypress_simon(
    inner_is_listening: Arc<AtomicBool>,
    schan_macro_execute: UnboundedSender<MacroExecutorEvent>,
    map: Arc<RwLock<MacroLookup>>,
) {
}
