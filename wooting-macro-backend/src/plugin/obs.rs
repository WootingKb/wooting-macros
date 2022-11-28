use obws::Client;



pub async fn engage_obs() {
    // Connect to the OBS instance through obs-websocket.
    let client = Client::connect("localhost", 4455, Some("password")).await?;

    // Get and print out version information of OBS and obs-websocket.
    let version = client.general().version().await.unwrap();
    println!("{:#?}", version);

    // Get a list of available scenes and print them out.
    let scene_list = client.scenes().list().await.unwrap();
    println!("{:#?}", scene_list);



}