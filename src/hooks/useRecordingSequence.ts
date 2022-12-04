import { invoke } from '@tauri-apps/api/tauri'
import { useCallback, useEffect, useState } from 'react'
import { KeyType } from '../enums'
import { webCodeHIDLookup } from '../maps/HIDmap'
import { webButtonLookup } from '../maps/MouseMap'
import { Keypress, MousePressAction } from '../types'

export default function useRecordingSequence() {
  const [recording, setRecording] = useState(false)
  const [item, setItem] = useState<Keypress | MousePressAction | undefined>(
    undefined
  )
  const [timeSinceLast, setTimeSinceLast] = useState<number | undefined>(undefined)

  const startRecording = useCallback(() => {
    setTimeSinceLast(undefined)
    setItem(undefined)
    setRecording(true)
  }, [setTimeSinceLast, setItem, setRecording])

  const stopRecording = useCallback(() => {
    setRecording(false)
  }, [setRecording])

  const addKeypress = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault()
      event.stopPropagation()

      // TODO: Save timestamp of event for calculating time of delay to add

      const HIDcode = webCodeHIDLookup.get(event.code)?.HIDcode
      if (HIDcode === undefined) {
        return
      }

      const keypress: Keypress = {
        keypress: HIDcode,
        press_duration: 0,
        keytype:
          event.type === 'keydown' ? KeyType[KeyType.Down] : KeyType[KeyType.Up]
      }

      setItem(keypress)
    },
    [setItem]
  )

  const addMousepress = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()

      // TODO: Save timestamp of event for calculating time of delay to add

      if (
        (event.target as HTMLElement).localName === 'button' ||
        (event.target as HTMLElement).localName === 'svg' ||
        (event.target as HTMLElement).localName === 'path'
      ) {
        return
      }

      const enumVal = webButtonLookup.get(event.button)?.enumVal
      if (enumVal === undefined) {
        return
      }

      const mousepress: MousePressAction = {
        type: event.type === 'mousedown' ? 'Down' : 'Up',
        button: enumVal,
        duration: 0
      }

      setItem(mousepress)
    },
    [setItem]
  )

  useEffect(() => {
    if (!recording) {
      return
    }

    window.addEventListener('keydown', addKeypress, true)
    window.addEventListener('mousedown', addMousepress, true)
    window.addEventListener('keyup', addKeypress, true)
    window.addEventListener('mouseup', addMousepress, true)
    invoke<void>('control_grabbing', { frontendBool: false }).catch((e) => {
      console.error(e)
    })

    return () => {
      window.removeEventListener('keydown', addKeypress, true)
      window.removeEventListener('mousedown', addMousepress, true)
      window.removeEventListener('keyup', addKeypress, true)
      window.removeEventListener('mouseup', addMousepress, true)
      invoke<void>('control_grabbing', { frontendBool: true }).catch((e) => {
        console.error(e)
      })
    }
  }, [recording, addKeypress, addMousepress])

  return {
    recording,
    startRecording,
    stopRecording,
    item,
    timeSinceLast
  }
}
