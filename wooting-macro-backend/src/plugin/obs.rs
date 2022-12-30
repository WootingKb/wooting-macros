use anyhow;
use obws;

#[derive(Default)]
pub struct ObsStatus {
    pub client: Vec<obws::Client>,
}

impl ObsStatus {
    pub async fn initialize(&mut self, pass: String) -> Result<(), anyhow::Error> {
        let password = match pass.len() {
            0..=5 => None,
            _ => Some(pass),
        };

        self.client
            .push(obws::Client::connect("localhost", 4455, password).await?);
        Ok(())
    }

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

    pub async fn set_program_scene(&self, scene_name: &str) -> anyhow::Result<()> {
        self.client
            .first()
            .unwrap()
            .scenes()
            .set_current_program_scene(&scene_name)
            .await?;

        Ok(())
    }

    pub async fn set_preview_scene(&self, scene_name: &str) -> anyhow::Result<()> {
        self.client
            .first()
            .unwrap()
            .scenes()
            .set_current_preview_scene(&scene_name)
            .await?;

        Ok(())
    }
}
