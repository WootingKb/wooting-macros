use anyhow::Result;
use log::*;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use tokio::sync::mpsc::UnboundedSender;
use tokio::sync::RwLock;
use std::time::Duration;
use enigo::{Enigo, Mouse, Coordinate, Settings};
use std::collections::HashMap;
use uuid::Uuid;
use once_cell::sync::Lazy;

pub use rdev;

/// Global session manager for tracking active mouse emulation sessions
static EMULATION_SESSIONS: Lazy<RwLock<HashMap<Uuid, Arc<AtomicBool>>>> =
    Lazy::new(|| RwLock::new(HashMap::new()));

/// Curve type for analog input processing
#[derive(Debug, Clone, Copy, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
#[serde(rename_all = "PascalCase")]
pub enum CurveType {
    Power,
    Log,
    SCurve,
    Linear,
}

impl CurveType {
    pub fn from_str(s: &str) -> Result<Self> {
        match s {
            "Power" => Ok(CurveType::Power),
            "Log" => Ok(CurveType::Log),
            "S-Curve" | "SCurve" => Ok(CurveType::SCurve),
            "Linear" => Ok(CurveType::Linear),
            _ => Err(anyhow::anyhow!("Unknown curve type: {}", s)),
        }
    }
}

/// Configuration for mouse emulation
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct MouseEmulationConfig {
    /// Sensitivity for mouse movement (pixels per analog unit)
    pub sensitivity_movement: f32,
    /// Sensitivity for scrolling
    pub sensitivity_scroll: f32,
    /// Y-axis sensitivity adjustment (0.0 to 1.0, where 0.0 means no adjustment)
    pub y_sensitivity_adjustment: f32,
    /// Curve steepness factor (>0)
    pub curve_factor: f32,
    /// Lower activation threshold (0.0 to <1.0)
    pub activation_point: f32,
    /// Upper actuation limit (>activation_point to 1.0)
    pub maximum_actuation: f32,
    /// Type of curve to apply
    pub curve_type: CurveType,
    /// Key mapping for directions: [up, down, left, right, scroll_up, scroll_down, scroll_left, scroll_right]
    pub key_mapping: [u16; 8],
    /// Whether to require an activation key
    pub use_activation_key: bool,
    /// Activation key code (ignored if use_activation_key is false)
    pub activation_key: u16,
}

impl Default for MouseEmulationConfig {
    fn default() -> Self {
        MouseEmulationConfig {
            sensitivity_movement: 15.0,
            sensitivity_scroll: 5.0,
            y_sensitivity_adjustment: 0.0,
            curve_factor: 2.0,
            activation_point: 0.1,
            maximum_actuation: 1.0,
            curve_type: CurveType::Power,
            key_mapping: [0x52, 0x51, 0x50, 0x4F, 0x4B, 0x4E, 0x4D, 0x49], // Arrow keys and page keys
            use_activation_key: false,
            activation_key: 0xE2, // Alt key
        }
    }
}

/// Mouse emulation action that can be executed as part of a macro
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(tag = "type")]
pub enum MouseEmulationAction {
    /// Start mouse emulation with configuration
    Start {
        config: MouseEmulationConfig,
    },
    /// Stop mouse emulation
    Stop,
}

/// Internal state for an active mouse emulation session
#[allow(dead_code)]
struct MouseEmulationSession {
    config: MouseEmulationConfig,
    is_running: Arc<AtomicBool>,
}

impl MouseEmulationAction {
    /// Process analog input value through a curve
    fn process_input(
        raw_value: f32,
        activation_point: f32,
        curve_factor: f32,
        maximum_actuation: f32,
        curve_type: CurveType,
    ) -> Result<f32> {
        if !(0.0 <= activation_point && activation_point < maximum_actuation && maximum_actuation <= 1.0) {
            return Err(anyhow::anyhow!(
                "Invalid activation points: 0.0 <= {} < {} <= 1.0",
                activation_point,
                maximum_actuation
            ));
        }
        if curve_factor <= 0.0 {
            return Err(anyhow::anyhow!("Curve factor must be > 0.0"));
        }

        if raw_value < activation_point {
            return Ok(0.0);
        }
        if raw_value > maximum_actuation {
            return Ok(1.0);
        }

        // Normalize between activation_point and maximum_actuation
        let normalized = (raw_value - activation_point) / (maximum_actuation - activation_point);
        let normalized = normalized.max(0.0).min(1.0);

        // Apply curve
        let result = match curve_type {
            CurveType::Power => normalized.powf(curve_factor),
            CurveType::Log => (1.0 + curve_factor * normalized).ln() / (1.0 + curve_factor).ln(),
            CurveType::SCurve => 1.0 / (1.0 + (-curve_factor * (normalized - 0.5)).exp()),
            CurveType::Linear => normalized,
        };

        Ok(result)
    }

    /// Execute the mouse emulation action
    pub async fn execute(&self, send_channel: UnboundedSender<rdev::EventType>) -> Result<()> {
        match self {
            MouseEmulationAction::Start { config } => {
                
                let config = config.clone();
                let is_running = Arc::new(AtomicBool::new(true));
                let is_running_clone = is_running.clone();
                
                // Generate unique session ID
                let session_id = Uuid::new_v4();
                
                // Store session reference for later termination
                {
                    let mut sessions = EMULATION_SESSIONS.write().await;
                    sessions.insert(session_id, is_running.clone());
                }
                

                // Spawn the emulation loop as a background task
                let session_id_clone = session_id;
                tokio::spawn(async move {
                    Self::emulation_loop(config, is_running_clone, send_channel).await;
                    
                    // Clean up session after loop ends
                    {
                        let mut sessions = EMULATION_SESSIONS.write().await;
                        sessions.remove(&session_id_clone);
                    }
                });

                Ok(())
            }
            MouseEmulationAction::Stop => {
                
                // Signal all running sessions to stop
                {
                    let mut sessions = EMULATION_SESSIONS.write().await;
                    for (_session_id, is_running) in sessions.iter() {
                        is_running.store(false, Ordering::SeqCst);
                    }
                    sessions.clear();
                }
                
                Ok(())
            }
        }
    }

    /// Main emulation loop
    async fn emulation_loop(config: MouseEmulationConfig, is_running: Arc<AtomicBool>, send_channel: UnboundedSender<rdev::EventType>) {
        let tick_interval = Duration::from_millis(10);
        let mut interval = tokio::time::interval(tick_interval);
        let mut last_scroll_time = std::time::Instant::now();
        let scroll_throttle = Duration::from_millis(25); // Send scroll events at most every 25ms

        // Initialize mouse controller with default settings
        let settings = Settings::default();
        let mut enigo = match Enigo::new(&settings) {
            Ok(e) => e,
            Err(e) => {
                error!("Failed to initialize enigo: {:?}", e);
                return;
            }
        };

        // Extract key codes from mapping for easier access
        let key_up = config.key_mapping[0];
        let key_down = config.key_mapping[1];
        let key_left = config.key_mapping[2];
        let key_right = config.key_mapping[3];
        let key_scroll_up = config.key_mapping[4];
        let key_scroll_down = config.key_mapping[5];
        let key_scroll_left = config.key_mapping[6];
        let key_scroll_right = config.key_mapping[7];



        // Get or initialize SDK
        let sdk = match super::wooting_sdk::WootingSDK::instance() {
            Ok(sdk_lock) => sdk_lock,
            Err(e) => {
                error!("Failed to initialize Wooting SDK: {}", e);
                return;
            }
        };

        while is_running.load(Ordering::SeqCst) {
            interval.tick().await;

            let sdk_result = {
                // Lock scope - don't hold lock across await
                match sdk.lock() {
                    Ok(_sdk_instance) => Ok(()),
                    Err(e) => Err(format!("Failed to acquire SDK lock: {}", e))
                }
            };

            if sdk_result.is_ok() {
                let should_send_scroll = last_scroll_time.elapsed() >= scroll_throttle;
                
                if let Err(_e) = Self::process_frame(
                    &config,
                    &mut enigo,
                    &sdk,
                    &send_channel,
                    key_up,
                    key_down,
                    key_left,
                    key_right,
                    key_scroll_up,
                    key_scroll_down,
                    key_scroll_left,
                    key_scroll_right,
                    should_send_scroll,
                    &mut last_scroll_time,
                )
                .await
                {
                    // Silently skip frame on error
                }
                
            } else {
                error!("Failed to acquire SDK lock");
                break;
            }
        }


    }

    /// Process a single frame of emulation
    async fn process_frame(
        config: &MouseEmulationConfig,
        enigo: &mut Enigo,
        sdk: &Arc<Mutex<super::wooting_sdk::WootingSDK>>,
        send_channel: &UnboundedSender<rdev::EventType>,
        key_up: u16,
        key_down: u16,
        key_left: u16,
        key_right: u16,
        key_scroll_up: u16,
        key_scroll_down: u16,
        key_scroll_left: u16,
        key_scroll_right: u16,
        should_send_scroll: bool,
        last_scroll_time: &mut std::time::Instant,
    ) -> Result<()> {
        // Lock SDK for reading values
        let sdk_guard = sdk.lock().map_err(|e| anyhow::anyhow!("Failed to lock SDK: {}", e))?;
        
        // Check activation key if required
        if config.use_activation_key {
            let activation_value = sdk_guard.read_analog(config.activation_key);
            if activation_value < config.activation_point {
                // Activation key not pressed, skip this frame
                return Ok(());
            }
        }

        // Read all analog values from SDK
        let val_up = if key_up > 0 { sdk_guard.read_analog(key_up) } else { 0.0 };
        let val_down = if key_down > 0 { sdk_guard.read_analog(key_down) } else { 0.0 };
        let val_left = if key_left > 0 { sdk_guard.read_analog(key_left) } else { 0.0 };
        let val_right = if key_right > 0 { sdk_guard.read_analog(key_right) } else { 0.0 };
        
        // Only read scroll values if keys are actually mapped (non-zero)
        let val_scroll_up = if key_scroll_up > 0 { sdk_guard.read_analog(key_scroll_up) } else { 0.0 };
        let val_scroll_down = if key_scroll_down > 0 { sdk_guard.read_analog(key_scroll_down) } else { 0.0 };
        let val_scroll_left = if key_scroll_left > 0 { sdk_guard.read_analog(key_scroll_left) } else { 0.0 };
        let val_scroll_right = if key_scroll_right > 0 { sdk_guard.read_analog(key_scroll_right) } else { 0.0 };
        
        // Debug logging for scroll values
        if val_scroll_up > 0.0 || val_scroll_down > 0.0 || val_scroll_left > 0.0 || val_scroll_right > 0.0 {
            debug!("Scroll input detected - up: {}, down: {}, left: {}, right: {}", 
                val_scroll_up, val_scroll_down, val_scroll_left, val_scroll_right);
        }

        // Drop lock to prevent holding it for too long
        drop(sdk_guard);

        // Process movement input through curve
        let up_processed = Self::process_input(
            val_up,
            config.activation_point,
            config.curve_factor,
            config.maximum_actuation,
            config.curve_type,
        )?;
        let down_processed = Self::process_input(
            val_down,
            config.activation_point,
            config.curve_factor,
            config.maximum_actuation,
            config.curve_type,
        )?;
        let left_processed = Self::process_input(
            val_left,
            config.activation_point,
            config.curve_factor,
            config.maximum_actuation,
            config.curve_type,
        )?;
        let right_processed = Self::process_input(
            val_right,
            config.activation_point,
            config.curve_factor,
            config.maximum_actuation,
            config.curve_type,
        )?;

        // Process scroll input through curve
        let scroll_up_processed = Self::process_input(
            val_scroll_up,
            config.activation_point,
            config.curve_factor,
            config.maximum_actuation,
            config.curve_type,
        )?;
        let scroll_down_processed = Self::process_input(
            val_scroll_down,
            config.activation_point,
            config.curve_factor,
            config.maximum_actuation,
            config.curve_type,
        )?;
        let scroll_left_processed = Self::process_input(
            val_scroll_left,
            config.activation_point,
            config.curve_factor,
            config.maximum_actuation,
            config.curve_type,
        )?;
        let scroll_right_processed = Self::process_input(
            val_scroll_right,
            config.activation_point,
            config.curve_factor,
            config.maximum_actuation,
            config.curve_type,
        )?;

        // Calculate movement deltas
        let y_sensitivity_factor = 1.0 - config.y_sensitivity_adjustment;
        let mut dx: f32 = 0.0;
        let mut dy: f32 = 0.0;

        dy -= up_processed * config.sensitivity_movement * y_sensitivity_factor;
        dy += down_processed * config.sensitivity_movement * y_sensitivity_factor;
        dx -= left_processed * config.sensitivity_movement;
        dx += right_processed * config.sensitivity_movement;

        // Calculate scroll deltas
        let mut scr_x: f32 = 0.0;
        let mut scr_y: f32 = 0.0;

        scr_y += scroll_up_processed * config.sensitivity_scroll;
        scr_y -= scroll_down_processed * config.sensitivity_scroll;
        scr_x -= scroll_left_processed * config.sensitivity_scroll;
        scr_x += scroll_right_processed * config.sensitivity_scroll;

        // Apply mouse movement (only if threshold exceeded to avoid jitter)
        const MOVEMENT_THRESHOLD: f32 = 0.01;
        if dx.abs() > MOVEMENT_THRESHOLD || dy.abs() > MOVEMENT_THRESHOLD {
            // Move mouse relative to current position using enigo
            let _ = enigo.move_mouse(dx as i32, dy as i32, Coordinate::Rel);
        }

        // Handle scrolling using rdev for cross-platform compatibility
        if should_send_scroll && (scr_x.abs() > MOVEMENT_THRESHOLD || scr_y.abs() > MOVEMENT_THRESHOLD) {
            // Send scroll events via rdev
            // Vertical scroll: up is positive, down is negative
            // Clamp to reasonable range for scroll wheel events (-10 to 10)
            let scroll_y = (scr_y.round() as i64).clamp(-10, 10);
            if scroll_y != 0 {
                debug!("Sending vertical scroll event: delta_y={}", scroll_y);
                if let Err(e) = send_channel.send(rdev::EventType::Wheel {
                    delta_x: 0,
                    delta_y: scroll_y,
                }) {
                    debug!("Failed to send vertical scroll event: {}", e);
                }
            }
            
            // Horizontal scroll: right is positive, left is negative
            // Clamp to reasonable range for scroll wheel events (-10 to 10)
            let scroll_x = (scr_x.round() as i64).clamp(-10, 10);
            if scroll_x != 0 {
                debug!("Sending horizontal scroll event: delta_x={}", scroll_x);
                if let Err(e) = send_channel.send(rdev::EventType::Wheel {
                    delta_x: scroll_x,
                    delta_y: 0,
                }) {
                    debug!("Failed to send horizontal scroll event: {}", e);
                }
            }
            
            // Update the last scroll time
            *last_scroll_time = std::time::Instant::now();
        }

        Ok(())
    }
}

/// Public API for session management
impl MouseEmulationAction {
    /// Get the number of active mouse emulation sessions
    pub async fn active_session_count() -> usize {
        let sessions = EMULATION_SESSIONS.read().await;
        sessions.len()
    }

    /// Stop all active mouse emulation sessions
    pub async fn stop_all() -> Result<()> {
        let mut sessions = EMULATION_SESSIONS.write().await;
        for (_session_id, is_running) in sessions.iter() {
            is_running.store(false, Ordering::SeqCst);
        }
        sessions.clear();
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_process_input_power_curve() {
        let result = MouseEmulationAction::process_input(0.5, 0.1, 2.0, 1.0, CurveType::Power)
            .expect("Failed to process input");
        assert!(result > 0.0 && result < 1.0);
    }

    #[test]
    fn test_process_input_below_activation() {
        let result = MouseEmulationAction::process_input(0.05, 0.1, 2.0, 1.0, CurveType::Power)
            .expect("Failed to process input");
        assert_eq!(result, 0.0);
    }

    #[test]
    fn test_process_input_above_maximum() {
        let result = MouseEmulationAction::process_input(1.5, 0.1, 2.0, 1.0, CurveType::Power)
            .expect("Failed to process input");
        assert_eq!(result, 1.0);
    }

    #[test]
    fn test_process_input_invalid_activation_points() {
        let result = MouseEmulationAction::process_input(0.5, 0.8, 2.0, 0.6, CurveType::Power);
        assert!(result.is_err());
    }
}
