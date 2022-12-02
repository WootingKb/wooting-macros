import { useColorModeValue, VStack } from '@chakra-ui/react'
import { useSelectedElement } from '../../contexts/selectors'
import ClipboardForm from './editForms/ClipboardForm'
import DelayForm from './editForms/DelayForm'
import EmptyForm from './editForms/EmptyForm'
import KeyPressForm from './editForms/KeyPressForm'
import MousePressForm from './editForms/MousePressForm'
import OpenAppForm from './editForms/OpenAppForm'
import ScreenBrightnessForm from './editForms/ScreenBrightnessForm'
import VolumeControlForm from './editForms/VolumeControlForm'

export default function EditArea() {
  const selectedElement = useSelectedElement()
  const dividerColour = useColorModeValue('gray.400', 'gray.600')

  return (
    <VStack w="25%" h="full" p="3" borderLeft="1px" borderColor={dividerColour}>
      {selectedElement === undefined && <EmptyForm />}
      {selectedElement?.type === 'DelayEventAction' && <DelayForm />}
      {selectedElement?.type === 'KeyPressEventAction' && <KeyPressForm />}
      {selectedElement?.type === 'MouseEventAction' && selectedElement.data.type === "Press" && <MousePressForm />}
      {selectedElement?.type === 'SystemEventAction' && selectedElement.data.type === "Open" && <OpenAppForm />}
      {selectedElement?.type === 'SystemEventAction' && selectedElement.data.type === "Volume" && <VolumeControlForm />}
      {selectedElement?.type === 'SystemEventAction' && selectedElement.data.type === "Clipboard" && <ClipboardForm />}
      {selectedElement?.type === 'SystemEventAction' && selectedElement.data.type === "Brightness" && <ScreenBrightnessForm />}
    </VStack>
  )
}
