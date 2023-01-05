use criterion::{black_box, criterion_group, criterion_main, Criterion};
use criterion::async_executor::AsyncExecutor;

use wooting_macro_backend::*;


fn fibonacci(n: u64) -> u64 {
    match n {
        0 => 1,
        1 => 1,
        n => fibonacci(n-1) + fibonacci(n-2),
    }

}

fn criterion_benchmark(c: &mut Criterion) {
    c.bench_function("fib 20", |b| b.iter(|| fibonacci(black_box(20))));
}


fn data_creation_time (c: &mut Criterion){
    let test = wooting_macro_backend::MacroBackend::default();

    c.bench_function("backend create", |b| b.iter(||test.init().await));
}

criterion_group!(benches, data_creation_time);
criterion_main!(benches);