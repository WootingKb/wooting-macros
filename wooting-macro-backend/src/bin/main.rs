use wooting_macro_backend::MacroBackend;

#[tokio::main(flavor = "multi_thread", worker_threads = 10)]
async fn main() {
    println!("Eyo");
    let backend = MacroBackend::new();
    backend.init();
}
