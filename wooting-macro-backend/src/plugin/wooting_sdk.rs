/// FFI bindings and wrapper for Wooting Analog SDK
/// 
/// This module handles all interaction with the Wooting Analog SDK's C library.
/// It uses dynamic loading to load the DLL at runtime.

use anyhow::{Result, bail};
use log::*;
use std::sync::{Arc, Mutex};
use once_cell::sync::Lazy;
use libloading::{Library, Symbol};

type WootingAnalogInitFn = unsafe extern "C" fn() -> i32;
type WootingAnalogReadFn = unsafe extern "C" fn(u16) -> f32;
type WootingAnalogDeinitFn = unsafe extern "C" fn() -> i32;
type WootingAnalogVersionFn = unsafe extern "C" fn() -> u32;

/// Global SDK library - loaded once
static SDK_LIBRARY: Lazy<Result<Library>> = Lazy::new(|| {
    // Try to load the DLL from common locations
    let dll_paths = vec![
        "C:\\Program Files\\wooting-analog-sdk\\wooting_analog_sdk.dll",
        "wooting_analog_sdk.dll",  // Try current directory or system PATH
    ];

    for path in dll_paths {
        match unsafe { Library::new(path) } {
            Ok(lib) => {
                info!("Successfully loaded Wooting Analog SDK from: {}", path);
                return Ok(lib);
            }
            Err(e) => {
                debug!("Failed to load DLL from {}: {}", path, e);
            }
        }
    }

    bail!("Could not find or load wooting_analog_sdk.dll. Please ensure the Wooting Analog SDK is installed.")
});

/// Global SDK instance - shared Arc so callers never own an independent copy that
/// could call wooting_analog_deinit when dropped between emulation sessions.
static SDK_INSTANCE: Lazy<Mutex<Option<Arc<Mutex<WootingSDK>>>>> = Lazy::new(|| {
    Mutex::new(None)
});

/// Safe wrapper around the Wooting Analog SDK
pub struct WootingSDK {
    initialized: bool,
}

impl WootingSDK {
    /// Get or initialize the global SDK instance.
    ///
    /// Returns a clone of the shared Arc — all callers share the same underlying
    /// WootingSDK, so the SDK is never deinitialized between emulation sessions.
    pub fn instance() -> Result<Arc<Mutex<WootingSDK>>> {
        let mut sdk_lock = SDK_INSTANCE.lock().map_err(|e| {
            anyhow::anyhow!("Failed to acquire SDK lock: {}", e)
        })?;

        if sdk_lock.is_none() {
            let sdk = WootingSDK::new()?;
            *sdk_lock = Some(Arc::new(Mutex::new(sdk)));
        }

        Ok(sdk_lock.as_ref().unwrap().clone())
    }

    /// Initialize the SDK
    pub fn new() -> Result<Self> {
        // Ensure library is loaded
        match SDK_LIBRARY.as_ref() {
            Ok(_) => {},
            Err(e) => {
                return Err(anyhow::anyhow!("Failed to load SDK library: {}", e));
            }
        }
        
        unsafe {
            match SDK_LIBRARY.as_ref() {
                Ok(lib) => {
                    let init_fn: Symbol<WootingAnalogInitFn> = lib.get(b"wooting_analog_initialise")
                        .map_err(|e| anyhow::anyhow!("Failed to get initialise function: {}", e))?;
                    
                    let result = init_fn();
                    if result < 0 {
                        bail!("Failed to initialize Wooting Analog SDK (error code: {})", result);
                    }
                }
                Err(e) => {
                    return Err(anyhow::anyhow!("SDK library not available: {}", e));
                }
            }
        }
        
        info!("Wooting Analog SDK initialized successfully");
        Ok(WootingSDK { initialized: true })
    }

    /// Read analog value for a specific key
    pub fn read_analog(&self, code: u16) -> f32 {
        unsafe {
            match SDK_LIBRARY.as_ref() {
                Ok(lib) => {
                    if let Ok(read_fn) = lib.get::<Symbol<WootingAnalogReadFn>>(b"wooting_analog_read_analog") {
                        return read_fn(code);
                    }
                }
                Err(_) => {}
            }
        }
        0.0  // Return 0 if SDK not available
    }

    /// Get SDK version
    pub fn get_version(&self) -> u32 {
        unsafe {
            match SDK_LIBRARY.as_ref() {
                Ok(lib) => {
                    if let Ok(version_fn) = lib.get::<Symbol<WootingAnalogVersionFn>>(b"wooting_analog_get_version") {
                        return version_fn();
                    }
                }
                Err(_) => {}
            }
        }
        0
    }

    /// Shutdown the SDK
    pub fn shutdown(&mut self) -> Result<()> {
        unsafe {
            match SDK_LIBRARY.as_ref() {
                Ok(lib) => {
                    let deinit_fn: Symbol<WootingAnalogDeinitFn> = lib.get(b"wooting_analog_deinit")
                        .map_err(|e| anyhow::anyhow!("Failed to get deinit function: {}", e))?;
                    
                    let result = deinit_fn();
                    if result < 0 {
                        bail!("Failed to deinitialize SDK (error code: {})", result);
                    }
                }
                Err(e) => {
                    return Err(anyhow::anyhow!("SDK library not available: {}", e));
                }
            }
        }
        
        self.initialized = false;
        info!("Wooting Analog SDK shutdown successfully");
        Ok(())
    }
}

impl Drop for WootingSDK {
    fn drop(&mut self) {
        if self.initialized {
            let _ = self.shutdown();
        }
    }
}
