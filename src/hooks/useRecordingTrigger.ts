import { useToast } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { MouseButton } from '../constants/enums'
import { webCodeLocationHIDLookup } from '../constants/HIDmap'
import { webButtonLookup } from '../constants/MouseMap'
import { checkIfKeyShouldContinueTriggerRecording } from '../constants/utils'
import { error } from 'tauri-plugin-log'
import { invoke } from '@tauri-apps/api'

export default function useRecordingTrigger(
  initialItems: MouseButton | number[]
) {
  const [recording, setRecording] = useState(false)
  const [items, setItems] = useState<number[]>(() => {
    if (Array.isArray(initialItems)) {
      return initialItems
    } else {
      return [initialItems]
    }
  })
  const [prevItems, setPrevItems] = useState<number[]>([])
  const toast = useToast()

  const resetItems = useCallback(() => {
    setItems(prevItems)
  }, [setItems, prevItems])

  const startRecording = useCallback(() => {
    setPrevItems(items)
    setItems([])
    setRecording(true)
  }, [setPrevItems, setItems, setRecording, items])

  const stopRecording = useCallback(() => {
    setRecording(false)
  }, [setRecording])

  const addKeypress = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault()
      event.stopPropagation()

      // Gets the ID according to the whichID, adds a separator extra digit '1' and then adds location to the end.
      const HIDIdentifier = event.which + '1' + event.location

      const HIDcode = webCodeLocationHIDLookup.get(HIDIdentifier)?.HIDcode

      if (HIDcode === undefined) {
        return
      }

      setItems((items) => {
        let newItems: number[] = []
        if (items.filter((item) => item === HIDcode).length > 0) {
          // Prevent duplicate keys
          newItems = items
        } else {
          newItems = [...items, HIDcode]
        }
        return newItems
      })

      if (!checkIfKeyShouldContinueTriggerRecording(HIDcode)) stopRecording()
    },
    [stopRecording]
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

      setItems([enumVal])
      stopRecording()
    },
    [setItems, stopRecording]
  )

  useEffect(() => {
    if (!recording) {
      return
    }

    window.addEventListener('keydown', addKeypress, true)
    window.addEventListener('mousedown', addMousepress, true)
    invoke<void>('control_grabbing', { frontendBool: false }).catch((e) => {
      error(e)
      toast({
        title: 'Error disabling macro output',
        description:
          'Unable to disable macro output, please re-open the app. If that does not work, please contact us on Discord.',
        status: 'error',
        duration: 2000,
        isClosable: true
      })
    })

    return () => {
      window.removeEventListener('keydown', addKeypress, true)
      window.removeEventListener('mousedown', addMousepress, true)
      invoke<void>('control_grabbing', { frontendBool: true }).catch((e) => {
        error(e)
        toast({
          title: 'Error enabling macro output',
          description:
            'Unable to enable macro output, please re-open the app. If that does not work, please contact us on Discord.',
          status: 'error',
          duration: 2000,
          isClosable: true
        })
      })
    }
  }, [recording, addKeypress, addMousepress, toast])

  return {
    recording,
    startRecording,
    stopRecording,
    items,
    resetItems
  }
}
