///KeyPress that carries information about a key action itself.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
pub struct KeyPress {
    pub keypress: u32,
    pub press_duration: super::delay::Delay,
    pub keytype: KeyType,
}

///Type of a key action. DownUp releases after pressing, others just do the named action.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
pub enum KeyType {
    DownUp,
    Down,
    Up,
}