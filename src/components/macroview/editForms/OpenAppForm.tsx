import { Button, Divider, Text, Textarea, VStack } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { useMacroContext } from '../../../contexts/macroContext'
import { useSelectedElement } from '../../../contexts/selectors'
import { open } from '@tauri-apps/api/dialog'
import { appDir } from '@tauri-apps/api/path'

export default function OpenAppForm() {
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

    setPath(selectedElement.data.action)
  }, [selectedElement])

  const onPathChange = useCallback((event: any) => {
    if (selectedElement === undefined || selectedElementId === undefined) {
      return
    }
    if (selectedElement.type !== 'SystemEventAction') {
      return
    }
    setPath(event.target.value)
    const temp = { ...selectedElement }
    temp.data = { type: 'Open', action: event.target.value }
    updateElement(temp, selectedElementId)
  }, [selectedElement, selectedElementId, updateElement])

  const onButtonPress = useCallback(async (isDirectory: boolean) => {
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
      const temp = { ...selectedElement }
      temp.data = { type: 'Open', action: dir }
      updateElement(temp, selectedElementId)
    } else {
      const file = await open({
        multiple: false,
        title: 'Select an application to open'
      })
      if (file === null || Array.isArray(file)) {
        return
      }
      setPath(file)
      const temp = { ...selectedElement }
      temp.data = { type: 'Open', action: file }
      updateElement(temp, selectedElementId)
    }
  }, [selectedElement, selectedElementId, updateElement])

  return (
    <VStack textAlign="left">
      <Text fontWeight="semibold" fontSize={['sm', 'md']}>
        {'Open Application'}
      </Text>
      <Divider />
      <Text w="100%" fontSize={['xs', 'sm', 'md']}>
        Path to application
      </Text>
      <Textarea value={path} onChange={onPathChange} placeholder="path" />
      <Button w="100%" onClick={() => onButtonPress(false)}>
        Browse For Files
      </Button>
      <Button w="100%" onClick={() => onButtonPress(true)}>
        Browse For Folders
      </Button>
    </VStack>
  )
}
