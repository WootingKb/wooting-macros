import { useColorModeValue, VStack } from '@chakra-ui/react'
import { useSelectedElement } from '../../contexts/selectors'
import DelayForm from './editForms/DelayForm'
import EmptyForm from './editForms/EmptyForm'
import KeyPressForm from './editForms/KeyPressForm'

const EditArea = () => {
  const selectedElement = useSelectedElement()
  const dividerColour = useColorModeValue('gray.400', 'gray.600')

  return (
    <VStack w="25%" h="full" p="3" borderLeft="1px" borderColor={dividerColour}>
      {selectedElement === undefined && <EmptyForm />}
      {selectedElement?.type === 'DelayEventAction' && <DelayForm />}
      {selectedElement?.type === 'KeyPressEventAction' && <KeyPressForm />}
    </VStack>
  )
}

export default EditArea
