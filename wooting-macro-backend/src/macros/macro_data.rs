use crate::grabbing::executor::input::keypress_executor_receiver;
use crate::macros::collections::{Collection, Collections};
use crate::macros::events::triggers::{MacroTrigger, TriggerEventType};
use crate::macros::macro_config::Macro;
use anyhow::{Error, Result};
use halfbrown::HashMap;
use log::*;
use std::thread;
use uuid::Uuid;

///MacroData is the main data structure that contains all macro data.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct MacroData {
    pub data: Collections,
}

impl Default for MacroData {
    fn default() -> Self {
        MacroData {
            data: vec![Collection {
                name: "Collection 1".to_string(),
                icon: ":smile:".to_string(),
                macros: vec![],
                enabled: true,
            }],
        }
    }
}

impl MacroData {
    /// Extracts the first trigger data from the macros, and pairs UUIDs to macros
    pub fn new_lookup(&self) -> Result<MacroLookup> {
        let (schan_keypress_execute, rchan_keypress_execute) =
            tokio::sync::mpsc::unbounded_channel();
        // Create the keypress executor
        thread::spawn(move || {
            keypress_executor_receiver(rchan_keypress_execute);
        });

        info!("Spawning a new receiver for a macro");

        let mut macro_lookup = MacroLookup::default();

        for collections in &self.data {
            if collections.enabled {
                for macros in &collections.macros {
                    if macros.enabled {
                        // Get uuid also for later use so we don't have to reverse lookup.
                        let mut unique_id: String;

                        loop {
                            unique_id = Uuid::new_v4().to_string();

                            if macro_lookup.id_map.get(&unique_id).is_none() {
                                // let macro_keypress_sender = schan_keypress_execute.clone();
                                let macro_to_insert =
                                    Macro::new(macros.clone(), schan_keypress_execute.clone());

                                macro_lookup
                                    .id_map
                                    .insert(unique_id.clone(), macro_to_insert);
                                break;
                            }
                        }

                        match &macros.trigger {
                            TriggerEventType::KeyPressEvent { data, .. } => {
                                //TODO: optimize using references
                                match data.len() {
                                    0 => {
                                        return Err(Error::msg(format!("A trigger key can't be zero, aborting trigger generation: {:#?}", data).to_string()));
                                    }
                                    1 => {
                                        let first_data = match data.first() {
                                            Some(data) => *data,
                                            None => {
                                                return Err(Error::msg(
                                                    "Error getting first element in macro trigger",
                                                ));
                                            }
                                        };
                                        trace!(
                                            "Generated UUID {} and inserting macro: {:?}",
                                            unique_id,
                                            macros
                                        );

                                        macro_lookup
                                            .triggers
                                            .entry(first_data)
                                            .or_default()
                                            .push(unique_id.clone())
                                    }
                                    _ => data[..data.len() - 1].iter().for_each(|x| {
                                        trace!(
                                            "Generated UUID {} and inserting macro: {:?}",
                                            unique_id,
                                            macros
                                        );
                                        macro_lookup
                                            .triggers
                                            .entry(*x)
                                            .or_default()
                                            .push(unique_id.clone());
                                    }),
                                }
                            }
                            TriggerEventType::MouseEvent { data } => {
                                let data: u32 = data.into();

                                match macro_lookup.triggers.get_mut(&data) {
                                    Some(value) => value.push(unique_id.clone()),
                                    None => macro_lookup
                                        .triggers
                                        .insert_nocheck(data, vec![unique_id.clone()]),
                                }
                            }
                        }
                    }
                }
            }
        }

        Ok(macro_lookup)
    }
}

#[derive(Debug, Default)]
/// Hashmap to check the first trigger key of each macro.
pub struct MacroLookup {
    pub triggers: MacroTrigger,
    pub id_map: MacroIdList,

}

/// Macro ID list to lookup macros uniquely and fast.
pub type MacroIdList = HashMap<String, Macro>;
