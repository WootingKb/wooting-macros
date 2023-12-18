import { useCallback, useEffect, useState } from 'react'
import { KeyType } from '../constants/enums'
import { webCodeHIDLookup } from '../constants/HIDmap'
import { webButtonLookup } from '../constants/MouseMap'
import { Keypress, MousePressAction } from '../types'
import { error } from 'tauri-plugin-log'
import { invoke } from '@tauri-apps/api'

export default function useRecordingSequence(
  onItemChanged: (
    item: Keypress | MousePressAction | undefined,
    prevItem: Keypress | MousePressAction | undefined,
    timeDiff: number,
    isUpEvent: boolean
  ) => void
) {
  const [recording, setRecording] = useState(false)
  const [item, setItem] = useState<Keypress | MousePressAction | undefined>(
    undefined
  )
  const [prevItem, setPrevItem] = useState<
    Keypress | MousePressAction | undefined
  >(undefined)
  const [eventType, setEventType] = useState<'Down' | 'Up'>('Down')
  const [prevEventType, setPrevEventType] = useState<'Down' | 'Up'>('Down')

  const [prevTimestamp, setPrevTimestamp] = useState(0)

  const startRecording = useCallback(() => {
    setItem(undefined)
    setPrevItem(undefined)
    setRecording(true)
  }, [setItem, setRecording])

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
      const timeDiff = Math.round(event.timeStamp - prevTimestamp)

      setPrevTimestamp(event.timeStamp)
      setPrevEventType(eventType)
      setPrevItem(item)

      if (event.type === 'keyup') {
        setEventType('Up')
        const keyup: Keypress = {
          keypress: HIDcode,
          press_duration: 0,
          key_type: KeyType[KeyType.Up]
        }
        setItem(keyup)
        onItemChanged(keyup, item, timeDiff, true)
        return
      }

      setEventType('Down')
      const keydown: Keypress = {
        keypress: HIDcode,
        press_duration: 0,
        key_type: KeyType[KeyType.Down]
      }
      setItem(keydown)
      onItemChanged(keydown, item, timeDiff, false)
    },
    [eventType, item, onItemChanged, prevTimestamp]
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

      const timeDiff = Math.round(event.timeStamp - prevTimestamp)
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
        onItemChanged(mouseup, item, timeDiff, true)
        return
      }

      setEventType('Down')
      const mousedown: MousePressAction = {
        type: 'Down',
        button: enumVal
      }

      setItem(mousedown)
      onItemChanged(mousedown, item, timeDiff, false)
    },
    [eventType, item, onItemChanged, prevTimestamp]
  )

  useEffect(() => {
    if (!recording) {
      return
    }

    window.addEventListener('keydown', addKeypress, false)
    window.addEventListener('mousedown', addMousepress, false)
    window.addEventListener('keyup', addKeypress, false)
    window.addEventListener('mouseup', addMousepress, false)
    invoke<void>('control_grabbing', { frontendBool: false }).catch(
      (e: string) => {
        error(e)
      }
    )

    return () => {
      window.removeEventListener('keydown', addKeypress, false)
      window.removeEventListener('mousedown', addMousepress, false)
      window.removeEventListener('keyup', addKeypress, false)
      window.removeEventListener('mouseup', addMousepress, false)
      invoke<void>('control_grabbing', { frontendBool: true }).catch(
        (e: string) => {
          error(e)
        }
      )
    }
  }, [recording, addKeypress, addMousepress])

  return {
    recording,
    startRecording,
    stopRecording,
    item,
    eventType,
    prevEventType,
    prevItem
  }
}
