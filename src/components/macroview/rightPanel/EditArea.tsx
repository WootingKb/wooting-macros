import { useColorModeValue, VStack, Text } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useMacroContext } from '../../../contexts/macroContext'
import { useSelectedElement } from '../../../contexts/selectors'
import DelayForm from './editForms/DelayForm'
import EmptyForm from './editForms/EmptyForm'
import KeyPressForm from './editForms/KeyPressForm'
import MousePressForm from './editForms/MousePressForm'
import SystemEventActionForm from './editForms/SystemEventActionForm'

export default function EditArea() {
  const selectedElement = useSelectedElement()
  const { selectedElementId } = useMacroContext()
  const bg = useColorModeValue('bg-light', 'primary-dark.900')

  const SelectedElementFormComponent = useMemo(() => {
    if (!selectedElement || selectedElementId === undefined) {
      return <EmptyForm />
    }

    switch (selectedElement.type) {
      case 'SystemEventAction':
        return (
          <SystemEventActionForm
            item={selectedElement.data}
            selectedElementId={selectedElementId}
          />
        )
      case 'DelayEventAction':
        return <DelayForm selectedElementId={selectedElementId}/>
      case 'KeyPressEventAction':
        return <KeyPressForm selectedElementId={selectedElementId} />
      case 'MouseEventAction':
        return <MousePressForm selectedElementId={selectedElementId}/>
      default:
        return <EmptyForm />
    }
  }, [selectedElement, selectedElementId])

  return (
    <VStack
      position="relative"
      w="26%"
      h="full"
      bg={bg}
      px={[2, 4, 6]}
      pt={[2, 4]}
    >
      <Text w="full" fontWeight="semibold" fontSize={['sm', 'md']}>
        Edit Element
      </Text>
      {SelectedElementFormComponent}
    </VStack>
  )
}
