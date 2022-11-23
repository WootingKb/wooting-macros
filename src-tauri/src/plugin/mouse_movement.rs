#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
pub enum MouseAction {
    Press { data: MousePressAction },
    Move { x: u32, y: u32 },
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
pub enum MousePressAction {
    Down { button: u32 },
    Up { button: u32 },
    DownUp { button: u32, duration: u32 },
}



