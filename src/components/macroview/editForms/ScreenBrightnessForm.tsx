import { useColorModeValue, Divider, Text, Input } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { useMacroContext } from "../../../contexts/macroContext"
import { useSelectedElement } from "../../../contexts/selectors"


export default function ScreenBrightnessForm() {
  const [brightnessVal, setBrightnessVal] = useState(75)
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
    if (selectedElement.data.type !== 'Brightness') {
      return
    }
    if (selectedElement.data.action.type !== 'Set') {
      return
    }

    setBrightnessVal(selectedElement.data.action.level)
  }, [selectedElement])

  const onValueChange = (event: any) => {
    if (selectedElement === undefined || selectedElementId === undefined) {
      return
    }
    if (selectedElement.type !== 'SystemEventAction') {
      return
    }

    const newValue = parseInt(event.target.value)
    if (newValue === undefined) { return }

    setBrightnessVal(newValue)
    const temp = { ...selectedElement }
    temp.data = {
      type: 'Brightness',
      action: { type: 'Set', level: newValue }
    }
    updateElement(temp, selectedElementId)
  }

  return (
    <>
      <Text fontWeight="semibold" fontSize={['sm', 'md']}>
        {'Set Screen Brightness'}
      </Text>
      <Divider borderColor={dividerColour} />
      <Text fontSize={['xs', 'sm', 'md']}>Brightness value</Text>
      <Input type="number" value={brightnessVal} onChange={onValueChange} placeholder="path"/>
    </>
  )
}