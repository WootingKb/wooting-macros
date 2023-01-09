import {
  Divider,
  Textarea,
  Text,
  HStack,
  Box,
  useColorMode
} from '@chakra-ui/react'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useMacroContext } from '../../../contexts/macroContext'
import { useSelectedElement } from '../../../contexts/selectors'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

export default function ClipboardForm() {
  const pickerRef = useRef<HTMLDivElement | null>(null)
  const [text, setText] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const selectedElement = useSelectedElement()
  const { selectedElementId, updateElement } = useMacroContext()
  const { colorMode } = useColorMode()

  useEffect(() => {
    if (
      selectedElement === undefined ||
      selectedElement.type !== 'SystemEventAction' ||
      selectedElement.data.type !== 'Clipboard' ||
      selectedElement.data.action.type !== 'PasteUserDefinedString'
    ) return

    setText(selectedElement.data.action.data)
  }, [selectedElement])

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (pickerRef === undefined) {
        return
      }
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        if (
          (event.target as HTMLElement).id === 'emoji-button' ||
          (event.target as HTMLElement).localName === 'span'
        ) {
          return
        }
        setShowEmojiPicker(!showEmojiPicker)
      }
    },
    [showEmojiPicker]
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside, pickerRef])

  const onTextChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(event.target.value)
    },
    [setText]
  )

  const onInputBlur = useCallback(() => {
    if (selectedElement === undefined || selectedElementId === undefined) {
      return
    }
    if (selectedElement.type !== 'SystemEventAction') {
      return
    }
    const temp = { ...selectedElement }
    temp.data = {
      type: 'Clipboard',
      action: { type: 'PasteUserDefinedString', data: text}
    }
    updateElement(temp, selectedElementId)
  }, [selectedElement, selectedElementId, text, updateElement])

  const onEmojiSelect = useCallback(
    (emoji: { native: string }) => {
      if (selectedElement === undefined || selectedElementId === undefined) {
        return
      }
      if (selectedElement.type !== 'SystemEventAction') {
        return
      }
      const newString = text + emoji.native
      setText(newString)
      const temp = { ...selectedElement }
      temp.data = {
        type: 'Clipboard',
        action: {
          type: 'PasteUserDefinedString',
          data: newString
        }
      }
      updateElement(temp, selectedElementId)
    },
    [selectedElement, selectedElementId, text, updateElement]
  )

  return (
    <>
      <Text w="full" fontWeight="semibold" fontSize={['sm', 'md']}>
        {'Paste Text'}
      </Text>
      <Divider />
      <HStack w="full" justifyContent="space-between">
        <Text fontSize={['xs', 'sm', 'md']} fontWeight="semibold">
          Text to paste
        </Text>
        <Box
          filter={showEmojiPicker ? 'grayscale(0%)' : 'grayscale(100%)'}
          _hover={{ filter: 'grayscale(0%)', transform: 'scale(110%)' }}
          transition="ease-out 150ms"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          id="emoji-button"
        >
          <em-emoji id="smile" size="32px" />
        </Box>
      </HStack>
      <Textarea
        variant="brandAccent"
        value={text}
        onChange={onTextChange}
        onBlur={onInputBlur}
        placeholder="e.g. glhf <3"
      />
      {showEmojiPicker && (
        <Box ref={pickerRef} w="full">
          <Picker
            data={data}
            theme={colorMode}
            onEmojiSelect={onEmojiSelect}
            navPosition="bottom"
            previewPosition="none"
            dynamicWidth={true}
            maxFrequentRows={1}
          />
        </Box>
        // TODO: need to figure out how to adjust height of picker, as it doesn't allow for customizing style. Maybe it will be updated one day or we find a different emoji picker
      )}
    </>
  )
}
