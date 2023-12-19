import { useColorModeValue, VStack } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useMacroContext } from '../../../contexts/macroContext'
import { useSelectedElement } from '../../../contexts/selectors'
import useMainBgColour from '../../../hooks/useMainBgColour'
import DelayForm from './editForms/DelayForm'
import EmptyForm from './editForms/EmptyForm'
import KeyPressForm from './editForms/KeyPressForm'
import MousePressForm from './editForms/MousePressForm'
import SystemEventActionForm from './editForms/SystemEventActionForm'

export default function EditArea() {
  const selectedElement = useSelectedElement()
  const { selectedElementId } = useMacroContext()
  useColorModeValue('primary-light.500', 'primary-dark.500')

  const SelectedElementFormComponent = useMemo(() => {
    if (!selectedElement || selectedElementId === undefined) {
      return <EmptyForm />
    }

    switch (selectedElement.type) {
      case 'SystemEventAction':
        return (
          <SystemEventActionForm
            selectedElementId={selectedElementId}
            selectedElement={selectedElement}
          />
        )
      case 'DelayEventAction':
        return (
          <DelayForm
            selectedElementId={selectedElementId}
            selectedElement={selectedElement}
          />
        )
      case 'KeyPressEventAction':
        return (
          <KeyPressForm
            selectedElementId={selectedElementId}
            selectedElement={selectedElement}
          />
        )
      case 'MouseEventAction':
        return (
          <MousePressForm
            selectedElementId={selectedElementId}
            selectedElement={selectedElement}
          />
        )
      default:
        return <EmptyForm />
    }
  }, [selectedElement, selectedElementId])

  return (
    <VStack
      position="relative"
      w="26%"
      h="full"
      bg={useMainBgColour()}
      px={[2, 4, 6]}
      pt={[2, 4]}
    >
      {SelectedElementFormComponent}
    </VStack>
  )
}
