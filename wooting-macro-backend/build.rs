fn main() {
    tonic_build::compile_protos("../protos/wooting_service.proto").unwrap();
}
