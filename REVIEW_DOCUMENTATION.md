# Mouse Emulation Feature - Pull Request Review Guide

**Status**: Complete & Ready for Testing  
**Last Updated**: January 6, 2026

---

## 📋 Executive Summary

This pull request introduces a complete mouse emulation plugin for the Wooting macro software. The feature enables analog key presses to be converted into smooth mouse movement and scrolling with configurable curves, sensitivity, and activation thresholds. The implementation includes both a Rust backend (plugin system) and a React/TypeScript frontend (UI components).

---

## 🏗️ Architecture Overview

The mouse emulation system follows a layered, modular architecture:

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend Layer (React/TypeScript)                          │
│  - MouseEmulationView.tsx (Main component)                 │
│  - GeneralSettings.tsx (6 configuration sliders)           │
│  - KeyMapping.tsx (70+ key selector)                       │
│  - CurveVisualization.tsx (Real-time curve display)        │
└────────────────────────┬────────────────────────────────────┘
                         │ Sends ActionEventType
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  IPC Communication Layer                                    │
│  - Tauri invoke() calls to backend                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend Plugin System (Rust)                               │
│  - mouse_emulation.rs (Main plugin module)                 │
│  - MouseEmulationAction enum (Start/Stop variants)         │
│  - MouseEmulationConfig struct (All user settings)         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Async Emulation Loop (Tokio)                              │
│  - 10ms tick interval for smooth updates                   │
│  - Per-frame analog input processing                       │
│  - Curve processing (Power, Log, S-Curve, Linear)         │
│  - Mouse/scroll output calculation                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Wooting SDK Integration Layer (wooting_sdk.rs)            │
│  - Safe FFI wrapper around C library                       │
│  - Singleton initialization pattern                        │
│  - Platform-specific DLL loading                           │
│  - Error handling & graceful degradation                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Native Libraries                                           │
│  - wooting_analog_sdk.dll (Analog value acquisition)       │
│  - enigo (Cross-platform mouse control)                    │
│  - rdev (Mouse button simulation)                          │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **Async Task-Based Loop**: Each mouse emulation session runs in a dedicated Tokio task with 10ms ticks for smooth, frame-like updates without blocking the main thread.

2. **Session Management**: Uses UUID-based session tracking to support multiple concurrent macros with independent configurations and lifecycle management.

3. **Curve Processing**: Supports four mathematical curve types (Power, Logarithmic, S-Curve, Linear) applied to analog input to create natural mouse movement acceleration curves.

4. **Safe FFI Wrapper**: The Wooting SDK integration wraps unsafe C FFI calls in a safe Rust interface with graceful error handling and lazy initialization.

5. **Configurable Sensitivity**: Separate sensitivity controls for movement and scrolling, plus Y-axis adjustment for ergonomic tuning.

---

## 🔧 Wooting SDK Setup

### Prerequisites

The mouse emulation feature requires the Wooting Analog SDK C library. Setup varies by platform.

### Windows Setup

#### 1. Obtain the SDK
- Download from: [Wooting Developer Portal](https://developer.wooting.io/)
- Or check your Wooting keyboard installation
- Default location: `C:\Program Files\Wooting\SDK\`
- Required file: `wooting_analog_sdk.dll` or `wooting_analog_sdk.lib`

#### 2. Configure Build Environment

**Option A: Cargo Configuration** (Recommended)

Create `wooting-macro-backend/.cargo/config.toml`:

```toml
[build]
rustflags = ["-l", "dylib=wooting_analog_sdk", "-L", "C:\\Program Files\\Wooting\\SDK\\lib"]
```

**Option B: Environment Variable**

```powershell
$env:RUSTFLAGS = "-l dylib=wooting_analog_sdk -L C:\Program Files\Wooting\SDK\lib"
cargo build
```

#### 3. Runtime Configuration
Ensure `wooting_analog_sdk.dll` is accessible at runtime by placing it in:
- System PATH (preferred)
- Application directory
- Current working directory

### Linux Setup

#### 1. Obtain the SDK
- Contact Wooting support or check your keyboard driver distribution
- Typical locations: `/usr/lib/` or `/usr/local/lib/`
- Required file: `libwooting_analog_sdk.so`

#### 2. Install the SDK
```bash
# Manual installation
sudo cp libwooting_analog_sdk.so /usr/local/lib/
sudo ldconfig

# Or via package manager (if available)
sudo apt-get install wooting-sdk  # Ubuntu/Debian
sudo pacman -S wooting-sdk        # Arch Linux
```

#### 3. Configure Build Environment
```bash
export RUSTFLAGS="-l dylib=wooting_analog_sdk -L /usr/local/lib"
export LD_LIBRARY_PATH="/usr/local/lib:$LD_LIBRARY_PATH"
cd wooting-macro-backend
cargo build
```

### macOS Setup

#### 1. Obtain the SDK
- Contact Wooting or check Homebrew: `brew search wooting`
- Default location: `/usr/local/lib/`
- Required file: `libwooting_analog_sdk.dylib`

#### 2. Install via Homebrew
```bash
brew install wooting-sdk
```

Or manual installation:
```bash
sudo cp libwooting_analog_sdk.dylib /usr/local/lib/
sudo chmod 755 /usr/local/lib/libwooting_analog_sdk.dylib
```

#### 3. Configure Build Environment
```bash
export RUSTFLAGS="-l dylib=wooting_analog_sdk -L /usr/local/lib"
export DYLD_LIBRARY_PATH="/usr/local/lib:$DYLD_LIBRARY_PATH"
cd wooting-macro-backend
cargo build
```

### Verifying SDK Installation

```bash
# Test library visibility
# Linux/macOS
ldconfig -p | grep wooting_analog_sdk
find /usr -name "*wooting*" 2>/dev/null

# Windows
where wooting_analog_sdk.dll

# Test build with SDK linked
cd wooting-macro-backend
cargo build 2>&1 | grep -i "wooting\|linking"
```

### Troubleshooting Common Issues

| Error | Cause | Solution |
|-------|-------|----------|
| `linking with 'cc' failed` | SDK library not found | Verify `RUSTFLAGS` and library path are set correctly |
| `cannot find -lwooting_analog_sdk` | Library name incorrect | Verify actual filename (libwooting_analog_sdk.so, etc.) |
| `error while loading shared libraries` | DLL found at compile time but not runtime | Add library directory to `LD_LIBRARY_PATH` or `DYLD_LIBRARY_PATH` |
| SDK initialization returns error code < 0 | SDK incompatible or device not connected | Verify Wooting keyboard is connected; update SDK to latest |

---

## 📦 Implementation Details

### Backend Modules (Rust)

#### `mouse_emulation.rs` (~458 lines)
**Location**: `wooting-macro-backend/src/plugin/mouse_emulation.rs`

**Core Structures**:
```rust
pub enum MouseEmulationAction {
    Start { config: MouseEmulationConfig },
    Stop { session_id: String },
}

pub struct MouseEmulationConfig {
    pub sensitivity_movement: f32,      // Default: 5.0
    pub sensitivity_scroll: f32,        // Default: 3.0
    pub y_sensitivity_adjustment: f32,  // Default: 0.0 (range: 0.0-1.0)
    pub curve_type: String,             // "Power", "Log", "S-Curve", "Linear"
    pub curve_factor: f32,              // Default: 1.5 (curve steepness)
    pub activation_point: f32,          // Default: 0.1 (trigger threshold)
    pub maximum_actuation: f32,         // Default: 1.0 (max analog value)
}
```

**Key Features**:
- Async task-based execution with 10ms update interval
- Session-based lifecycle management (UUID tracking)
- Multi-directional movement (up/down/left/right keys)
- Vertical and horizontal scrolling support
- Four curve types for different acceleration profiles
- Graceful shutdown with 50ms grace period
- Per-frame analog value reading and processing

**Data Flow**:
1. Receive `MouseEmulationAction::Start` with configuration
2. Spawn async task for this session
3. Each iteration (10ms):
   - Read analog values from Wooting SDK for all keys
   - Apply activation threshold check (skip if below threshold)
   - Process through selected curve function
   - Calculate pixel deltas based on sensitivity
   - Execute mouse movement/scroll via enigo
4. On `Stop`: Signal task to exit and clean up resources

#### `wooting_sdk.rs` (~161 lines)
**Location**: `wooting-macro-backend/src/plugin/wooting_sdk.rs`

**Responsibilities**:
- Safe FFI bindings to `wooting_analog_sdk.dll` (Windows) or `.so`/`.dylib` (Linux/macOS)
- Singleton pattern using `once_cell` for lazy initialization
- Platform-aware DLL loading with fallback paths
- Safe wrapper functions around unsafe C library calls
- Error handling for SDK failures

**Key Functions**:
- `wooting_analog_initialise()` - Initialize SDK
- `wooting_analog_read()` - Read analog value for a key
- `wooting_analog_deinit()` - Cleanup on shutdown
- `wooting_analog_get_version()` - Version query for diagnostics

#### `mouse.rs` (~78 lines)
**Location**: `wooting-macro-backend/src/plugin/mouse.rs`

**Components**:
- `MouseAction` enum for button press/release operations
- `MouseButton` enum supporting Left, Right, Middle, Mouse4, Mouse5
- Cross-platform implementation via `rdev` crate

### Frontend Components (React/TypeScript)

#### `MouseEmulationView.tsx` (Main Component)
**Location**: `src/components/mouseEmulation/`

**Features**:
- Tabbed interface: Settings, Curves, Manual
- Comprehensive 6-section Manual/Wiki:
  1. How It Works - Feature conceptual overview
  2. Getting Started - 4-step setup guide
  3. Key Mapping - Available key types and selection
  4. Understanding Settings - Detailed slider explanations
  5. Understanding Curves - Curve type behaviors
  6. Pro Tips - Practical usage recommendations

#### `GeneralSettings.tsx`
**Purpose**: Configure analog-to-mouse conversion parameters

**Controls**:
- 6 sliders for sensitivity and curve configuration
- Real-time value updates with visual feedback
- Default values applied on macro creation
- Range validation and bounds checking

**Parameters**:
- Movement Sensitivity (1.0-20.0)
- Scroll Sensitivity (1.0-20.0)
- Y-Axis Adjustment (0.0-1.0)
- Curve Type (selector)
- Curve Factor (0.1-5.0)
- Activation Point (0.0-1.0)

#### `KeyMapping.tsx`
**Purpose**: Visual key selector for mouse emulation triggers

**Features**:
- Modal with 70+ available keys
- Organized categories: Letters, Numbers, F1-F24, Navigation, Special
- Wooting function layer support (F13-F24 for extra keys)
- Click-to-select interface
- Visual feedback on selection

#### `CurveVisualization.tsx`
**Purpose**: Real-time visualization of curve processing

**Features**:
- SVG-based interactive curve graph
- Grid lines and axis labels
- Orange dashed line marking activation point
- Dot markers along curve path
- Responsive updates as sliders change
- Helps users understand curve behavior

---

## 🔧 Dependencies

### Backend (Rust)

| Crate | Version | Purpose | Notes |
|-------|---------|---------|-------|
| `tokio` | 1.36 | Async runtime | Task scheduling for emulation loop |
| `enigo` | 0.2 | Mouse control | Cross-platform mouse movement |
| `wooting_analog_sdk` | via DLL | SDK bindings | FFI to Wooting analog library |
| `uuid` | 1.6 | Session tracking | UUID generation for session IDs |
| `once_cell` | 1.19 | Lazy statics | SDK singleton initialization |
| `libloading` | 0.8 | Dynamic loading | Runtime DLL loading for flexibility |
| `serde`/`serde_json` | 1.0 | Serialization | Config serialization from IPC |
| `rdev` | - | Input simulation | Mouse button pressing |

### Frontend (React/TypeScript)

| Package | Version | Purpose |
|---------|---------|---------|
| `@chakra-ui/react` | 2.8.2 | UI components |
| `framer-motion` | latest | Animation framework |
| `react` | 18.2.0 | UI library |

---

## 🎮 Configuration Reference

### Default Settings

All values below are sensible defaults for typical gaming/productivity use:

```rust
sensitivity_movement: 5.0         // Pixels per analog unit
sensitivity_scroll: 3.0           // Scroll units per analog unit
y_sensitivity_adjustment: 0.0     // Y-axis reduction (0.0-1.0)
curve_type: "Power"               // Mathematical curve type
curve_factor: 1.5                 // Curve steepness multiplier
activation_point: 0.1             // Trigger threshold (0.0-1.0)
maximum_actuation: 1.0            // Max analog value (0.0-1.0)
```

### Curve Types Explained

- **Power**: Non-linear acceleration with steep endpoints. Good for precise control at low actuation.
- **Logarithmic**: Smooth ramp-up. Excellent for precise control across the full range.
- **S-Curve**: Smooth at start/end with faster middle region. Traditional gaming curve.
- **Linear**: Direct 1:1 proportional mapping. Most predictable but less natural.

---

## 🔄 Execution Flow

### Start: User Enables Mouse Emulation

```
1. Frontend: User configures macro with mouse emulation enabled
2. Frontend: Sends MouseEmulationAction::Start { config } to backend
3. Backend: Receives action through IPC layer
4. Backend: Spawns new async task with session UUID
5. Task: Starts 10ms loop immediately
```

### Per-Frame Loop (10ms tick)

```
1. Read analog values from Wooting SDK for each configured key
2. For each key:
   a. Check if analog value >= activation_point
   b. If below threshold: skip this key
   c. If above threshold:
      - Normalize value to 0.0-1.0 range
      - Apply curve function (Power/Log/S-Curve/Linear)
      - Multiply by sensitivity parameter
      - Add to movement accumulator
3. Execute accumulated mouse movement via enigo
4. Clear accumulator
5. Sleep 10ms, repeat from step 1
```

### Stop: User Disables or Deletes Macro

```
1. Frontend: Sends MouseEmulationAction::Stop { session_id }
2. Backend: Finds task for matching session_id
3. Backend: Signals task to exit gracefully
4. Task: Completes current iteration and exits
5. Backend: Waits 50ms grace period for pending operations
6. Backend: Removes session from tracking map
7. Resources cleaned up
```

---

## ✅ Testing & Code Quality

### Compilation Status
- ✅ No compilation errors
- ✅ No compiler warnings
- ✅ Clean build output

### Code Quality Checks
- ✅ Consistent code style throughout
- ✅ Comprehensive inline documentation (/// doc comments)
- ✅ All unused code warnings resolved
- ✅ Proper error handling in critical paths
- ✅ Safe FFI wrapper around unsafe Wooting SDK calls

### Manual Testing Checklist

**Functionality**:
- [ ] Mouse movement works in all 4 directions
- [ ] Scrolling works (vertical and horizontal)
- [ ] Curve visualization updates in real-time
- [ ] Sensitivity sliders affect movement proportionally
- [ ] Activation point threshold works correctly
- [ ] Y-axis adjustment reduces vertical movement

**Configuration**:
- [ ] All 4 curve types produce expected curves
- [ ] Default values are applied on macro creation
- [ ] Settings persist when macro is saved
- [ ] Key mapping modal displays all 70+ keys

**Edge Cases**:
- [ ] Multiple macros can run concurrently
- [ ] Stopping macro releases mouse control cleanly
- [ ] Rapid enable/disable doesn't cause crashes
- [ ] Works with different Wooting keyboard models

---

## 📝 Code Organization

### Backend File Structure
```
wooting-macro-backend/src/plugin/
├── mouse_emulation.rs    (458 lines) - Main plugin
├── wooting_sdk.rs        (161 lines) - SDK integration
├── mouse.rs              (78 lines)  - Mouse actions
└── ...other plugins
```

### Frontend File Structure
```
src/components/mouseEmulation/
├── MouseEmulationView.tsx         - Main component
├── GeneralSettings.tsx            - Configuration sliders
├── KeyMapping.tsx                 - Key selector
└── CurveVisualization.tsx         - Curve graph
```

---

## ⚠️ Known Limitations & Future Work

### Current Limitations
1. **Platform Support**: Windows-only at this time (DLL path hardcoded for Windows)
2. **SDK Requirement**: Must have Wooting Analog SDK installed for compilation
3. **Sequential Execution**: Multiple macros execute sequentially, not in parallel

### Planned Enhancements
- [ ] Linux/macOS support with platform-specific mouse libraries
- [ ] Parallel session execution for better concurrent macro performance
- [ ] Advanced preset profiles for different use cases
- [ ] Mouse acceleration algorithms
- [ ] Dead zone configuration
- [ ] Per-key customization options
- [ ] Macro recording from analog input

---

## 🎯 Future SDK Setup Improvements

The current SDK setup requires manual configuration, which creates friction for end users. To improve the user experience, we propose the following enhancements (prioritized by implementation phase):

### Phase 1: Smart Error Handling & Documentation
- [ ] Display contextual error messages when SDK initialization fails
- [ ] Direct users to platform-specific setup guides with one-click links
- [ ] Create simple setup scripts (PowerShell for Windows, Bash for Linux/macOS)
- [ ] Improve inline documentation in REVIEW_DOCUMENTATION.md

### Phase 2: User-Facing Setup Tools
- [ ] Add SDK detection on app startup
- [ ] Implement setup wizard in Settings UI with step-by-step instructions
- [ ] Add "Auto-Download SDK" button that fetches correct version for platform
- [ ] Graceful feature degradation (mouse emulation disabled if SDK unavailable)
- [ ] Validation test button to verify SDK installation works

### Phase 3: Seamless Integration
- [ ] Bundle SDK binaries with installer (Windows/Linux/macOS)
- [ ] Auto-extract SDK to standard location during installation
- [ ] Zero-configuration experience for end users
- [ ] Optional feature flag to exclude SDK requirement for minimal installs

### Phase 4: Advanced Solutions
- [ ] Pre-built releases with SDK already compiled and bundled
- [ ] Docker image with full environment pre-configured
- [ ] Automatic SDK updates through app update mechanism

**Key Principle**: Move from "developers configure environment" to "app detects & handles SDK automatically"

---

## 📞 Support & Questions

For questions about specific implementation details:
- FFI/SDK integration: See `wooting_sdk.rs` inline documentation
- Async/task design: See `mouse_emulation.rs` loop implementation
- Frontend components: See individual `.tsx` file comments
- Configuration options: See `MouseEmulationConfig` struct

All code includes comprehensive inline documentation with `///` doc comments explaining purpose and behavior.
