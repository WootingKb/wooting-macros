use criterion::{criterion_group, criterion_main, Criterion};

use criterion::async_executor::AsyncExecutor;

use std::time::Duration;


use wooting_macro_backend::*;


// fn fibonacci(n: u64) -> u64 {
//     match n {
//         0 => 1,
//         1 => 1,
//         n => fibonacci(n-1) + fibonacci(n-2),
//     }
//
// }
//
// fn criterion_benchmark(c: &mut Criterion) {
//     c.bench_function("fib 20", |b| b.iter(|| fibonacci(black_box(20))));
// }


fn data_creation_time (c: &mut Criterion){
    //c.measurement_time(Duration::from_secs(30));

    c.bench_function("backend create", |b| b.iter(||MacroBackend::default()));
}

criterion_group!(benches, data_creation_time);
criterion_main!(benches);