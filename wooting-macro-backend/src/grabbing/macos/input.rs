#[cfg(target_os = "macos")]
pub mod input {
    use crate::grabbing::executor::MacroExecutorEvent;
    use crate::macros::macro_data::MacroLookup;
    use crate::RwLock;
    use crate::UnboundedSender;
    use anyhow::Result;
    use log::*;
    use std::sync::atomic::AtomicBool;
    use std::sync::Arc;

    pub async fn check_keypress_simon(
        inner_is_listening: Arc<AtomicBool>,
        schan_macro_execute: UnboundedSender<MacroExecutorEvent>,
        map: Arc<RwLock<MacroLookup>>,
    ) {
    }
}
