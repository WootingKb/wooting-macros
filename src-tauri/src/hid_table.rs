use std::collections::HashMap;
use std::hash::Hash;

use lazy_static::lazy_static;
use rdev::Key;

lazy_static! {
#[derive(Debug, PartialEq, Hash, std::cmp::Eq)]
pub static ref SCANCODE_TO_RDEV: HashMap<u32, rdev::Key> = {
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

// lazy_static! {
// #[derive(Debug, PartialEq, Hash, std::cmp::Eq)]
// pub static ref SCANCODE_TO_HID: HashMap<rdev::Key, u32> = {
//     let mut scancode: HashMap<rdev::Key, u32> = HashMap::new();
//         scancode.insert(rdev::Key::KeyA, 0x04); //US_A
//         scancode.insert(rdev::Key::KeyB, 0x05); //US_B
//         scancode.insert(rdev::Key::KeyC, 0x06); //US_C
//         scancode.insert(rdev::Key::KeyD, 0x07); //US_D
//
//         scancode.insert(rdev::Key::KeyE, 0x08); //US_E
//         scancode.insert(rdev::Key::KeyF, 0x09); //US_F
//         scancode.insert(rdev::Key::KeyG, 0x0a); //US_G
//         scancode.insert(rdev::Key::KeyH, 0x0b); //US_H
//         scancode.insert(rdev::Key::KeyI, 0x0c); //US_I
//         scancode.insert(rdev::Key::KeyJ, 0x0d); //US_J
//         scancode.insert(rdev::Key::KeyK, 0x0e); //US_K
//         scancode.insert(rdev::Key::KeyL, 0x0f); //US_L
//
//         scancode.insert(rdev::Key::KeyM, 0x10); //US_M
//         scancode.insert(rdev::Key::KeyN, 0x11); //US_N
//         scancode.insert(rdev::Key::KeyO, 0x12); //US_O
//         scancode.insert(rdev::Key::KeyP, 0x13); //US_P
//         scancode.insert(rdev::Key::KeyQ, 0x14); //US_Q
//         scancode.insert(rdev::Key::KeyR, 0x15); //US_R
//         scancode.insert(rdev::Key::KeyS, 0x16); //US_S
//         scancode.insert(rdev::Key::KeyT, 0x17); //US_T
//
//         scancode.insert(rdev::Key::KeyU, 0x18); //US_U
//         scancode.insert(rdev::Key::KeyV, 0x19); //US_V
//         scancode.insert(rdev::Key::KeyW, 0x1a); //US_W
//         scancode.insert(rdev::Key::KeyX, 0x1b); //US_X
//         scancode.insert(rdev::Key::KeyY, 0x1c); //US_Y
//         scancode.insert(rdev::Key::KeyZ, 0x1d); //US_Z
//         scancode.insert(rdev::Key::Num1, 0x1e); //DIGIT1
//         scancode.insert(rdev::Key::Num2, 0x1f); //DIGIT2
//
//         scancode.insert(rdev::Key::Num3, 0x20); //DIGIT3
//         scancode.insert(rdev::Key::Num4, 0x21); //DIGIT4
//         scancode.insert(rdev::Key::Num5, 0x22); //DIGIT5
//         scancode.insert(rdev::Key::Num6, 0x23); //DIGIT6
//         scancode.insert(rdev::Key::Num7, 0x24); //DIGIT7
//         scancode.insert(rdev::Key::Num8, 0x25); //DIGIT8
//         scancode.insert(rdev::Key::Num9, 0x26); //DIGIT9
//         scancode.insert(rdev::Key::Num0, 0x27); //DIGIT0
//
//         scancode.insert(rdev::Key::Return, 0x28); //ENTER
//         scancode.insert(rdev::Key::Escape, 0x29); //ESCAPE
//         scancode.insert(rdev::Key::Backspace, 0x2a); //BACKSPACE
//         scancode.insert(rdev::Key::Tab, 0x2b); //TAB
//         scancode.insert(rdev::Key::Space, 0x2c); //SPACE
//         scancode.insert(rdev::Key::Minus, 0x2d); //MINUS
//         scancode.insert(rdev::Key::Equal, 0x2e); //EQUAL
//         scancode.insert(rdev::Key::LeftBracket, 0x2f); //BRACKET_LEFT
//
//         scancode.insert(rdev::Key::RightBracket, 0x30); //BRACKET_RIGHT
//         scancode.insert(rdev::Key::BackSlash, 0x31); //BACKSLASH
//
//         //scancode.insert(0x32, 0x0000); //INTL_HASH
//
//         scancode.insert(rdev::Key::SemiColon, 0x33); //SEMICOLON
//         scancode.insert(rdev::Key::Quote, 0x34); //QUOTE
//         scancode.insert(rdev::Key::BackQuote, 0x35); //BACKQUOTE
//         scancode.insert(rdev::Key::Comma, 0x36); //COMMA
//         scancode.insert(rdev::Key::Dot, 0x37); //PERIOD
//
//         scancode.insert( rdev::Key::Slash, 0x38); //SLASH
//         scancode.insert( rdev::Key::CapsLock, 0x39); //CAPS_LOCK
//         scancode.insert( rdev::Key::F1, 0x3a); //F1
//         scancode.insert( rdev::Key::F2, 0x3b); //F2
//         scancode.insert( rdev::Key::F3, 0x3c); //F3
//         scancode.insert( rdev::Key::F4, 0x3d); //F4
//         scancode.insert( rdev::Key::F5, 0x3e); //F5
//         scancode.insert( rdev::Key::F6, 0x3f); //F6
//
//         scancode.insert(rdev::Key::F7, 0x40); //F7
//         scancode.insert(rdev::Key::F8, 0x41); //F8
//         scancode.insert(rdev::Key::F9, 0x42); //F9
//         scancode.insert(rdev::Key::F10, 0x43); //F10
//         scancode.insert(rdev::Key::F11, 0x44); //F11
//         scancode.insert(rdev::Key::F12, 0x45); //F12
//         scancode.insert(rdev::Key::PrintScreen, 0x46); //PRINT_SCREEN
//         scancode.insert(rdev::Key::ScrollLock, 0x47); //SCROLL_LOCK
//
//         scancode.insert(rdev::Key::Pause, 0x48); //PAUSE
//         scancode.insert(rdev::Key::Insert, 0x49); //INSERT
//         scancode.insert(rdev::Key::Home, 0x4a); //HOME
//         scancode.insert(rdev::Key::PageUp, 0x4b); //PAGE_UP
//         scancode.insert(rdev::Key::Delete, 0x4c); //DEL
//         scancode.insert(rdev::Key::End, 0x4d); //END
//         scancode.insert(rdev::Key::PageDown, 0x4e); //PAGE_DOWN
//
//         scancode.insert(rdev::Key::RightArrow, 0x4f); //ARROW_RIGHT
//         scancode.insert(rdev::Key::LeftArrow, 0x50); //ARROW_LEFT
//         scancode.insert(rdev::Key::DownArrow, 0x51); //ARROW_DOWN
//         scancode.insert(rdev::Key::UpArrow, 0x52); //ARROW_UP
//
//         scancode.insert(rdev::Key::NumLock, 0x53); //NUM_LOCK
//         scancode.insert(rdev::Key::KpDivide, 0x54); //NUMPAD_DIVIDE
//         scancode.insert(rdev::Key::KpMultiply, 0x55); //NUMPAD_MULTIPLY
//         scancode.insert(rdev::Key::KpMinus, 0x56); //NUMPAD_SUBTRACT
//         scancode.insert(rdev::Key::KpPlus, 0x57); //NUMPAD_ADD
//         scancode.insert(rdev::Key::KpReturn, 0x58); //NUMPAD_ENTER
//
//         scancode.insert(rdev::Key::Kp1, 0x59); //NUMPAD1
//         scancode.insert(rdev::Key::Kp2, 0x5a); //NUMPAD2
//         scancode.insert(rdev::Key::Kp3, 0x5b); //NUMPAD3
//         scancode.insert(rdev::Key::Kp4, 0x5c); //NUMPAD4
//         scancode.insert(rdev::Key::Kp5, 0x5d); //NUMPAD5
//         scancode.insert(rdev::Key::Kp6, 0x5e); //NUMPAD6
//         scancode.insert(rdev::Key::Kp7, 0x5f); //NUMPAD7
//         scancode.insert(rdev::Key::Kp8, 0x60); //NUMPAD8
//         scancode.insert(rdev::Key::Kp9, 0x61); //NUMPAD9
//         scancode.insert(rdev::Key::Kp0, 0x62); //NUMPAD0
//         scancode.insert(rdev::Key::Dot, 0x63); //NUMPAD_DECIMAL
//
//         scancode.insert(rdev::Key::IntlBackslash, 0x64); //INTL_BACKSLASH
//         scancode.insert(rdev::Key::Function, 0x65); //CONTEXT_MENU
//
//         // scancode.insert(0x67, rdev::Key::Key); //NUMPAD_EQUAL
//
//         // scancode.insert(0x68, rdev::Key::Key); //F13
//         // scancode.insert(0x69, rdev::Key::Key); //F14
//         // scancode.insert(0x6a, rdev::Key::Key); //F15
//         // scancode.insert(0x6b, rdev::Key::Key); //F16
//         // scancode.insert(0x6c, rdev::Key::Key); //F17
//         // scancode.insert(0x6d, rdev::Key::Key); //F18
//         // scancode.insert(0x6e, rdev::Key::Key); //F19
//         // scancode.insert(0x6f, rdev::Key::Key); //F20
//         //
//         // scancode.insert(0x70, rdev::Key::Key); //F21
//         // scancode.insert(0x71, rdev::Key::Key); //F22
//         // scancode.insert(0x72, rdev::Key::Key); //F23
//         //
//         // scancode.insert(0x73, rdev::Key::Key); //F24
//         // scancode.insert(0x74, rdev::Key::Key); //OPEN
//         //
//         // scancode.insert(0x75, rdev::Key::Key); //HELP
//         //
//         // scancode.insert(0x66, rdev::Key::Key); //POWER
//         // scancode.insert(0x77, 0x0000); //SELECT
//         //
//         // scancode.insert(0x79, rdev::Key::Key); //AGAIN
//         // scancode.insert(0x7a, rdev::Key::Key); //UNDO
//         // scancode.insert(0x7b, rdev::Key::Key); //CUT
//         // scancode.insert(0x7c, rdev::Key::Key); //COPY
//         // scancode.insert(0x7d, rdev::Key::Key); //PASTE
//         // scancode.insert(0x7e, rdev::Key::Key); //FIND
//         // scancode.insert(0x7f, rdev::Key::Key); //VOLUME_MUTE
//         //
//         // scancode.insert(0x80, rdev::Key::Key); //VOLUME_UP
//         // scancode.insert(0x81, rdev::Key::Key); //VOLUME_DOWN
//         // scancode.insert(0x85, rdev::Key::Key); //NUMPAD_COMMA
//         //
//         // scancode.insert(0x87, rdev::Key::Key); //INTL_RO
//         // scancode.insert(0x88, rdev::Key::Key); //KANA_MODE
//         // scancode.insert(0x89, rdev::Key::Key); //INTL_YEN
//         // scancode.insert(0x8a, rdev::Key::Key); //CONVERT
//         // scancode.insert(0x8b, rdev::Key::Key); //NON_CONVERT
//         // scancode.insert(0x90, rdev::Key::Key); //LANG1
//         // scancode.insert(0x91, rdev::Key::Key); //LANG2
//         // scancode.insert(0x92, rdev::Key::Key); //LANG3
//         // scancode.insert(0x93, rdev::Key::Key); //LANG4
//
//         scancode.insert(rdev::Key::ControlLeft, 0xe0); //CONTROL_LEFT
//         scancode.insert(rdev::Key::ShiftLeft, 0xe1); //SHIFT_LEFT
//         scancode.insert(rdev::Key::Alt, 0xe2); //ALT_LEFT
//         scancode.insert(rdev::Key::MetaLeft, 0xe3); //META_LEFT
//         scancode.insert(rdev::Key::ControlRight, 0xe4); //CONTROL_RIGHT
//         scancode.insert(rdev::Key::ShiftRight, 0xe5); //SHIFT_RIGHT
//         scancode.insert(rdev::Key::Alt, 0xe6); //ALT_RIGHT
//         scancode.insert(rdev::Key::MetaRight, 0xe7); //META_RIGHT
//
//
//
//
//     scancode
// };
//
// }
