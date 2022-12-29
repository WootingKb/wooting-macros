use crate::MacroData;
use std::fs::File;
use std::path::PathBuf;

use log::{error, info};

/// Trait to get data or write out data from the state to file.
pub trait ConfigFile: Default + serde::Serialize + for<'de> serde::Deserialize<'de> {
    fn file_name() -> PathBuf;

    /// Reads the data from the file and returns it.
    /// If it errors out, it replaces and writes a default config
    fn read_data() -> Self {
        let default = Self::default();

        match File::open(Self::file_name().as_path()) {
            Ok(data) => {
                let data: Self = match serde_json::from_reader(&data) {
                    Ok(x) => x,
                    Err(error) => {
                        error!("Error reading config.json, using default data. {}", error);
                        default.write_to_file();
                        default
                    }
                };
                data
            }

            Err(err) => {
                error!("Error opening file, using default config {}", err);
                default.write_to_file();
                default
            }
        }
    }

    /// Writes the config file to the config directory.
    fn write_to_file(&self) {
        match std::fs::write(
            Self::file_name().as_path(),
            serde_json::to_string_pretty(&self).unwrap(),
        ) {
            Ok(_) => {
                info!("Success writing a new file");
            }
            Err(err) => {
                error!(
                    "Error writing a new file, using only read only defaults. {}",
                    err
                );
            }
        };
    }
}

impl ConfigFile for ApplicationConfig {
    fn file_name() -> PathBuf {
        let dir = {
            #[cfg(debug_assertions)]
            let x = PathBuf::from("..");

            #[cfg(not(debug_assertions))]
            let x = dirs::config_dir().unwrap().join(CONFIG_DIR);

            x
        };

        dir.join(CONFIG_FILE)
    }
}

impl ConfigFile for MacroData {
    fn file_name() -> PathBuf {
        let dir = {
            #[cfg(debug_assertions)]
            let x = PathBuf::from("..");

            #[cfg(not(debug_assertions))]
            let x = dirs::config_dir().unwrap().join(CONFIG_DIR);

            x
        };

        dir.join(DATA_FILE)
    }
}

impl Default for ApplicationConfig {
    fn default() -> Self {
        ApplicationConfig {
            auto_start: false,
            default_delay_value: 20,
            auto_add_delay: false,
            auto_select_element: true,
            minimize_at_launch: false,
            theme: "light".to_string(),
            minimize_to_tray: true,
            ordered_key_check: true,
        }
    }
}

//Has to be allowed to suppress warnings. Required for release builds.
#[cfg(not(debug_assertions))]
pub const CONFIG_DIR: &str = "wooting-macro-app";

#[cfg(debug_assertions)]
pub const CONFIG_DIR: &str = "..";

const CONFIG_FILE: &str = "config.json";

const DATA_FILE: &str = "data_json.json";

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "PascalCase")]
/// Configuration of the application, loaded into the state and from this also written to config.
pub struct ApplicationConfig {
    pub auto_start: bool,
    pub default_delay_value: u64,
    pub auto_add_delay: bool,
    pub auto_select_element: bool,
    pub minimize_at_launch: bool,
    pub theme: String,
    pub minimize_to_tray: bool,
    pub ordered_key_check: bool,
}
