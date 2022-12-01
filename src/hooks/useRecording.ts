import { invoke } from '@tauri-apps/api/tauri'
import { useRef, useState } from 'react'
import { KeyType, RecordingType } from '../enums'
import { webCodeHIDLookup } from '../maps/HIDmap'
import { webButtonLookup } from '../maps/MouseMap'
import { Keypress, MousePressAction } from '../types'

export default function useRecording(
  type: RecordingType,
) {
  const [recording, setRecording] = useState(false)
  const [items, setItems] = useState<Array<Keypress | MousePressAction>>([])
  const [prevItems, setPrevItems] = useState<
    Array<Keypress | MousePressAction>
  >([])
  const keypressHandler = useRef(addKeypress)
  const mousepressHandler = useRef(addMousepress)

  function resetItems() {
    setItems(prevItems)
  }
  
  function initItems(newItems: Array<Keypress | MousePressAction>) {
    setItems(newItems)
  }

  function startRecording() {
    setPrevItems(items)
    setItems([])
    setRecording(true)
    window.addEventListener('keydown', keypressHandler.current, true)
    window.addEventListener('mousedown', mousepressHandler.current, true)
    invoke<void>('control_grabbing', { frontendBool: false }).catch((e) => {
      console.error(e)
    })
  }

  function stopRecording() {
    window.removeEventListener('keydown', keypressHandler.current, true)
    window.removeEventListener('mousedown', mousepressHandler.current, true)
    setRecording(false)
    invoke<void>('control_grabbing', { frontendBool: true }).catch((e) => {
      console.error(e)
    })
  }

  function addKeypress(event: KeyboardEvent) {
    event.preventDefault()

    const HIDcode = webCodeHIDLookup.get(event.code)?.HIDcode
    if (HIDcode === undefined) {
      return
    }

    if (type === RecordingType.MainTrigger) {
      if (HIDcode >= 224) {
        return
      }
      if (
        items.some((element) => {
          // remove this if clause when trigger can have mouse buttons
          if ('keypress' in element) {
            return HIDcode === element.keypress
          }
        })
      ) {
        return
      }
    }
    if (type === RecordingType.OptionalTrigger) {
      if (HIDcode < 224) {
        return
      }
    }

    const keypress: Keypress = {
      keypress: HIDcode,
      press_duration: 0,
      keytype: KeyType[KeyType.DownUp]
    }

    setItems((items) => {
      const newItems = [...items, keypress]
      if (type === RecordingType.MainTrigger && newItems.length === 1) {
        stopRecording()
      }
      if (type === RecordingType.OptionalTrigger && newItems.length === 3) {
        stopRecording()
      }

      return newItems
    })
  }

  function addMousepress(event: MouseEvent) {
    event.preventDefault()
    console.log(recording)
    if (!recording) {
      return
    }
    if (type === RecordingType.MainTrigger) {
      // remove this if clause when trigger allows for mouse buttons
      return
    }
    const enumVal = webButtonLookup.get(event.button)?.enumVal
    if (enumVal === undefined) {
      return
    }

    console.log('adding mouse press')
    const mousepress: MousePressAction = {
      type: 'DownUp',
      button: enumVal,
      duration: 0
    }

    setItems((items) => {
      const newItems = [...items, mousepress]
      // if (type === RecordingType.MainTrigger && newItems.length === 1) {
      //   stopRecording()
      // }
      // if (type === RecordingType.OptionalTrigger && newItems.length === 3) {
      //   stopRecording()
      // }

      return newItems
    })
  }

  return { recording, startRecording, stopRecording, items, resetItems, initItems }
}
