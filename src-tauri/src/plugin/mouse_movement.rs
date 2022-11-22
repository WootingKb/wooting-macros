#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
pub enum MouseAction {
    Click { data: ClickAction },
    Move { x: u32, y: u32 },
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
pub enum ClickAction {
    Down { button: u32 },
    Up { button: u32 },
    UpDown { button: u32, delay: u32 },
}



