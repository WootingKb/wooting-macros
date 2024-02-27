use crate::MacroData;
use anyhow::Result;
use std::fs::File;
use std::path::PathBuf;

use crate::plugin::delay::MACRO_EVENT_DELAY;
use log::*;

/// Trait to get data or write out data from the state to file.
pub trait ConfigFile: Default + serde::Serialize + for<'de> serde::Deserialize<'de> {
    fn file_name() -> Result<PathBuf>;

    /// Reads the data from the file and returns it.
    ///
    /// If it errors out, it replaces and writes a default config.
    fn read_data() -> Result<Self> {
        match File::open(Self::file_name()?) {
            Ok(data) => {
                let data: Self = match serde_json::from_reader(&data) {
                    Ok(x) => x,
                    Err(error) => {
                        error!("Error reading config.json, using default data and moving to backup. {}", error);
                        let mut file_name = Self::file_name()?.to_str().unwrap().to_owned();

                        if PathBuf::from(format!("{}.bak", file_name)).exists() {
                            let mut i = 0;
                            while PathBuf::from(format!("{}-{}.bak", file_name, i)).exists() {
                                i += 1;
                            }
                            file_name = format!("{}-{}.bak", file_name, i);
                        }
                        warn!(
                            "Renaming {} to {}",
                            Self::file_name()?.to_str().unwrap(),
                            file_name
                        );

                        std::fs::rename(Self::file_name()?, file_name)
                            .expect("cannot rename the invalid config, aborting.");
                        Self::default()
                    }
                };
                Ok(data)
            }

            Err(err) => match err.kind() {
                std::io::ErrorKind::NotFound => {
                    warn!("File not found, writing a default config {}", err);
                    Self::default().write_to_file()?;
                    Ok(Self::default())
                }
                err => Err(anyhow::format_err!("filesystem error: {}", err)),
            },
        }
    }

    /// Writes the config file to the config directory.
    ///
    /// If it fails, it uses only in-memory defaults and won't save anything to disk.
    fn write_to_file(&self) -> Result<()> {
        let converted_json = serde_json::to_string_pretty(&self)?;

        std::fs::write(Self::file_name()?.as_path(), converted_json)?;

        Ok(())
    }
}

impl ConfigFile for ApplicationConfig {
    fn file_name() -> Result<PathBuf> {
        let path: PathBuf;
        let dir = {
            #[cfg(debug_assertions)]
            {
                path = PathBuf::from("..");
            }

            #[cfg(not(debug_assertions))]
            {
                path = {
                    let conf_dir: Result<PathBuf> = match dirs::config_dir() {
                        Some(config_path) => Ok(config_path),
                        None => Err(anyhow::Error::msg(
                            "Cannot find config directory, cannot proceed.",
                        )),
                    };
                    conf_dir?.join(CONFIG_DIR)
                };
            }

            path
        };

        Ok(dir.join(CONFIG_FILE))
    }
}

impl ConfigFile for LogDirPath {
    fn file_name() -> Result<PathBuf> {
        let path: PathBuf;
        #[cfg(debug_assertions)]
        {
            path = PathBuf::from("..");
        }

        #[cfg(not(debug_assertions))]
        {
            path = {
                let conf_dir: Result<PathBuf> = match dirs::config_dir() {
                    Some(config_path) => Ok(config_path),
                    None => Err(anyhow::Error::msg(
                        "Cannot find config directory, cannot proceed.",
                    )),
                };
                conf_dir?.join(CONFIG_DIR)
            };
        }

        Ok(path)
    }
}

impl ConfigFile for LogFileName {
    fn file_name() -> Result<PathBuf> {
        let path: PathBuf;

        let dir = {
            #[cfg(debug_assertions)]
            {
                path = PathBuf::from("..");
            }

            #[cfg(not(debug_assertions))]
            {
                let conf_dir: Result<PathBuf> = match dirs::config_dir() {
                    Some(config_path) => Ok(config_path),
                    None => Err(anyhow::Error::msg(
                        "Cannot find config directory, cannot proceed.",
                    )),
                };
                path = conf_dir?.join(CONFIG_DIR);
            }
            path
        };

        Ok(dir.join(LOG_FILE))
    }
}
impl ConfigFile for MacroData {
    fn file_name() -> Result<PathBuf> {
        let path: PathBuf;
        let dir = {
            #[cfg(debug_assertions)]
            {
                path = PathBuf::from("..");
            }

            #[cfg(not(debug_assertions))]
            {
                path = {
                    let conf_dir: Result<PathBuf> = match dirs::config_dir() {
                        Some(config_path) => Ok(config_path),
                        None => Err(anyhow::Error::msg(
                            "Cannot find config directory, cannot proceed.",
                        )),
                    };
                    conf_dir?.join(CONFIG_DIR)
                };
            }

            path
        };

        Ok(dir.join(DATA_FILE))
    }
}

impl Default for ApplicationConfig {
    fn default() -> Self {
        ApplicationConfig {
            auto_start: false,
            default_delay_value: MACRO_EVENT_DELAY,
            default_element_duration_value: 20,
            auto_add_delay: false,
            auto_select_element: true,
            minimize_at_launch: false,
            theme: "light".to_string(),
            minimize_to_tray: true,
        }
    }
}

#[cfg(not(debug_assertions))]
/// Has to be allowed to suppress warnings.
///
/// Required for release builds which save configs to %appdata%
pub const CONFIG_DIR: &str = "wooting-macro-app";

#[cfg(debug_assertions)]
/// Debug builds save configs to the working parent directory.
pub const CONFIG_DIR: &str = "..";

/// Config file name
const CONFIG_FILE: &str = "config.json";

/// Log file name
const LOG_FILE: &str = "Wootomation.log";

/// Macro data file name
const DATA_FILE: &str = "data_json.json";

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "PascalCase")]
/// Configuration of the application, loaded into the state and from this also written to config.
pub struct ApplicationConfig {
    pub auto_start: bool,
    pub default_delay_value: u64,
    pub default_element_duration_value: u64,
    pub auto_add_delay: bool,
    pub auto_select_element: bool,
    pub minimize_at_launch: bool,
    pub theme: String,
    pub minimize_to_tray: bool,
}
#[derive(Debug, serde::Serialize, serde::Deserialize, Clone, Default)]
#[serde(rename_all = "PascalCase")]
pub struct LogDirPath {}

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone, Default)]
#[serde(rename_all = "PascalCase")]
pub struct LogFileName {}
