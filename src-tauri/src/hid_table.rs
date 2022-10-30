use std::collections::HashMap;
use std::hash::Hash;

use lazy_static::lazy_static;
use rdev::Key;

lazy_static! {
#[derive(Debug, PartialEq)]
pub static ref SCANCODE_MAP: HashMap<u32, rdev::Key> = {
    let mut scancode: HashMap<u32, rdev::Key> = HashMap::new();
        scancode.insert(0x04, rdev::Key::KeyA); //US_A
        scancode.insert(0x05, rdev::Key::KeyB); //US_B
        scancode.insert(0x06, rdev::Key::KeyC); //US_C
        scancode.insert(0x07, rdev::Key::KeyD); //US_D

        scancode.insert(0x08, rdev::Key::KeyE); //US_E
        scancode.insert(0x09, rdev::Key::KeyF); //US_F
        scancode.insert(0x0a, rdev::Key::KeyG); //US_G
        scancode.insert(0x0b, rdev::Key::KeyH); //US_H
        scancode.insert(0x0c, rdev::Key::KeyI); //US_I
        scancode.insert(0x0d, rdev::Key::KeyJ); //US_J
        scancode.insert(0x0e, rdev::Key::KeyK); //US_K
        scancode.insert(0x0f, rdev::Key::KeyL); //US_L

        scancode.insert(0x10, rdev::Key::KeyM); //US_M
        scancode.insert(0x11, rdev::Key::KeyN); //US_N
        scancode.insert(0x12, rdev::Key::KeyO); //US_O
        scancode.insert(0x13, rdev::Key::KeyP); //US_P
        scancode.insert(0x14, rdev::Key::KeyQ); //US_Q
        scancode.insert(0x15, rdev::Key::KeyR); //US_R
        scancode.insert(0x16, rdev::Key::KeyS); //US_S
        scancode.insert(0x17, rdev::Key::KeyT); //US_T

        scancode.insert(0x18, rdev::Key::KeyU); //US_U
        scancode.insert(0x19, rdev::Key::KeyV); //US_V
        scancode.insert(0x1a, rdev::Key::KeyW); //US_W
        scancode.insert(0x1b, rdev::Key::KeyX); //US_X
        scancode.insert(0x1c, rdev::Key::KeyY); //US_Y
        scancode.insert(0x1d, rdev::Key::KeyZ); //US_Z
        scancode.insert(0x1e, rdev::Key::Num1); //DIGIT1
        scancode.insert(0x1f, rdev::Key::Num2); //DIGIT2

        scancode.insert(0x20, rdev::Key::Num3); //DIGIT3
        scancode.insert(0x21, rdev::Key::Num4); //DIGIT4
        scancode.insert(0x22, rdev::Key::Num5); //DIGIT5
        scancode.insert(0x23, rdev::Key::Num6); //DIGIT6
        scancode.insert(0x24, rdev::Key::Num7); //DIGIT7
        scancode.insert(0x25, rdev::Key::Num8); //DIGIT8
        scancode.insert(0x26, rdev::Key::Num9); //DIGIT9
        scancode.insert(0x27, rdev::Key::Num0); //DIGIT0

        scancode.insert(0x28, rdev::Key::Return); //ENTER
        scancode.insert(0x29, rdev::Key::Escape); //ESCAPE
        scancode.insert(0x2a, rdev::Key::Backspace); //BACKSPACE
        scancode.insert(0x2b, rdev::Key::Tab); //TAB
        scancode.insert(0x2c, rdev::Key::Space); //SPACE
        scancode.insert(0x2d, rdev::Key::Minus); //MINUS
        scancode.insert(0x2e, rdev::Key::Equal); //EQUAL
        scancode.insert(0x2f, rdev::Key::LeftBracket); //BRACKET_LEFT

        scancode.insert(0x30, rdev::Key::RightBracket); //BRACKET_RIGHT
        scancode.insert(0x31, rdev::Key::BackSlash); //BACKSLASH

        //scancode.insert(0x32, 0x0000); //INTL_HASH

        scancode.insert(0x33, rdev::Key::SemiColon); //SEMICOLON
        scancode.insert(0x34, rdev::Key::Quote); //QUOTE
        scancode.insert(0x35, rdev::Key::BackQuote); //BACKQUOTE
        scancode.insert(0x36, rdev::Key::Comma); //COMMA
        scancode.insert(0x37, rdev::Key::Dot); //PERIOD

        scancode.insert(0x38, rdev::Key::Slash); //SLASH
        scancode.insert(0x39, rdev::Key::CapsLock); //CAPS_LOCK
        scancode.insert(0x3a, rdev::Key::F1); //F1
        scancode.insert(0x3b, rdev::Key::F2); //F2
        scancode.insert(0x3c, rdev::Key::F3); //F3
        scancode.insert(0x3d, rdev::Key::F4); //F4
        scancode.insert(0x3e, rdev::Key::F5); //F5
        scancode.insert(0x3f, rdev::Key::F6); //F6

        scancode.insert(0x40, rdev::Key::F7); //F7
        scancode.insert(0x41, rdev::Key::F8); //F8
        scancode.insert(0x42, rdev::Key::F9); //F9
        scancode.insert(0x43, rdev::Key::F10); //F10
        scancode.insert(0x44, rdev::Key::F11); //F11
        scancode.insert(0x45, rdev::Key::F12); //F12
        scancode.insert(0x46, rdev::Key::PrintScreen); //PRINT_SCREEN
        scancode.insert(0x47, rdev::Key::ScrollLock); //SCROLL_LOCK

        scancode.insert(0x48, rdev::Key::Pause); //PAUSE
        scancode.insert(0x49, rdev::Key::Insert); //INSERT
        scancode.insert(0x4a, rdev::Key::Home); //HOME
        scancode.insert(0x4b, rdev::Key::PageUp); //PAGE_UP
        scancode.insert(0x4c, rdev::Key::Delete); //DEL
        scancode.insert(0x4d, rdev::Key::End); //END
        scancode.insert(0x4e, rdev::Key::PageDown); //PAGE_DOWN

        scancode.insert(0x4f, rdev::Key::RightArrow); //ARROW_RIGHT
        scancode.insert(0x50, rdev::Key::LeftArrow); //ARROW_LEFT
        scancode.insert(0x51, rdev::Key::DownArrow); //ARROW_DOWN
        scancode.insert(0x52, rdev::Key::UpArrow); //ARROW_UP

        scancode.insert(0x53, rdev::Key::NumLock); //NUM_LOCK
        scancode.insert(0x54, rdev::Key::KpDivide); //NUMPAD_DIVIDE
        scancode.insert(0x55, rdev::Key::KpMultiply); //NUMPAD_MULTIPLY
        scancode.insert(0x56, rdev::Key::KpMinus); //NUMPAD_SUBTRACT
        scancode.insert(0x57, rdev::Key::KpPlus); //NUMPAD_ADD
        scancode.insert(0x58, rdev::Key::KpReturn); //NUMPAD_ENTER

        scancode.insert(0x59, rdev::Key::Kp1); //NUMPAD1
        scancode.insert(0x5a, rdev::Key::Kp2); //NUMPAD2
        scancode.insert(0x5b, rdev::Key::Kp3); //NUMPAD3
        scancode.insert(0x5c, rdev::Key::Kp4); //NUMPAD4
        scancode.insert(0x5d, rdev::Key::Kp5); //NUMPAD5
        scancode.insert(0x5e, rdev::Key::Kp6); //NUMPAD6
        scancode.insert(0x5f, rdev::Key::Kp7); //NUMPAD7
        scancode.insert(0x60, rdev::Key::Kp8); //NUMPAD8
        scancode.insert(0x61, rdev::Key::Kp9); //NUMPAD9
        scancode.insert(0x62, rdev::Key::Kp0); //NUMPAD0
        scancode.insert(0x63, rdev::Key::Dot); //NUMPAD_DECIMAL

        scancode.insert(0x64, rdev::Key::IntlBackslash); //INTL_BACKSLASH
        scancode.insert(0x65, rdev::Key::Function); //CONTEXT_MENU

        // scancode.insert(0x67, rdev::Key::Key); //NUMPAD_EQUAL

        // scancode.insert(0x68, rdev::Key::Key); //F13
        // scancode.insert(0x69, rdev::Key::Key); //F14
        // scancode.insert(0x6a, rdev::Key::Key); //F15
        // scancode.insert(0x6b, rdev::Key::Key); //F16
        // scancode.insert(0x6c, rdev::Key::Key); //F17
        // scancode.insert(0x6d, rdev::Key::Key); //F18
        // scancode.insert(0x6e, rdev::Key::Key); //F19
        // scancode.insert(0x6f, rdev::Key::Key); //F20
        //
        // scancode.insert(0x70, rdev::Key::Key); //F21
        // scancode.insert(0x71, rdev::Key::Key); //F22
        // scancode.insert(0x72, rdev::Key::Key); //F23
        //
        // scancode.insert(0x73, rdev::Key::Key); //F24
        // scancode.insert(0x74, rdev::Key::Key); //OPEN
        //
        // scancode.insert(0x75, rdev::Key::Key); //HELP
        //
        // scancode.insert(0x66, rdev::Key::Key); //POWER
        // scancode.insert(0x77, 0x0000); //SELECT
        //
        // scancode.insert(0x79, rdev::Key::Key); //AGAIN
        // scancode.insert(0x7a, rdev::Key::Key); //UNDO
        // scancode.insert(0x7b, rdev::Key::Key); //CUT
        // scancode.insert(0x7c, rdev::Key::Key); //COPY
        // scancode.insert(0x7d, rdev::Key::Key); //PASTE
        // scancode.insert(0x7e, rdev::Key::Key); //FIND
        // scancode.insert(0x7f, rdev::Key::Key); //VOLUME_MUTE
        //
        // scancode.insert(0x80, rdev::Key::Key); //VOLUME_UP
        // scancode.insert(0x81, rdev::Key::Key); //VOLUME_DOWN
        // scancode.insert(0x85, rdev::Key::Key); //NUMPAD_COMMA
        //
        // scancode.insert(0x87, rdev::Key::Key); //INTL_RO
        // scancode.insert(0x88, rdev::Key::Key); //KANA_MODE
        // scancode.insert(0x89, rdev::Key::Key); //INTL_YEN
        // scancode.insert(0x8a, rdev::Key::Key); //CONVERT
        // scancode.insert(0x8b, rdev::Key::Key); //NON_CONVERT
        // scancode.insert(0x90, rdev::Key::Key); //LANG1
        // scancode.insert(0x91, rdev::Key::Key); //LANG2
        // scancode.insert(0x92, rdev::Key::Key); //LANG3
        // scancode.insert(0x93, rdev::Key::Key); //LANG4

        scancode.insert(0xe0, rdev::Key::ControlLeft); //CONTROL_LEFT
        scancode.insert(0xe1, rdev::Key::ShiftLeft); //SHIFT_LEFT
        scancode.insert(0xe2, rdev::Key::Alt); //ALT_LEFT
        scancode.insert(0xe3, rdev::Key::MetaLeft); //META_LEFT
        scancode.insert(0xe4, rdev::Key::ControlRight); //CONTROL_RIGHT
        scancode.insert(0xe5, rdev::Key::ShiftRight); //SHIFT_RIGHT
        scancode.insert(0xe6, rdev::Key::Alt); //ALT_RIGHT
        scancode.insert(0xe7, rdev::Key::MetaRight); //META_RIGHT




    scancode
};

}