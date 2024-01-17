import {
  Box,
  Button,
  Divider,
  HStack,
  Text,
  Textarea,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useMacroContext } from '../../../../contexts/macroContext'
import { dialog } from '@tauri-apps/api'
import { sysEventLookup } from '../../../../constants/SystemEventMap'
import { SystemEventAction } from '../../../../types'


interface Props {
  selectedElement: SystemEventAction
  selectedElementId: number
}

export default function OpenEventForm({
  selectedElementId,
  selectedElement
}: Props) {
  const [subtype, setSubtype] = useState<'File' | 'Directory' | 'Website'>()
  const [headerText, setHeaderText] = useState<JSX.Element | string>('')
  const [subHeaderText, setSubHeaderText] = useState('')
  const [path, setPath] = useState('')
  const { updateElement } = useMacroContext()
  const bg = useColorModeValue('primary-light.50', 'primary-dark.700')
  const kebabColour = useColorModeValue('primary-light.500', 'primary-dark.500')

  useEffect(() => {
    if (selectedElement.data.type !== 'Open') return

    switch (selectedElement.data.action.type) {
      case 'File':
        setSubtype('File')
        setSubHeaderText('File path')
        break
      case 'Directory':
        setSubtype('Directory')
        setSubHeaderText('Directory path')
        break
      case 'Website':
        setSubtype('Website')
        setSubHeaderText('Website URL')
        break
      default:
        break
    }
    setHeaderText(
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
          rounded='md'
        >
          <Text
            w="fit-content"
            whiteSpace="nowrap"
            fontSize={['sm', 'md', 'md']}
            fontWeight="bold"
          >
            {sysEventLookup.get(selectedElement.data.action.type)
              ?.displayString || ''}
          </Text>
        </Box>
      </HStack>
    )
    setPath(selectedElement.data.action.data)
  }, [selectedElement])

  const onPathChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setPath(event.target.value)
    },
    [setPath]
  )

  const onInputBlur = useCallback(() => {
    const temp: SystemEventAction = {
      ...selectedElement,
      data: {
        type: 'Open',
        action: { type: 'Website', data: path }
      }
    }

    updateElement(temp, selectedElementId)
  }, [path, selectedElement, selectedElementId, updateElement])

  const onButtonPress = useCallback(
    async (isDirectory: boolean) => {
      if (isDirectory) {
        const dir = await dialog.open({
          directory: true,
          multiple: false,
          title: 'Select a directory to open'
        })
        if (dir === null || Array.isArray(dir)) {
          return
        }
        setPath(dir)
        const temp: SystemEventAction = {
          ...selectedElement,
          data: {
            type: 'Open',
            action: { type: 'Directory', data: dir }
          }
        }
        updateElement(temp, selectedElementId)
      } else {
        const file = await dialog.open({
          multiple: false,
          title: 'Select a file to open'
        })
        if (file === null || Array.isArray(file)) {
          return
        }
        setPath(file)
        const temp: SystemEventAction = {
          ...selectedElement,
          data: { type: 'Open', action: { type: 'File', data: file } }
        }
        updateElement(temp, selectedElementId)
      }
    },
    [selectedElement, selectedElementId, updateElement]
  )

  return (
    <VStack textAlign="left" w="full">
      <Text w="full" fontWeight="semibold" fontSize={['sm', 'md']}>
        {headerText}
      </Text>
      <Divider />
      <Text w="full" fontSize={['xs', 'sm', 'md']} fontWeight="semibold">
        {subHeaderText}
      </Text>
      <Textarea
        variant="brand"
        value={path}
        onChange={onPathChange}
        onBlur={onInputBlur}
        placeholder="path"
        isDisabled={subtype === 'File' || subtype === 'Directory'}
      />
      {subtype === 'File' && (
        <Button
          variant="brandAccent"
          w={['full', '75%', '50%']}
          onClick={() => onButtonPress(false)}
        >
          Browse For Files
        </Button>
      )}
      {subtype === 'Directory' && (
        <Button
          variant="brandAccent"
          w={['full', '75%', '50%']}
          onClick={() => onButtonPress(true)}
        >
          Browse For Folders
        </Button>
      )}
    </VStack>
  )
}
