import { Divider, Textarea, Text } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useMacroContext } from '../../../contexts/macroContext'
import { useSelectedElement } from '../../../contexts/selectors'

export default function ClipboardForm() {
  const [text, setText] = useState('')
  const selectedElement = useSelectedElement()
  const { selectedElementId, updateElement } = useMacroContext()

  useEffect(() => {
    if (selectedElement === undefined) {
      return
    }

    if (selectedElement.type !== 'SystemEventAction') {
      return
    }
    if (selectedElement.data.type !== 'Clipboard') {
      return
    }
    if (selectedElement.data.action.type !== 'PasteUserDefinedString') {
      return
    }

    setText(selectedElement.data.action.data)
  }, [selectedElement])

  const onTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedElement === undefined || selectedElementId === undefined) {
      return
    }
    if (selectedElement.type !== 'SystemEventAction') {
      return
    }
    setText(event.target.value)
    const temp = { ...selectedElement }
    temp.data = {
      type: 'Clipboard',
      action: { type: 'PasteUserDefinedString', data: event.target.value }
    }
    updateElement(temp, selectedElementId)
  }

  return (
    <>
      <Text fontWeight="semibold" fontSize={['sm', 'md']}>
        {'Paste Text'}
      </Text>
      <Divider />
      <Text w="100%" fontSize={['xs', 'sm', 'md']} fontWeight="semibold">Text to paste</Text>
      <Textarea variant="brand" value={text} onChange={onTextChange} placeholder="e.g. glhf" />
    </>
  )
}
