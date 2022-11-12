import { VStack, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useSelectedElement } from '../../contexts/selectors'
import { useSequenceContext } from '../../contexts/sequenceContext'
import { HIDLookup } from '../../HIDmap'

const EditArea = () => {
  const [displayText, setDisplayText] = useState<string | undefined>('')
  const { selectedElementIndex } = useSequenceContext()
  const selectedElement = useSelectedElement()

  useEffect(() => {
    if (selectedElementIndex <= 0) { return }
    switch (selectedElement.data.type) {
      case "KeyPressEvent":
        setDisplayText(HIDLookup.get(selectedElement.data.data.keypress)?.displayString)
        break;
      case "Delay":
        setDisplayText("Delay")
        break
      default:
        break;
    }
  }, [selectedElement])


  if (selectedElementIndex === 0) {
    return(
      <VStack w="25%" h="full" borderLeft="1px" borderColor="gray.200" justifyContent="center">
          <Text fontWeight="semibold" fontSize={['sm', 'md']} w="50%" textAlign="center">
            Select an Element to edit
          </Text>
      </VStack>
    )
  }

  return (
    <VStack w="25%" h="full" borderLeft="1px" borderColor="gray.200">
        <Text fontWeight="semibold" fontSize={['sm', 'md']}>
          {selectedElement.data.type}
        </Text>
        <Text>
          {displayText}
        </Text>
    </VStack>
  )
}

export default EditArea
