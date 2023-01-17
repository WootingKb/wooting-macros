import { Flex, Text } from '@chakra-ui/react'

export default function EmptyForm() {
  return (
    <Flex h="100vh" justifyContent="center" alignItems="center">
      <Text
        fontWeight="bold"
        fontSize={['sm', 'md', 'lg']}
        w="75%"
        textAlign="center"
      >
        Press on an element to edit it
      </Text>
    </Flex>
  )
}
