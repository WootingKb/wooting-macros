#[cfg(not(debug_assertions))]
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;

use anyhow::Result;
#[cfg(not(debug_assertions))]
use dirs;
use log::*;
use tokio::sync::RwLock;

use crate::config::{ApplicationConfig, ConfigFile};
// This has to be imported for release build
#[allow(unused_imports)]
use crate::config::CONFIG_DIR;
use crate::grabbing::executor::input::macro_executor;
#[cfg(target_os = "linux")]
use crate::grabbing::linux::input;
#[cfg(target_os = "macos")]
use crate::grabbing::macos::input;
#[cfg(target_os = "windows")]
use crate::grabbing::windows::input;
use crate::hid_table::*;
use crate::macros::events::triggers::{MacroIndividualCommand, MacroTriggerEvent};
use crate::macros::macro_data::{MacroData, MacroLookup};

pub mod config;
pub mod grabbing;
pub mod hid_table;
pub mod macros;
pub mod plugin;

/// State of the application in RAM (RWlock).
#[derive(Debug)]
pub struct MacroBackend {
    pub macro_data: Arc<RwLock<MacroData>>,
    pub config: Arc<RwLock<ApplicationConfig>>,
    pub macro_lookup: Arc<RwLock<MacroLookup>>,
    pub is_listening: Arc<AtomicBool>,
}

impl MacroBackend {
    /// Creates the data directory if not present in %appdata% (only in release build).
    pub fn generate_directories() -> Result<()> {
        #[cfg(not(debug_assertions))]
        {
            let conf_dir: Result<PathBuf> = match dirs::config_dir() {
                Some(config_path) => Ok(config_path),
                None => Err(anyhow::Error::msg(
                    "Cannot find config directory, cannot proceed.",
                )),
            };

            let conf_dir = conf_dir?.join(CONFIG_DIR);

            std::fs::create_dir_all(conf_dir.as_path())?;
        }
        Ok(())
    }

    /// Sets whether the backend should process keys that it listens to. Disabling disables the processing logic, but the app still grabs the keys.
    pub fn set_is_listening(&self, is_listening: bool) {
        self.is_listening.store(is_listening, Ordering::Relaxed);
    }
    /// Sets the macros from the frontend to the files. This function is here to completely split the frontend off.
    pub async fn set_macros(&self, macros: MacroData) -> Result<()> {
        macros.write_to_file()?;
        *self.macro_lookup.write().await = macros.new_lookup()?;

        debug!(
            "Listing macro lookup ID list:\n{:#?}",
            self.macro_lookup.read().await.id_map
        );
        debug!(
            "Listing macro lookup trigger list:\n{:#?}",
            self.macro_lookup.read().await.triggers
        );

        *self.macro_data.write().await = macros;
        Ok(())
    }

    /// Execute macro by its name - this is a function used by the frontend.
    pub async fn execute_macro_by_name(
        &self,
        macro_to_control: String,
        action: MacroIndividualCommand,
    ) -> Result<()> {
        for (_, macro_item) in self.macro_lookup.write().await.id_map.iter_mut() {
            if macro_item.config.name == macro_to_control {
                match action {
                    MacroIndividualCommand::Start => {
                        macro_item.on_event(MacroTriggerEvent::Pressed)
                    }
                    MacroIndividualCommand::Stop => {
                        macro_item.on_event(MacroTriggerEvent::Released)
                    }
                    MacroIndividualCommand::Abort => macro_item.on_event(MacroTriggerEvent::Abort),
                    MacroIndividualCommand::AbortAll => {}
                }
            } else if let MacroIndividualCommand::AbortAll = action {
                macro_item.on_event(MacroTriggerEvent::Abort)
            }
        }

        Ok(())
    }

    /// Sets the config from the frontend to the files. This function is here to completely split the frontend off.
    pub async fn set_config(&self, config: ApplicationConfig) -> Result<()> {
        config.write_to_file()?;
        *self.config.write().await = config;
        Ok(())
    }

    /// Initializes the entire backend and gets the whole grabbing system running.
    pub async fn init(&self) {
        let (schan_macro_execute, rchan_macro_execute) = tokio::sync::mpsc::unbounded_channel();

        let inner_is_listening = self.is_listening.clone();
        // let inner_keys_pressed_previous = Arc::new(RwLock::new(vec![]));
        let inner_macro_lookup = self.macro_lookup.clone();

        let inner_macro_lookup_clone = inner_macro_lookup.clone();
        //let inner_macro_lookup_clone = inner_macro_lookup.clone();
        // Create the macro executor

        std::thread::spawn(move || {
            let rt = tokio::runtime::Runtime::new().unwrap();
            rt.block_on(async {
                input::check_keypress_simon(
                    inner_is_listening,
                    schan_macro_execute,
                    inner_macro_lookup,
                )
                .await;
            });
        });

        std::thread::spawn(move || {
            let rt = tokio::runtime::Runtime::new().unwrap();
            rt.block_on(async {
                macro_executor(rchan_macro_execute, inner_macro_lookup_clone).await;
            });
        });
    }
}

impl Default for MacroBackend {
    /// Generates a new state.
    fn default() -> Self {
        let macro_data =
            MacroData::read_data().unwrap_or_else(|err| panic!("Cannot get macro data! {}", err));

        let lookup = macro_data
            .new_lookup()
            .expect("error making a new Macro Lookup map");

        MacroBackend {
            macro_data: Arc::new(RwLock::from(macro_data)),
            config: Arc::new(RwLock::from(
                ApplicationConfig::read_data().expect("error reading config"),
            )),
            macro_lookup: Arc::new(RwLock::from(lookup)),
            is_listening: Arc::new(AtomicBool::new(true)),
        }
    }
}
