import {
  Box,
  Divider,
  HStack,
  Text,
  Textarea,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useMacroContext } from '../../../../contexts/macroContext'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { SystemEventAction } from '../../../../types'
import { borderRadiusStandard } from '../../../../theme/config'

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
  const bg = useColorModeValue('primary-light.50', 'primary-dark.700')
  const kebabColour = useColorModeValue('primary-light.500', 'primary-dark.500')

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
    <>
      <HStack justifyContent="center" p={1}>
        <Text>Editing element</Text>
        <Box
          h="32px"
          w="fit-content"
          bg={bg}
          border="1px solid"
          py={1}
          px={3}
          borderColor={kebabColour}
          rounded={borderRadiusStandard}
        >
          <Text
            w="fit-content"
            fontSize="sm"
            whiteSpace="nowrap"
            fontWeight="bold"
          >
            {'Clipboard'}
          </Text>
        </Box>
      </HStack>
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
