import { useColorModeValue, VStack } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useSelectedElement } from '../../contexts/selectors'
import { SystemAction } from '../../types'
import ClipboardForm from './editForms/ClipboardForm'
import DelayForm from './editForms/DelayForm'
import EmptyForm from './editForms/EmptyForm'
import KeyPressForm from './editForms/KeyPressForm'
import MousePressForm from './editForms/MousePressForm'
import OpenAppForm from './editForms/OpenAppForm'
import ScreenBrightnessForm from './editForms/ScreenBrightnessForm'
import VolumeControlForm from './editForms/VolumeControlForm'

function SystemEventActionForm({ item }: { item: SystemAction }) {
  return (
    <>
      {item.type === 'Open' && <OpenAppForm />}
      {item.type === 'Volume' && <VolumeControlForm />}
      {item.type === 'Clipboard' && <ClipboardForm />}
      {item.type === 'Brightness' && <ScreenBrightnessForm />}
    </>
  )
}

export default function EditArea() {
  const selectedElement = useSelectedElement()
  const dividerColour = useColorModeValue('gray.400', 'gray.600')

  const SelectedElementFormComponent = useMemo(() => {
    if (!selectedElement) {
      return <EmptyForm/>
    }

    switch (selectedElement.type) {
      case 'SystemEventAction':
        return <SystemEventActionForm item={selectedElement.data} />
      case 'DelayEventAction':
        return <DelayForm/>
      case 'KeyPressEventAction':
        return <KeyPressForm/>
      case 'MouseEventAction':
        return <MousePressForm/>
      default:
        return <EmptyForm/>
    }
  }, [selectedElement])

  return (
    <VStack w="25%" h="full" p="3" borderLeft="1px" borderColor={dividerColour}>
      {SelectedElementFormComponent}
    </VStack>
  )
}
