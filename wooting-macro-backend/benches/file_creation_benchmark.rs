use criterion::{criterion_group, criterion_main, Criterion};
use itertools::Itertools;
use lazy_static::*;
use rdev;
use std::thread;
use tokio::runtime::Runtime;
use tokio::sync::mpsc::*;

use criterion::async_executor::AsyncExecutor;

// use std::time::Duration;

use wooting_macro_backend::*;

lazy_static! {
    pub static ref MACRO_DATA_SINGLE: Macro = Macro {
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
    pub static ref MACRO_DATA_MULTIPLE: Macro = Macro {
        name: "find_execute_macro_bench".to_string(),
        icon: ":smile:".to_string(),
        sequence: vec![
            ActionEventType::KeyPressEventAction {
                data: plugin::key_press::KeyPress {
                    keypress: 0x04,
                    press_duration: 1,
                    keytype: plugin::key_press::KeyType::DownUp,
                },
            },
            ActionEventType::KeyPressEventAction {
                data: plugin::key_press::KeyPress {
                    keypress: 0x06,
                    press_duration: 1,
                    keytype: plugin::key_press::KeyType::DownUp,
                },
            },
            ActionEventType::KeyPressEventAction {
                data: plugin::key_press::KeyPress {
                    keypress: 0x07,
                    press_duration: 1,
                    keytype: plugin::key_press::KeyType::DownUp,
                },
            },
            ActionEventType::KeyPressEventAction {
                data: plugin::key_press::KeyPress {
                    keypress: 0x08,
                    press_duration: 1,
                    keytype: plugin::key_press::KeyType::DownUp,
                },
            },
        ],
        macro_type: MacroType::Single,
        trigger: TriggerEventType::KeyPressEvent {
            data: vec![0x05],
            allow_while_other_keys: true,
        },
        active: true,
    };
}

// Async
// b.to_async(&rt).iter(|| macros_data)

fn execute_macro_bench(c: &mut Criterion) {
    let (send_channel, receive_channel) = tokio::sync::mpsc::channel::<rdev::EventType>(1);
    let rt = tokio::runtime::Runtime::new().unwrap();

    thread::spawn(move || {
        keypress_executor_sender(receive_channel);
    });

    //TODO: Get a custom macro data here
    //TODO: Simulate the input by running the grabber?
    //TODO: Stop at the first key send being finished.

    c.bench_function("execute_macro_bench", |b| {
        b.to_async(&rt)
            .iter(|| MACRO_DATA_SINGLE.execute(send_channel.clone()))
    });
}

fn find_execute_macro_bench(c: &mut Criterion) {
    let (send_channel, receive_channel) = tokio::sync::mpsc::channel::<rdev::EventType>(1);
    let rt = tokio::runtime::Runtime::new().unwrap();
    let macro_data_loaded = MacroBackend::default();


    thread::spawn(move || {
        keypress_executor_sender(receive_channel);
    });

    let trigger_list = macro_data_loaded.triggers.blocking_read().clone();

    let pressed_keys_copy_converted: Vec<u32> = vec![rdev::Key::KeyB]
        .iter()
        .map(|x| *hid_table::SCANCODE_TO_HID.get(x).unwrap_or(&0))
        .into_iter()
        .unique()
        .collect();

    

    let first_key: u32 = match pressed_keys_copy_converted.first() {
        None => 0,
        Some(data_first) => *data_first,
    };

    let check_these_macros = match trigger_list.get(&first_key) {
        None => {
            vec![]
        }
        Some(data_found) => data_found.to_vec(),
    };

    //TODO: Get a custom macro data here
    //TODO: Simulate the input by running the grabber?
    //TODO: Stop at the first key send being finished.

    println!("{:?}", pressed_keys_copy_converted);
    println!("{:?}", check_these_macros);
    println!("{:?}", trigger_list);

    

    c.bench_function("find_execute_macro_bench", |b| {
        b.to_async(&rt).iter(|| {
            async_check_macro_execution_efficiently(
                pressed_keys_copy_converted.clone(),
                check_these_macros.clone(),
                send_channel.clone(),
            )
        })
    });
}

fn regular_processing(c: &mut Criterion) {
    let (send_channel, receive_channel) = tokio::sync::mpsc::channel::<rdev::EventType>(1);
    let rt = tokio::runtime::Runtime::new().unwrap();
    let macro_data_loaded = MacroBackend::default();


    thread::spawn(move || {
        keypress_executor_sender(receive_channel);
    });

    

    c.bench_function("regular_processing", |b| {
        b.iter(|| {
            regular_processing_test_function(macro_data_loaded.clone())
        })
    });
}

fn regular_processing_test_function (macro_data_loaded: MacroBackend) {
    let trigger_list = macro_data_loaded.triggers.blocking_read().clone();

    let pressed_keys_copy_converted: Vec<u32> = vec![rdev::Key::KeyB]
        .iter()
        .map(|x| *hid_table::SCANCODE_TO_HID.get(x).unwrap_or(&0))
        .into_iter()
        .unique()
        .collect();

    let first_key: u32 = match pressed_keys_copy_converted.first() {
        None => 0,
        Some(data_first) => *data_first,
    };

    let check_these_macros = match trigger_list.get(&first_key) {
        None => {
            vec![]
        }
        Some(data_found) => data_found.to_vec(),
    };

}

async fn full_processing_test_function (macro_data_loaded: MacroBackend, schan_execute: Sender<rdev::EventType>) {
    let trigger_list = macro_data_loaded.triggers.read().await.clone();

    let pressed_keys_copy_converted: Vec<u32> = vec![rdev::Key::KeyB]
        .iter()
        .map(|x| *hid_table::SCANCODE_TO_HID.get(x).unwrap_or(&0))
        .into_iter()
        .unique()
        .collect();

    let first_key: u32 = match pressed_keys_copy_converted.first() {
        None => 0,
        Some(data_first) => *data_first,
    };

    let check_these_macros = match trigger_list.get(&first_key) {
        None => {
            vec![]
        }
        Some(data_found) => data_found.to_vec(),
    };

    let should_grab = {
        if !check_these_macros.is_empty() {
            let channel_copy_send = schan_execute.clone();
            async_check_macro_execution_efficiently(
                pressed_keys_copy_converted,
                check_these_macros,
                channel_copy_send,
            ).await
        } else {
            false
        }
    };



}

fn full_processing(c: &mut Criterion) {
    let (send_channel, receive_channel) = tokio::sync::mpsc::channel::<rdev::EventType>(1);
    let rt = tokio::runtime::Runtime::new().unwrap();
    let macro_data_loaded = MacroBackend::default();


    thread::spawn(move || {
        keypress_executor_sender(receive_channel);
    });

    

    c.bench_function("full_processing", |b| {
        b.to_async(&rt).iter(|| {
            full_processing_test_function(macro_data_loaded.clone(), send_channel.clone())
        })
    });
}

criterion_group!(benches, full_processing, regular_processing, find_execute_macro_bench, execute_macro_bench);
criterion_main!(benches);
