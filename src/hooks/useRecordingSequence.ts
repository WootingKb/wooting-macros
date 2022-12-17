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
  const [prevItem, setPrevItem] = useState<
    Keypress | MousePressAction | undefined
  >(undefined)
  const [eventType, setEventType] = useState<'Down' | 'Up'>('Down')
  const [prevEventType, setPrevEventType] = useState<'Down' | 'Up'>('Down')
  const [timeDiff, setTimeDiff] = useState(0)
  const [prevTimestamp, setPrevTimestamp] = useState(0)

  const startRecording = useCallback(() => {
    setTimeDiff(0)
    setItem(undefined)
    setPrevItem(undefined)
    setRecording(true)
  }, [setTimeDiff, setItem, setRecording])

  const stopRecording = useCallback(() => {
    setRecording(false)
  }, [setRecording])

  const addKeypress = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault()
      event.stopPropagation()

      if (event.repeat) {
        return
      }

      const HIDcode = webCodeHIDLookup.get(event.code)?.HIDcode
      if (HIDcode === undefined) {
        return
      }

      setTimeDiff(Math.round(event.timeStamp - prevTimestamp))
      setPrevTimestamp(event.timeStamp)
      setPrevEventType(eventType)
      setPrevItem(item)

      if (event.type === 'keyup') {
        setEventType('Up')
        const keyup: Keypress = {
          keypress: HIDcode,
          press_duration: 0,
          keytype: KeyType[KeyType.Up]
        }
        setItem(keyup)
        return
      }

      setEventType('Down')
      const keydown: Keypress = {
        keypress: HIDcode,
        press_duration: 0,
        keytype: KeyType[KeyType.Down]
      }
      setItem(keydown)
    },
    [eventType, item, prevTimestamp]
  )

  const addMousepress = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()

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

      setTimeDiff(Math.round(event.timeStamp - prevTimestamp))
      setPrevTimestamp(event.timeStamp)
      setPrevEventType(eventType)
      setPrevItem(item)

      if (event.type === 'mouseup') {
        setEventType('Up')
        const mouseup: MousePressAction = {
          type: 'Up',
          button: enumVal
        }
        setItem(mouseup)
        return
      }

      setEventType('Down')
      const mousedown: MousePressAction = {
        type: 'Down',
        button: enumVal
      }

      setItem(mousedown)
    },
    [eventType, item, prevTimestamp]
  )

  useEffect(() => {
    if (!recording) {
      return
    }

    window.addEventListener('keydown', addKeypress, false)
    window.addEventListener('mousedown', addMousepress, false)
    window.addEventListener('keyup', addKeypress, false)
    window.addEventListener('mouseup', addMousepress, false)
    invoke<void>('control_grabbing', { frontendBool: false }).catch((e) => {
      console.error(e)
    })

    return () => {
      window.removeEventListener('keydown', addKeypress, false)
      window.removeEventListener('mousedown', addMousepress, false)
      window.removeEventListener('keyup', addKeypress, false)
      window.removeEventListener('mouseup', addMousepress, false)
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
    eventType,
    timeDiff,
    prevEventType,
    prevItem
  }
}
