use log::*;
use obws::Client;

/// Engage the OBS plugin. Not done.
pub async fn engage_obs() {
    // Connect to the OBS instance through obs-websocket.
    let client = Client::connect("localhost", 4455, Some("password"))
        .await
        .unwrap();

    // Get and print out version information of OBS and obs-websocket.
    let version = client.general().version().await.unwrap();
    info!("{:#?}", version);

    // Get a list of available scenes and print them out.
    let scene_list = client.scenes().list().await.unwrap();
    info!("{:#?}", scene_list);
}
