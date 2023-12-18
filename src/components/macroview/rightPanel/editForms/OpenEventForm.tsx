import { Button, Divider, Text, Textarea, VStack } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { useMacroContext } from '../../../../contexts/macroContext'
import { open } from '@tauri-apps/api/types/dialog'
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
  const [headerText, setHeaderText] = useState('')
  const [subHeaderText, setSubHeaderText] = useState('')
  const [path, setPath] = useState('')
  const { updateElement } = useMacroContext()

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
        const dir = await open({
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
        const file = await open({
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
