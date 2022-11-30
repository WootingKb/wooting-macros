import { invoke } from '@tauri-apps/api/tauri'
import { useCallback, useEffect, useState } from 'react'
import { KeyType, RecordingType } from '../enums'
import { webCodeHIDLookup } from '../maps/HIDmap'
import { Keypress, MousePressAction } from '../types'

export default function useRecording(
  type: RecordingType,
  initialItems: Array<Keypress | MousePressAction> = []
) {
  const [recording, setRecording] = useState(false)
  const [items, setItems] =
    useState<Array<Keypress | MousePressAction>>(initialItems)

  const startRecording = useCallback(() => {
    setItems([])
    console.log('setting recording to true')
    setRecording(true)
  }, [setItems, setRecording])

  const stopRecording = useCallback(() => {
    console.log('setting recording to false')
    setRecording(false)
  }, [setRecording])

  const addKeypress = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault()

      const HIDcode = webCodeHIDLookup.get(event.code)?.HIDcode
      if (HIDcode === undefined) {
        return
      }

      if (type === RecordingType.Trigger) {
        if (
          items.some((element) => {
            if ('keypress' in element) {
              return HIDcode === element.keypress
            }
          })
        ) {
          return
        }
      }

      const keypress: Keypress = {
        keypress: HIDcode,
        press_duration: 0,
        keytype: KeyType[KeyType.DownUp]
      }

      setItems((items) => [...items, keypress])
      if (type === RecordingType.Trigger && items.length == 3) {
        setRecording(false)
      }
    },
    [items, type]
  )

  const addMousepress = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
      console.log(recording)
      if (!recording) {
        return
      }

      if (type === RecordingType.Trigger) {
        return
      }
      console.log('adding mouse press')
      const mousepress: MousePressAction = {
        type: 'DownUp',
        button: event.button,
        duration: 0
      }

      setItems((items) => [...items, mousepress])
      // if (type === RecordingType.Trigger && items.length == 3) {
      //   setRecording(false)
      // }
    },
    [recording, type]
  )

  useEffect(() => {
    if (!recording) {
      return
    }
    console.log('event listeners added')
    window.addEventListener('keypress', addKeypress, false)
    window.addEventListener('mousedown', addMousepress, false)
    invoke<void>('control_grabbing', { frontendBool: false }).catch((e) => {
      console.error(e)
    })
    return () => {
      console.log('event listeners removed')
      window.removeEventListener('keypress', addKeypress, false)
      window.removeEventListener('mousedown', addMousepress, false)
      invoke<void>('control_grabbing', { frontendBool: true }).catch((e) => {
        console.error(e)
      })
    }
  }, [addKeypress, addMousepress, recording])

  return { recording, startRecording, stopRecording, items }
}
