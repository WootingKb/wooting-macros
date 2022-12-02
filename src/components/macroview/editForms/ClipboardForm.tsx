import { Divider, Textarea, Text, useColorModeValue } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { useMacroContext } from "../../../contexts/macroContext"
import { useSelectedElement } from "../../../contexts/selectors"


export default function ClipboardForm() {
  const [text, setText] = useState('')
  const selectedElement = useSelectedElement()
  const { selectedElementId, updateElement } = useMacroContext()
  const dividerColour = useColorModeValue('gray.400', 'gray.600')

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
    if (selectedElement.data.action.type !== 'SetClipboard') {
      return
    }

    setText(selectedElement.data.action.data)
  }, [selectedElement])

  const onTextChange = (event: any) => {
    if (selectedElement === undefined || selectedElementId === undefined) {
      return
    }
    if (selectedElement.type !== 'SystemEventAction') {
      return
    }
    setText(event.target.value)
    const temp = { ...selectedElement }
    temp.data = { type: 'Clipboard', action: { type: "SetClipboard", data: event.target.value} }
    updateElement(temp, selectedElementId)
  }

  return (
    <>
      <Text fontWeight="semibold" fontSize={['sm', 'md']}>
        {'Paste Text'}
      </Text>
      <Divider borderColor={dividerColour} />
      <Text fontSize={['xs', 'sm', 'md']}>Text to paste</Text>
      <Textarea value={text} onChange={onTextChange} placeholder="glhf" />
    </>
  )
}