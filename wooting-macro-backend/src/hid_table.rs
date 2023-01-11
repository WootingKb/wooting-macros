use std::collections::HashMap;
use std::hash::Hash;

use lazy_static::lazy_static;
use log::*;
use rdev::{Button, Key};

pub const MODIFIER_LIST_RDEV: [rdev::Key; 8] = [
    Key::AltGr,
    Key::Alt,
    Key::ShiftLeft,
    Key::ShiftRight,
    Key::ControlLeft,
    Key::ControlRight,
    Key::MetaLeft,
    Key::MetaRight,
];

lazy_static! {
#[derive(Debug, PartialEq, Hash, std::cmp::Eq)]
pub static ref BUTTON_TO_HID: HashMap<Button, u32> = {
    let mut scancode: HashMap<rdev::Button, u32> = HashMap::new();
        scancode.insert(Button::Left, 0x101);
        scancode.insert(Button::Right, 0x102);
        scancode.insert(Button::Middle, 0x103);
        scancode.insert(Button::Unknown(4), 0x104);
        scancode.insert(Button::Unknown(5), 0x105);
        scancode
};}

lazy_static! {
///Conversion from HID codes to the library backend enums.
#[derive(Debug, PartialEq, Hash, std::cmp::Eq)]
pub static ref SCANCODE_TO_RDEV: HashMap<u32, Key> = {
    let mut scancode: HashMap<u32, Key> = HashMap::new();
        scancode.insert(0x04, Key::KeyA); //US_A
        scancode.insert(0x05, Key::KeyB); //US_B
        scancode.insert(0x06, Key::KeyC); //US_C
        scancode.insert(0x07, Key::KeyD); //US_D

        scancode.insert(0x08, Key::KeyE); //US_E
        scancode.insert(0x09, Key::KeyF); //US_F
        scancode.insert(0x0a, Key::KeyG); //US_G
        scancode.insert(0x0b, Key::KeyH); //US_H
        scancode.insert(0x0c, Key::KeyI); //US_I
        scancode.insert(0x0d, Key::KeyJ); //US_J
        scancode.insert(0x0e, Key::KeyK); //US_K
        scancode.insert(0x0f, Key::KeyL); //US_L

        scancode.insert(0x10, Key::KeyM); //US_M
        scancode.insert(0x11, Key::KeyN); //US_N
        scancode.insert(0x12, Key::KeyO); //US_O
        scancode.insert(0x13, Key::KeyP); //US_P
        scancode.insert(0x14, Key::KeyQ); //US_Q
        scancode.insert(0x15, Key::KeyR); //US_R
        scancode.insert(0x16, Key::KeyS); //US_S
        scancode.insert(0x17, Key::KeyT); //US_T

        scancode.insert(0x18, Key::KeyU); //US_U
        scancode.insert(0x19, Key::KeyV); //US_V
        scancode.insert(0x1a, Key::KeyW); //US_W
        scancode.insert(0x1b, Key::KeyX); //US_X
        scancode.insert(0x1c, Key::KeyY); //US_Y
        scancode.insert(0x1d, Key::KeyZ); //US_Z
        scancode.insert(0x1e, Key::Num1); //DIGIT1
        scancode.insert(0x1f, Key::Num2); //DIGIT2

        scancode.insert(0x20, Key::Num3); //DIGIT3
        scancode.insert(0x21, Key::Num4); //DIGIT4
        scancode.insert(0x22, Key::Num5); //DIGIT5
        scancode.insert(0x23, Key::Num6); //DIGIT6
        scancode.insert(0x24, Key::Num7); //DIGIT7
        scancode.insert(0x25, Key::Num8); //DIGIT8
        scancode.insert(0x26, Key::Num9); //DIGIT9
        scancode.insert(0x27, Key::Num0); //DIGIT0

        scancode.insert(0x28, Key::Return); //ENTER
        scancode.insert(0x29, Key::Escape); //ESCAPE
        scancode.insert(0x2a, Key::Backspace); //BACKSPACE
        scancode.insert(0x2b, Key::Tab); //TAB
        scancode.insert(0x2c, Key::Space); //SPACE
        scancode.insert(0x2d, Key::Minus); //MINUS
        scancode.insert(0x2e, Key::Equal); //EQUAL
        scancode.insert(0x2f, Key::LeftBracket); //BRACKET_LEFT

        scancode.insert(0x30, Key::RightBracket); //BRACKET_RIGHT
        scancode.insert(0x31, Key::BackSlash); //BACKSLASH

        //scancode.insert(0x32, 0x0000); //INTL_HASH

        scancode.insert(0x33, Key::SemiColon); //SEMICOLON
        scancode.insert(0x34, Key::Quote); //QUOTE
        scancode.insert(0x35, Key::BackQuote); //BACKQUOTE
        scancode.insert(0x36, Key::Comma); //COMMA
        scancode.insert(0x37, Key::Dot); //PERIOD

        scancode.insert(0x38, Key::Slash); //SLASH
        scancode.insert(0x39, Key::CapsLock); //CAPS_LOCK
        scancode.insert(0x3a, Key::F1); //F1
        scancode.insert(0x3b, Key::F2); //F2
        scancode.insert(0x3c, Key::F3); //F3
        scancode.insert(0x3d, Key::F4); //F4
        scancode.insert(0x3e, Key::F5); //F5
        scancode.insert(0x3f, Key::F6); //F6

        scancode.insert(0x40, Key::F7); //F7
        scancode.insert(0x41, Key::F8); //F8
        scancode.insert(0x42, Key::F9); //F9
        scancode.insert(0x43, Key::F10); //F10
        scancode.insert(0x44, Key::F11); //F11
        scancode.insert(0x45, Key::F12); //F12


        #[cfg(target_os = "windows")]
        {
        scancode.insert(0x7f, Key::Unknown(173)); //VOLUME_MUTE
        scancode.insert(0x81, Key::Unknown(174)); //VOLUME_DOWN
        scancode.insert(0x80, Key::Unknown(175)); //VOLUME_UP

        scancode.insert(0x68, Key::Unknown(124)); //F13
        scancode.insert(0x69, Key::Unknown(125)); //F14
        scancode.insert(0x6a, Key::Unknown(126)); //F15
        scancode.insert(0x6b, Key::Unknown(127)); //F16

        scancode.insert(0x6c, Key::Unknown(128)); //F17
        scancode.insert(0x6d, Key::Unknown(129)); //F18
        scancode.insert(0x6e, Key::Unknown(130)); //F19
        scancode.insert(0x6f, Key::Unknown(131)); //F20

        scancode.insert(0x70, Key::Unknown(132)); //F21
        scancode.insert(0x71, Key::Unknown(133)); //F22
        scancode.insert(0x72, Key::Unknown(134)); //F23
        scancode.insert(0x73, Key::Unknown(135)); //F24
        }

        #[cfg(target_os = "linux")]
        {
        scancode.insert(0x7f, Key::Unknown(121)); //VOLUME_MUTE
        scancode.insert(0x81, Key::Unknown(122)); //VOLUME_DOWN
        scancode.insert(0x80, Key::Unknown(123)); //VOLUME_UP

        scancode.insert(0x68, Key::Unknown(191)); //F13
        scancode.insert(0x69, Key::Unknown(192)); //F14
        scancode.insert(0x6a, Key::Unknown(193)); //F15
        scancode.insert(0x6b, Key::Unknown(194)); //F16

        scancode.insert(0x6c, Key::Unknown(195)); //F17
        scancode.insert(0x6d, Key::Unknown(196)); //F18
        scancode.insert(0x6e, Key::Unknown(197)); //F19
        scancode.insert(0x6f, Key::Unknown(198)); //F20

        scancode.insert(0x70, Key::Unknown(199)); //F21
        scancode.insert(0x71, Key::Unknown(200)); //F22
        scancode.insert(0x72, Key::Unknown(201)); //F23
        scancode.insert(0x73, Key::Unknown(202)); //F24
        }

        scancode.insert(0x46, Key::PrintScreen); //PRINT_SCREEN
        scancode.insert(0x47, Key::ScrollLock); //SCROLL_LOCK

        scancode.insert(0x48, Key::Pause); //PAUSE
        scancode.insert(0x49, Key::Insert); //INSERT
        scancode.insert(0x4a, Key::Home); //HOME
        scancode.insert(0x4b, Key::PageUp); //PAGE_UP
        scancode.insert(0x4c, Key::Delete); //DEL
        scancode.insert(0x4d, Key::End); //END
        scancode.insert(0x4e, Key::PageDown); //PAGE_DOWN

        scancode.insert(0x4f, Key::RightArrow); //ARROW_RIGHT
        scancode.insert(0x50, Key::LeftArrow); //ARROW_LEFT
        scancode.insert(0x51, Key::DownArrow); //ARROW_DOWN
        scancode.insert(0x52, Key::UpArrow); //ARROW_UP

        scancode.insert(0x53, Key::NumLock); //NUM_LOCK
        scancode.insert(0x54, Key::KpDivide); //NUMPAD_DIVIDE
        scancode.insert(0x55, Key::KpMultiply); //NUMPAD_MULTIPLY
        scancode.insert(0x56, Key::KpMinus); //NUMPAD_SUBTRACT
        scancode.insert(0x57, Key::KpPlus); //NUMPAD_ADD
        scancode.insert(0x58, Key::KpReturn); //NUMPAD_ENTER

        scancode.insert(0x59, Key::Kp1); //NUMPAD1
        scancode.insert(0x5a, Key::Kp2); //NUMPAD2
        scancode.insert(0x5b, Key::Kp3); //NUMPAD3
        scancode.insert(0x5c, Key::Kp4); //NUMPAD4
        scancode.insert(0x5d, Key::Kp5); //NUMPAD5
        scancode.insert(0x5e, Key::Kp6); //NUMPAD6
        scancode.insert(0x5f, Key::Kp7); //NUMPAD7
        scancode.insert(0x60, Key::Kp8); //NUMPAD8
        scancode.insert(0x61, Key::Kp9); //NUMPAD9
        scancode.insert(0x62, Key::Kp0); //NUMPAD0
        scancode.insert(0x63, Key::Dot); //NUMPAD_DECIMAL

        scancode.insert(0x64, Key::IntlBackslash); //INTL_BACKSLASH
        scancode.insert(0x65, Key::Function); //CONTEXT_MENU

        // scancode.insert(0x67, Key::Key); //NUMPAD_EQUAL
        // scancode.insert(0x74, Key::Key); //OPEN
        //
        // scancode.insert(0x75, Key::Key); //HELP
        //
        // scancode.insert(0x66, Key::Key); //POWER
        // scancode.insert(0x77, 0x0000); //SELECT
        //
        // scancode.insert(0x79, Key::Key); //AGAIN
        // scancode.insert(0x7a, Key::Key); //UNDO
        // scancode.insert(0x7b, Key::Key); //CUT
        // scancode.insert(0x7c, Key::Key); //COPY
        // scancode.insert(0x7d, Key::Key); //PASTE
        // scancode.insert(0x7e, Key::Key); //FIND



        // scancode.insert(0x85, Key::Key); //NUMPAD_COMMA
        //
        // scancode.insert(0x87, Key::Key); //INTL_RO
        // scancode.insert(0x88, Key::Key); //KANA_MODE
        // scancode.insert(0x89, Key::Key); //INTL_YEN
        // scancode.insert(0x8a, Key::Key); //CONVERT
        // scancode.insert(0x8b, Key::Key); //NON_CONVERT
        // scancode.insert(0x90, Key::Key); //LANG1
        // scancode.insert(0x91, Key::Key); //LANG2
        // scancode.insert(0x92, Key::Key); //LANG3
        // scancode.insert(0x93, Key::Key); //LANG4

        scancode.insert(0xe0, Key::ControlLeft); //CONTROL_LEFT
        scancode.insert(0xe1, Key::ShiftLeft); //SHIFT_LEFT
        scancode.insert(0xe2, Key::Alt); //ALT_LEFT
        scancode.insert(0xe3, Key::MetaLeft); //META_LEFT
        scancode.insert(0xe4, Key::ControlRight); //CONTROL_RIGHT
        scancode.insert(0xe5, Key::ShiftRight); //SHIFT_RIGHT
        scancode.insert(0xe6, Key::Alt); //ALT_RIGHT
        scancode.insert(0xe7, Key::MetaRight); //META_RIGHT

    scancode
};

}

lazy_static! {
#[derive(Debug, PartialEq, Hash, std::cmp::Eq)]
pub static ref SCANCODE_TO_HID: HashMap<Key, u32> = {
    let mut scancode: HashMap<Key, u32> = HashMap::new();
        scancode.insert(Key::KeyA, 0x04); //US_A
        scancode.insert(Key::KeyB, 0x05); //US_B
        scancode.insert(Key::KeyC, 0x06); //US_C
        scancode.insert(Key::KeyD, 0x07); //US_D

        scancode.insert(Key::KeyE, 0x08); //US_E
        scancode.insert(Key::KeyF, 0x09); //US_F
        scancode.insert(Key::KeyG, 0x0a); //US_G
        scancode.insert(Key::KeyH, 0x0b); //US_H
        scancode.insert(Key::KeyI, 0x0c); //US_I
        scancode.insert(Key::KeyJ, 0x0d); //US_J
        scancode.insert(Key::KeyK, 0x0e); //US_K
        scancode.insert(Key::KeyL, 0x0f); //US_L

        scancode.insert(Key::KeyM, 0x10); //US_M
        scancode.insert(Key::KeyN, 0x11); //US_N
        scancode.insert(Key::KeyO, 0x12); //US_O
        scancode.insert(Key::KeyP, 0x13); //US_P
        scancode.insert(Key::KeyQ, 0x14); //US_Q
        scancode.insert(Key::KeyR, 0x15); //US_R
        scancode.insert(Key::KeyS, 0x16); //US_S
        scancode.insert(Key::KeyT, 0x17); //US_T

        scancode.insert(Key::KeyU, 0x18); //US_U
        scancode.insert(Key::KeyV, 0x19); //US_V
        scancode.insert(Key::KeyW, 0x1a); //US_W
        scancode.insert(Key::KeyX, 0x1b); //US_X
        scancode.insert(Key::KeyY, 0x1c); //US_Y
        scancode.insert(Key::KeyZ, 0x1d); //US_Z
        scancode.insert(Key::Num1, 0x1e); //DIGIT1
        scancode.insert(Key::Num2, 0x1f); //DIGIT2

        scancode.insert(Key::Num3, 0x20); //DIGIT3
        scancode.insert(Key::Num4, 0x21); //DIGIT4
        scancode.insert(Key::Num5, 0x22); //DIGIT5
        scancode.insert(Key::Num6, 0x23); //DIGIT6
        scancode.insert(Key::Num7, 0x24); //DIGIT7
        scancode.insert(Key::Num8, 0x25); //DIGIT8
        scancode.insert(Key::Num9, 0x26); //DIGIT9
        scancode.insert(Key::Num0, 0x27); //DIGIT0

        scancode.insert(Key::Return, 0x28); //ENTER
        scancode.insert(Key::Escape, 0x29); //ESCAPE
        scancode.insert(Key::Backspace, 0x2a); //BACKSPACE
        scancode.insert(Key::Tab, 0x2b); //TAB
        scancode.insert(Key::Space, 0x2c); //SPACE
        scancode.insert(Key::Minus, 0x2d); //MINUS
        scancode.insert(Key::Equal, 0x2e); //EQUAL
        scancode.insert(Key::LeftBracket, 0x2f); //BRACKET_LEFT

        scancode.insert(Key::RightBracket, 0x30); //BRACKET_RIGHT
        scancode.insert(Key::BackSlash, 0x31); //BACKSLASH

        //scancode.insert(0x32, 0x0000); //INTL_HASH

        scancode.insert(Key::SemiColon, 0x33); //SEMICOLON
        scancode.insert(Key::Quote, 0x34); //QUOTE
        scancode.insert(Key::BackQuote, 0x35); //BACKQUOTE
        scancode.insert(Key::Comma, 0x36); //COMMA
        scancode.insert(Key::Dot, 0x37); //PERIOD

        scancode.insert( Key::Slash, 0x38); //SLASH
        scancode.insert( Key::CapsLock, 0x39); //CAPS_LOCK
        scancode.insert( Key::F1, 0x3a); //F1
        scancode.insert( Key::F2, 0x3b); //F2
        scancode.insert( Key::F3, 0x3c); //F3
        scancode.insert( Key::F4, 0x3d); //F4
        scancode.insert( Key::F5, 0x3e); //F5
        scancode.insert( Key::F6, 0x3f); //F6

        scancode.insert(Key::F7, 0x40); //F7
        scancode.insert(Key::F8, 0x41); //F8
        scancode.insert(Key::F9, 0x42); //F9
        scancode.insert(Key::F10, 0x43); //F10
        scancode.insert(Key::F11, 0x44); //F11
        scancode.insert(Key::F12, 0x45); //F12

        #[cfg(target_os = "windows")]
        {
        scancode.insert(Key::Unknown(173), 0x7f); //VOLUME_MUTE
        scancode.insert(Key::Unknown(174), 0x81); //VOLUME_DOWN
        scancode.insert(Key::Unknown(175), 0x80); //VOLUME_UP

        scancode.insert(Key::Unknown(124), 0x68); //F13
        scancode.insert(Key::Unknown(125), 0x69); //F14
        scancode.insert(Key::Unknown(126), 0x6a); //F15
        scancode.insert(Key::Unknown(127), 0x6b); //F16

        scancode.insert(Key::Unknown(128), 0x6c); //F17
        scancode.insert(Key::Unknown(129), 0x6d); //F18
        scancode.insert(Key::Unknown(130), 0x6e); //F19
        scancode.insert(Key::Unknown(131), 0x6f); //F20

        scancode.insert(Key::Unknown(132), 0x70); //F21
        scancode.insert(Key::Unknown(133), 0x71); //F22
        scancode.insert(Key::Unknown(134), 0x72); //F23
        scancode.insert(Key::Unknown(135), 0x73); //F24
        }

        #[cfg(target_os = "linux")]
        {
        scancode.insert(Key::Unknown(121), 0x7f); //VOLUME_MUTE
        scancode.insert(Key::Unknown(122), 0x81); //VOLUME_DOWN
        scancode.insert(Key::Unknown(123), 0x80); //VOLUME_UP

        scancode.insert(Key::Unknown(191), 0x68); //F13
        scancode.insert(Key::Unknown(192), 0x69); //F14
        scancode.insert(Key::Unknown(193), 0x6a); //F15
        scancode.insert(Key::Unknown(194), 0x6b); //F16

        scancode.insert(Key::Unknown(195), 0x6c); //F17
        scancode.insert(Key::Unknown(196), 0x6d); //F18
        scancode.insert(Key::Unknown(197), 0x6e); //F19
        scancode.insert(Key::Unknown(198), 0x6f); //F20

        scancode.insert(Key::Unknown(199), 0x70); //F21
        scancode.insert(Key::Unknown(200), 0x71); //F22
        scancode.insert(Key::Unknown(201), 0x72); //F23
        scancode.insert(Key::Unknown(202), 0x73); //F24
        }

        scancode.insert(Key::PrintScreen, 0x46); //PRINT_SCREEN
        scancode.insert(Key::ScrollLock, 0x47); //SCROLL_LOCK

        scancode.insert(Key::Pause, 0x48); //PAUSE
        scancode.insert(Key::Insert, 0x49); //INSERT
        scancode.insert(Key::Home, 0x4a); //HOME
        scancode.insert(Key::PageUp, 0x4b); //PAGE_UP
        scancode.insert(Key::Delete, 0x4c); //DEL
        scancode.insert(Key::End, 0x4d); //END
        scancode.insert(Key::PageDown, 0x4e); //PAGE_DOWN

        scancode.insert(Key::RightArrow, 0x4f); //ARROW_RIGHT
        scancode.insert(Key::LeftArrow, 0x50); //ARROW_LEFT
        scancode.insert(Key::DownArrow, 0x51); //ARROW_DOWN
        scancode.insert(Key::UpArrow, 0x52); //ARROW_UP

        scancode.insert(Key::NumLock, 0x53); //NUM_LOCK
        scancode.insert(Key::KpDivide, 0x54); //NUMPAD_DIVIDE
        scancode.insert(Key::KpMultiply, 0x55); //NUMPAD_MULTIPLY
        scancode.insert(Key::KpMinus, 0x56); //NUMPAD_SUBTRACT
        scancode.insert(Key::KpPlus, 0x57); //NUMPAD_ADD
        scancode.insert(Key::KpReturn, 0x58); //NUMPAD_ENTER

        scancode.insert(Key::Kp1, 0x59); //NUMPAD1
        scancode.insert(Key::Kp2, 0x5a); //NUMPAD2
        scancode.insert(Key::Kp3, 0x5b); //NUMPAD3
        scancode.insert(Key::Kp4, 0x5c); //NUMPAD4
        scancode.insert(Key::Kp5, 0x5d); //NUMPAD5
        scancode.insert(Key::Kp6, 0x5e); //NUMPAD6
        scancode.insert(Key::Kp7, 0x5f); //NUMPAD7
        scancode.insert(Key::Kp8, 0x60); //NUMPAD8
        scancode.insert(Key::Kp9, 0x61); //NUMPAD9
        scancode.insert(Key::Kp0, 0x62); //NUMPAD0
        scancode.insert(Key::Dot, 0x63); //NUMPAD_DECIMAL

        scancode.insert(Key::IntlBackslash, 0x64); //INTL_BACKSLASH
        scancode.insert(Key::Function, 0x65); //CONTEXT_MENU

        // scancode.insert(0x67, Key::Key); //NUMPAD_EQUAL

        // scancode.insert(0x74, Key::Key); //OPEN
        //
        // scancode.insert(0x75, Key::Key); //HELP
        //
        // scancode.insert(0x66, Key::Key); //POWER
        // scancode.insert(0x77, 0x0000); //SELECT
        //
        // scancode.insert(0x79, Key::Key); //AGAIN
        // scancode.insert(0x7a, Key::Key); //UNDO
        // scancode.insert(0x7b, Key::Key); //CUT
        // scancode.insert(0x7c, Key::Key); //COPY
        // scancode.insert(0x7d, Key::Key); //PASTE
        // scancode.insert(0x7e, Key::Key); //FIND
        // scancode.insert(0x7f, Key::Key); //VOLUME_MUTE
        //
        // scancode.insert(0x80, Key::Key); //VOLUME_UP
        // scancode.insert(0x81, Key::Key); //VOLUME_DOWN
        // scancode.insert(0x85, Key::Key); //NUMPAD_COMMA
        //
        // scancode.insert(0x87, Key::Key); //INTL_RO
        // scancode.insert(0x88, Key::Key); //KANA_MODE
        // scancode.insert(0x89, Key::Key); //INTL_YEN
        // scancode.insert(0x8a, Key::Key); //CONVERT
        // scancode.insert(0x8b, Key::Key); //NON_CONVERT
        // scancode.insert(0x90, Key::Key); //LANG1
        // scancode.insert(0x91, Key::Key); //LANG2
        // scancode.insert(0x92, Key::Key); //LANG3
        // scancode.insert(0x93, Key::Key); //LANG4

        scancode.insert(Key::ControlLeft, 0xe0); //CONTROL_LEFT
        scancode.insert(Key::ShiftLeft, 0xe1); //SHIFT_LEFT
        scancode.insert(Key::Alt, 0xe2); //ALT_LEFT
        scancode.insert(Key::MetaLeft, 0xe3); //META_LEFT
        scancode.insert(Key::ControlRight, 0xe4); //CONTROL_RIGHT
        scancode.insert(Key::ShiftRight, 0xe5); //SHIFT_RIGHT
        scancode.insert(Key::Alt, 0xe6); //ALT_RIGHT
        scancode.insert(Key::MetaRight, 0xe7); //META_RIGHT

    scancode
};

}

lazy_static! {
#[derive(Debug)]
pub static ref MODIFIER_LIST_HID: Vec<u32> = MODIFIER_LIST_RDEV.iter().map(|x| *SCANCODE_TO_HID.get(x).unwrap()).collect::<Vec<u32>>();

}
