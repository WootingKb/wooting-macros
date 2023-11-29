use env_logger::Env;
use log::*;
use wooting_macro_backend::MacroBackend;

#[tokio::main(flavor = "multi_thread", worker_threads = 10)]
/// This main function serves only for running the backend. Backend can be run without frontend parts as most things are separated.
async fn main() {
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();

    info!("Running only backend");

    let backend = MacroBackend::default();

    if let Err(e) = backend.init(None).await {
        eprintln!("Initialization error: {}", e);
    };
}
