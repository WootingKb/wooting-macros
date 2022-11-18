#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
pub enum ActionType {
    Open { path: String },
    Volume,
    Brightness,
}

impl ActionType {
    pub async fn execute(&self) {
        match &self {
            ActionType::Open { path } => {
                opener::open(std::path::Path::new(path));
            }
            ActionType::Volume => {}
            ActionType::Brightness => {}
        }
    }
}

//
// #[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
// pub struct OpenData{
//     //pub application: String,
//     pub path: std::path::Path,
// }
