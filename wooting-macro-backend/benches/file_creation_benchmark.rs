use criterion::{criterion_group, criterion_main, Criterion};
use rdev;
use std::thread;
use tokio::runtime::Runtime;
use tokio::sync::mpsc::*;

use criterion::async_executor::AsyncExecutor;

// use std::time::Duration;

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

fn data_creation_time(c: &mut Criterion) {
    c.bench_function("backend create", |b| b.iter(|| MacroBackend::default()));
}

// Async
// b.to_async(&rt).iter(|| macros_data)

fn execute_macro_bench(c: &mut Criterion) {
    let backend_data = MacroBackend::default();
    let (send_channel, receive_channel) = tokio::sync::mpsc::channel::<rdev::EventType>(1);
    let rt = tokio::runtime::Runtime::new().unwrap();


    thread::spawn(move || {
        keypress_executor_sender(receive_channel);
    });


    let macros_data: Macro = Macro {
        name: "execute_macro_bench".to_string(),
        icon: ":smile:".to_string(),
        sequence: vec![ActionEventType::KeyPressEventAction {
            data: plugin::key_press::KeyPress {
                keypress: 0x04,
                press_duration: 1,
                keytype: plugin::key_press::KeyType::DownUp,
            },
        }],
        macro_type: MacroType::Single,
        trigger: TriggerEventType::KeyPressEvent {
            data: vec![0x05],
            allow_while_other_keys: true,
        },
        active: true,
    };

    //TODO: Get a custom macro data here
    //TODO: Simulate the input by running the grabber?
    //TODO: Stop at the first key send being finished.

    c.bench_function("key_to_key", |b| {
        b.to_async(&rt).iter(|| macros_data.execute(send_channel.clone()))
    });
}


fn find_execute_macro_bench(c: &mut Criterion) {
    let backend_data = MacroBackend::default();
    let (send_channel, receive_channel) = tokio::sync::mpsc::channel::<rdev::EventType>(1);
    let rt = tokio::runtime::Runtime::new().unwrap();


    thread::spawn(move || {
        keypress_executor_sender(receive_channel);
    });


    let macros_data: Macro = Macro {
        name: "find_execute_macro_bench".to_string(),
        icon: ":smile:".to_string(),
        sequence: vec![ActionEventType::KeyPressEventAction {
            data: plugin::key_press::KeyPress {
                keypress: 0x04,
                press_duration: 1,
                keytype: plugin::key_press::KeyType::DownUp,
            },
        }],
        macro_type: MacroType::Single,
        trigger: TriggerEventType::KeyPressEvent {
            data: vec![0x05],
            allow_while_other_keys: true,
        },
        active: true,
    };

    

    //TODO: Get a custom macro data here
    //TODO: Simulate the input by running the grabber?
    //TODO: Stop at the first key send being finished.

    c.bench_function("find_execute_macro_bench", |b| {
        b.to_async(&rt).iter(|| async_check_macro_execution_efficiently(
            vec![0x05],
            vec![macros_data.clone()],
            send_channel.clone(),
        ))
    });
}

criterion_group!(benches, execute_macro_bench, find_execute_macro_bench);
criterion_main!(benches);
