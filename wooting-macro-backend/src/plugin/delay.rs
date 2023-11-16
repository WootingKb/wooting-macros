/// Delay for the sequence in milliseconds
pub type Delay = u64;

#[cfg(target_os = "macos")]
pub const DEFAULT_DELAY: Delay = 20;
#[cfg(target_os = "windows")]
pub const DEFAULT_DELAY: Delay = 20;
#[cfg(target_os = "linux")]
pub const DEFAULT_DELAY: Delay = 20;
