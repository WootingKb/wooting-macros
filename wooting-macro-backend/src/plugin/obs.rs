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
}
