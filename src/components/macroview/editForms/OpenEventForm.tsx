import { Button, Divider, Text, Textarea, VStack } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { useMacroContext } from '../../../contexts/macroContext'
import { useSelectedElement } from '../../../contexts/selectors'
import { open } from '@tauri-apps/api/dialog'
import { sysEventLookup } from '../../../maps/SystemEventMap'

export default function OpenEventForm() {
  const [subtype, setSubtype] = useState<'File' | 'Directory' | 'Website'>()
  const [headerText, setHeaderText] = useState('')
  const [subHeaderText, setSubHeaderText] = useState('')
  const [path, setPath] = useState('')
  const selectedElement = useSelectedElement()
  const { selectedElementId, updateElement } = useMacroContext()

  useEffect(() => {
    if (selectedElement === undefined) {
      return
    }
    if (selectedElement.type !== 'SystemEventAction') {
      return
    }
    if (selectedElement.data.type !== 'Open') {
      return
    }
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
      sysEventLookup.get(selectedElement.data.action.type)?.displayString || ''
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
    if (selectedElement === undefined || selectedElementId === undefined) {
      return
    }
    if (selectedElement.type !== 'SystemEventAction') {
      return
    }
    const temp = {
      ...selectedElement
    }
    temp.data = {
      type: 'Open',
      action: { type: 'Website', data: path }
    }
    updateElement(temp, selectedElementId)
  }, [path, selectedElement, selectedElementId, updateElement])

  const onButtonPress = useCallback(
    async (isDirectory: boolean) => {
      if (selectedElement === undefined || selectedElementId === undefined) {
        return
      }
      if (selectedElement.type !== 'SystemEventAction') {
        return
      }
      if (isDirectory) {
        const dir = await open({
          directory: true,
          multiple: false,
          title: 'Select a directory to open'
        })
        if (dir === null || Array.isArray(dir)) {
          return
        }
        setPath(dir)
        const temp = {
          ...selectedElement
        }
        temp.data = {
          type: 'Open',
          action: { type: 'Directory', data: dir }
        }
        updateElement(temp, selectedElementId)
      } else {
        const file = await open({
          multiple: false,
          title: 'Select a file to open'
        })
        if (file === null || Array.isArray(file)) {
          return
        }
        setPath(file)
        const temp = {
          ...selectedElement
        }
        temp.data = { type: 'Open', action: { type: 'File', data: file } }
        updateElement(temp, selectedElementId)
      }
    },
    [selectedElement, selectedElementId, updateElement]
  )

  return (
    <VStack textAlign="left" w="full">
      <Text fontWeight="semibold" fontSize={['sm', 'md']}>
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
