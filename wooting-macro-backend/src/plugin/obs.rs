use anyhow;
use log::{error, info};
use obws;

#[derive(Default)]
pub struct ObsStatus {
    pub client: Vec<obws::Client>,
}

impl ObsStatus {
    /// Initializes the connection with the OBS
    pub async fn initialize(
        &mut self,
        obs_host_ip: String,
        port: u16,
        pass: String,
    ) -> Result<(), anyhow::Error> {
        let password = match pass.len() {
            0..=5 => None,
            _ => Some(pass),
        };

        self.client
            .push(obws::Client::connect(obs_host_ip, port, password).await?);
        Ok(())
    }

    /// Gets the names of scenes by which you can set them. As names must be unique, these serve as the UUID.
    pub async fn get_scene_names(&self) -> Vec<String> {
        self.client
            .first()
            .unwrap()
            .scenes()
            .list()
            .await
            .unwrap()
            .scenes
            .iter()
            .map(|x| x.name.clone())
            .collect()
    }

    /// Sets a program scene
    pub async fn set_program_scene(&self, scene_name: &str) -> anyhow::Result<()> {
        self.client
            .first()
            .unwrap()
            .scenes()
            .set_current_program_scene(scene_name)
            .await?;

        Ok(())
    }

    /// Sets a preview scene
    pub async fn set_preview_scene(&self, scene_name: &str) -> anyhow::Result<()> {
        self.client
            .first()
            .unwrap()
            .scenes()
            .set_current_preview_scene(scene_name)
            .await?;

        Ok(())
    }
    /// Saves the set replay buffer to disk.
    pub async fn save_replay_buffer(&self) -> anyhow::Result<()> {
        self.client
            .first()
            .unwrap()
            .replay_buffer()
            .status()
            .await?;

        self.client.first().unwrap().replay_buffer().save().await?;

        Ok(())
    }

    /// Lists all inputs present on the system
    pub async fn get_inputs(&self) -> anyhow::Result<Vec<String>> {
        let value = self
            .client
            .first()
            .unwrap()
            .inputs()
            .list(None)
            .await
            .unwrap_or_default()
            .iter()
            .map(|x| x.name.clone())
            .collect();

        Ok(value)
    }

    /// Toggles a mute on a specific device
    pub async fn set_toggle_mute_input(&self, name: &str) -> anyhow::Result<()> {
        self.client
            .first()
            .unwrap()
            .inputs()
            .toggle_mute(name)
            .await?;
        Ok(())
    }

    pub async fn save_replay(&self) -> anyhow::Result<()> {
        self.client
            .first()
            .unwrap()
            .replay_buffer()
            .status()
            .await?;

        self.client.first().unwrap().replay_buffer().save().await?;

        Ok(())
    }
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
pub enum OBSAction {
    SaveReplay,
    MuteInput { name: String },
    SetScene { action: SceneType },
}
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
pub enum SceneType {
    ProgramScene { name: String },
    PreviewScene { name: String },
}

impl OBSAction {
    pub async fn execute(&self, obs_status: ObsStatus) {
        match &self {
            OBSAction::SaveReplay => {
                if (obs_status.save_replay_buffer().await).is_ok() {
                    info!("OK, saved replay")
                } else {
                    error!("Failed to save the replay")
                }
            }
            OBSAction::MuteInput { name } => {
                if (obs_status.set_toggle_mute_input(name).await).is_ok() {
                    info!("OK, muted input {}", name)
                } else {
                    error!("Failed to mute the input {}", name)
                }
            }
            OBSAction::SetScene { action } => match action {
                SceneType::ProgramScene { name } => {
                    if (obs_status.set_program_scene(name).await).is_ok() {
                        info!("OK, saved replay")
                    } else {
                        error!("Failed to save the replay")
                    }
                }
                SceneType::PreviewScene { name } => {
                    if (obs_status.set_preview_scene(name).await).is_ok() {
                        info!("OK, saved replay")
                    } else {
                        error!("Failed to save the replay")
                    }
                }
            },
        }
    }
}
