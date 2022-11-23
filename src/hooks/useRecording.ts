import { useCallback, useEffect, useState } from 'react'
import { KeyType, RecordingType } from '../enums'
import { webCodeHIDLookup } from '../maps/HIDmap'
import { Keypress, MousePressAction } from '../types'

const useRecording = (
  type: RecordingType,
  initialItems: Array<Keypress | MousePressAction> = []
) => {
  // what we have
  // recording state; array of keypress/mousepress; type, either trigger or sequence

  // what we return
  // recording state; toggle callback, array of keypress/mousepress

  // what is used
  // recording state is used for conditional rendering
  // array of keypress/mousepress will be assigned to the trigger or appended to the sequence

  // when hook is called (new instance), recording is false and we reset array of input
  // when recording is on, add event listener to window
  // any input from keyboard or mouse is added to array
  // when recording is off, remove listener
  const [recording, setRecording] = useState(false)
  const toggle = useCallback(() => {
    if (!recording) {
      setItems([])
    }
    setRecording((recording) => !recording)
  }, [recording, setRecording])
  const [items, setItems] = useState<Array<Keypress | MousePressAction>>(initialItems)

  // handle adding keypress to array
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
      if ((type === RecordingType.Trigger) && (items.length == 3)) {
        setRecording(false)
      }
    },
    [items, type]
  )

  const addMousepress = useCallback((event: MouseEvent) => {
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

  }, [items, type])

  useEffect(() => {
    if (!recording) {
      return
    }

    window.addEventListener('keydown', addKeypress, false)
    // window.addEventListener('mousedown', addMousepress, false)
    // TODO: stop backend trigger listening
    return () => {
      window.removeEventListener('keydown', addKeypress, false)
      // window.removeEventListener('mousedown', addMousepress, false)
      // TODO: start backend trigger listening
    }
  }, [addKeypress, recording])

  return { recording, toggle, items }
}

export default useRecording
