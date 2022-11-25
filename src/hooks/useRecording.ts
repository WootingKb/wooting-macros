import { useCallback, useEffect, useState } from 'react'
import { KeyType, RecordingType } from '../enums'
import { webCodeHIDLookup } from '../maps/HIDmap'
import { Keypress, MousePressAction } from '../types'

const useRecording = (
  type: RecordingType,
  initialItems: Array<Keypress | MousePressAction> = []
) => {
  const [recording, setRecording] = useState(false)
  const [items, setItems] =
    useState<Array<Keypress | MousePressAction>>(initialItems)

  const startRecording = useCallback(() => {
    setItems([])
    setRecording(true)
  }, [setItems, setRecording])

  const stopRecording = useCallback(() => {
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

      if (type === RecordingType.Trigger) {
        if (
          items.some((element) => {
            if ('button' in element) {
              return event.button === element.button
            }
          })
        ) {
          return
        }
      }

      const mousepress: MousePressAction = {
        type: 'DownUp',
        button: event.button,
        duration: 0
      }

      setItems((items) => [...items, mousepress])
      if (type === RecordingType.Trigger && items.length == 3) {
        setRecording(false)
      }
    },
    [items, type]
  )

  useEffect(() => {
    if (!recording) {
      return
    }

    window.addEventListener('keypress', addKeypress, false)
    // window.addEventListener('mousedown', addMousepress, false)
    // TODO: stop backend trigger listening
    return () => {
      window.removeEventListener('keypress', addKeypress, false)
      // window.removeEventListener('mousedown', addMousepress, false)
      // TODO: start backend trigger listening
    }
  }, [addKeypress, recording])

  return { recording, startRecording, stopRecording, items }
}

export default useRecording
