use crate::plugin::mouse;
use halfbrown::HashMap;


#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(tag = "type")]
/// This enum is the registry for all incoming actions that can be analyzed for macro execution.
///
/// ! **UNIMPLEMENTED** - Allow while other keys has not been implemented yet. This is WIP already.
pub enum TriggerEventType {
    KeyPressEvent {
        data: Vec<u32>,
        allow_while_other_keys: bool,
    },
    MouseEvent {
        data: mouse::MouseButton,
    },
    //IDEA: computer time (have timezone support?)
    //IDEA: computer temperature?
}

#[derive(Debug)]
pub enum MacroTriggerEvent {
    Pressed,
    Released,
    Abort,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
#[serde(tag = "type")]
pub enum MacroIndividualCommand{
    Start,
    Stop,
    Abort,
    AbortAll,
}

/// Macro trigger list to lookup macro IDs via their trigger.
pub type MacroTrigger = HashMap<u32, Vec<String>>;
