import { useColorModeValue, VStack } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useSelectedElement } from '../../contexts/selectors'
import DelayForm from './editForms/DelayForm'
import EmptyForm from './editForms/EmptyForm'
import KeyPressForm from './editForms/KeyPressForm'
import MousePressForm from './editForms/MousePressForm'
import SystemEventActionForm from './editForms/SystemEventActionForm'


export default function EditArea() {
  const selectedElement = useSelectedElement()
  const borderColour = useColorModeValue('gray.400', 'gray.600')

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
    <VStack w="25%" h="full" p="3" borderLeft="1px" borderColor={borderColour}>
      {SelectedElementFormComponent}
    </VStack>
  )
}
