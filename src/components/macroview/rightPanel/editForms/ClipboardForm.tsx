import {
  Divider,
  Textarea,
  Text,
  HStack,
  Box,
  useColorMode,
  VStack
} from '@chakra-ui/react'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useMacroContext } from '../../../../contexts/macroContext'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { SystemEventAction } from '../../../../types'
import { motion } from 'framer-motion'

interface Props {
  selectedElementId: number
  selectedElement: SystemEventAction
}

export default function ClipboardForm({
  selectedElementId,
  selectedElement
}: Props) {
  const pickerRef = useRef<HTMLDivElement | null>(null)
  const [text, setText] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const { updateElement } = useMacroContext()
  const { colorMode } = useColorMode()

  useEffect(() => {
    if (
      selectedElement.data.type !== 'Clipboard' ||
      selectedElement.data.action.type !== 'PasteUserDefinedString'
    )
      return

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
    const temp: SystemEventAction = {
      ...selectedElement,
      data: {
        type: 'Clipboard',
        action: { type: 'PasteUserDefinedString', data: text }
      }
    }
    updateElement(temp, selectedElementId)
  }, [selectedElement, selectedElementId, text, updateElement])

  const onEmojiSelect = useCallback(
    (emoji: { native: string }) => {
      const newString = text + emoji.native
      setText(newString)
      const temp: SystemEventAction = {
        ...selectedElement,
        data: {
          type: 'Clipboard',
          action: {
            type: 'PasteUserDefinedString',
            data: newString
          }
        }
      }
      updateElement(temp, selectedElementId)
    },
    [selectedElement, selectedElementId, text, updateElement]
  )

  return (
    <VStack
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      w="full"
      gap={2}
    >
      <Text w="full" fontWeight="semibold" fontSize={['sm', 'md']}>
        Paste Text
      </Text>
      <Divider />
      <VStack w="full">
        <HStack w="full" justifyContent="space-between">
          <Text fontSize={['xs', 'sm', 'md']} fontWeight="semibold">
            Text to paste
          </Text>
          <Box
            filter={showEmojiPicker ? 'grayscale(0%)' : 'grayscale(100%)'}
            _hover={{ filter: 'grayscale(0%)', transform: 'scale(110%)' }}
            transition="ease-out 150ms"
            cursor="pointer"
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
      </VStack>
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
    </VStack>
  )
}
