use wooting_macro_backend::MacroBackend;

#[tokio::main(flavor = "multi_thread", worker_threads = 10)]
/// This main function serves only for running the backend. Backend can be run without frontend parts as most things are separated.
async fn main() {
    println!("Running only backend");
    let backend = MacroBackend::default();
    backend.init().await;
}
