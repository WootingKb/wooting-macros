use crate::grabbing::executor::MacroExecutorEvent;
use crate::macros::macro_data::MacroLookup;
use crate::RwLock;
use crate::UnboundedSender;
use std::sync::atomic::AtomicBool;
use std::sync::Arc;

#[cfg(target_os = "linux")]
pub async fn check_keypress_simon(
    inner_is_listening: Arc<AtomicBool>,
    nothing: Arc<RwLock<Vec<KeyId>>>,
    schan_macro_execute: UnboundedSender<MacroExecutorEvent>,
    map: Arc<RwLock<MacroLookup>>,
) {
}
