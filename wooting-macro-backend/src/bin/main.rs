use wooting_macro_backend::MacroBackend;

use log::*;
use log4rs::{
    append::{
        console::{ConsoleAppender, Target},
        rolling_file::{
            policy::compound::{
                roll::fixed_window::FixedWindowRoller, trigger::size::SizeTrigger, CompoundPolicy,
            },
            RollingFileAppender,
        },
    },
    config::{Appender, Config, Root},
    encode::pattern::PatternEncoder,
    filter::threshold::ThresholdFilter,
};
use std::str::FromStr;

use wooting_macro_backend::config::*;

#[tokio::main(flavor = "multi_thread", worker_threads = 10)]
/// This main function serves only for running the backend. Backend can be run without frontend parts as most things are separated.
async fn main() {
    //This is here for possible future logging configuration from the frontend. Use result as a variable for on-the-fly changes.
    engage_logger().expect("Failed to engage logger");

    println!("Running only backend");
    let backend = MacroBackend::default();
    backend.init().await;
}
/// Engages the logger.
fn engage_logger() -> Result<log4rs::Handle, SetLoggerError> {
    log_panics::init();

    let level: log::LevelFilter = option_env!("RUST_LOG")
        .and_then(|s| log::LevelFilter::from_str(s).ok())
        .unwrap_or(log::LevelFilter::Info);

    let log_file_name = wooting_macro_backend::config::LogFilePath::file_name();
    let archive_path = wooting_macro_backend::config::LogArchivePath::file_name();

    // Build a stderr logger.
    let stdout = ConsoleAppender::builder()
        .encoder(Box::new(PatternEncoder::new(
            "{d(%Y-%m-%d %H:%M:%S:%f)} | {h({({l}):5.5})} | {m}{n}",
        )))
        .target(Target::Stdout)
        .build();

    // Logging to log file.
    let logfile = RollingFileAppender::builder()
        // Pattern: https://docs.rs/log4rs/*/log4rs/encode/pattern/index.html
        .encoder(Box::new(PatternEncoder::new(
            "{d(%Y-%m-%d %H:%M:%S:%f)} | {h({({l}):5.5})} | {m}{n}",
        )))
        // .roll_on_startup(true)
        .build(
            log_file_name,
            Box::new(CompoundPolicy::new(
                Box::new(SizeTrigger::new(
                    // Set the limit of each logfile to 128 kibibytes
                    1024 * 128,
                )),
                Box::new(
                    FixedWindowRoller::builder()
                        .build(
                            archive_path
                                .join("application_log_archive_{}_.gzip")
                                .to_str()
                                .unwrap(),
                            2,
                        )
                        .expect("Error creating the archive"),
                ),
            )),
        )
        .unwrap();

    // Log Trace level output to file where trace is the default level
    // and the programmatically specified level to stderr.
    let config = Config::builder()
        .appender(Appender::builder().build("logfile", Box::new(logfile)))
        .appender(
            Appender::builder()
                .filter(Box::new(ThresholdFilter::new(level)))
                .build("stdout", Box::new(stdout)),
        )
        .build(
            Root::builder()
                .appender("logfile")
                .appender("stdout")
                .build(level),
        )
        .unwrap();

    let handle = log4rs::init_config(config)?;

    Ok(handle)
}
