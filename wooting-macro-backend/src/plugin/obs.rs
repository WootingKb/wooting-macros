use anyhow::anyhow;
use log::info;
use obws::Client;

pub struct ObsStatus {
    pub scenes_list: obws::Client,
}

impl ObsStatus {
    /// Engage the OBS plugin. Not done.
    pub async fn new() -> Result<Self, anyhow::Error> {
        // Connect to the OBS instance through obs-websocket.
        match Client::connect("localhost", 4455, Some("123456"))
        .await{
            Ok(x) => {
                info!("Connected to OBS");
                Ok(Self {
                    scenes_list: x,
                })
            }
            Err(err) => {
                Err(anyhow!("Error connecting to OBS: {}", err))
            }
        }
    }

    pub async fn get_scene_list(&self) {
        let scenes = self.scenes_list.scenes().list().await.unwrap();
        info!("Scenes: {:?}", scenes);
        println!("Scenes: {:?}", scenes);
    }
}
