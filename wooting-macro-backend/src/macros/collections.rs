use crate::macros::macro_config::MacroConfig;

/// Collections are groups of macros.
pub(crate) type Collections = Vec<Collection>;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
/// Collection struct that defines what a group of macros looks like and what properties it carries
pub struct Collection {
    pub name: String,
    pub icon: String,
    pub macros: Vec<MacroConfig>,
    pub enabled: bool,
}
