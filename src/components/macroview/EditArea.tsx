import { VStack, Text } from '@chakra-ui/react'

const EditArea = () => {
  return (
    <VStack w="25%" h="full" borderLeft="1px" borderColor="gray.200">
        <Text fontWeight="semibold" fontSize={['sm', 'md']}>
          Select an Element to edit
        </Text>
    </VStack>
  )
}

export default EditArea
