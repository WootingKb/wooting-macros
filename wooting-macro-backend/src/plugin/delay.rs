#[cfg(target_os = "windows")]
pub const STANDARD_KEYPRESS_DELAY: u64 = 1;

#[cfg(target_os = "macos")]
pub const STANDARD_KEYPRESS_DELAY: u64 = 10;

#[cfg(target_os = "linux")]
pub const STANDARD_KEYPRESS_DELAY: u64 = 10;

/// Delay between macro events for the frontend
pub const MACRO_EVENT_DELAY: u64 = 20;
/// Delay for the sequence in milliseconds
pub type Delay = u64;

#[cfg(target_os = "macos")]
pub const DEFAULT_DELAY: Delay = 20;
#[cfg(target_os = "windows")]
pub const DEFAULT_DELAY: Delay = 20;
#[cfg(target_os = "linux")]
pub const DEFAULT_DELAY: Delay = 20;
