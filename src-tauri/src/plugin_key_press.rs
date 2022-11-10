#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
pub struct KeyPress {
    pub keypress: u32,
    pub press_duration: super::plugin_delay::Delay,
    pub keytype: KeyType,
}


#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
pub enum KeyType {
    DownUp,
    Down,
    Up,
}