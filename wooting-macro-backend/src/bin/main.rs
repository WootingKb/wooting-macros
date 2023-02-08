use wooting_macro_backend::MacroBackend;
use log::*;

#[tokio::main(flavor = "multi_thread", worker_threads = 10)]
/// This main function serves only for running the backend. Backend can be run without frontend parts as most things are separated.
async fn main() {
    env_logger::init();
    
    info!("Running only backend");

    let backend = MacroBackend::default();

    backend.init().await;
}
