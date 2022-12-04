import { Flex, Text } from '@chakra-ui/react'

export default function VolumeControlForm() {
  return (
    <Flex h="100vh" justifyContent="center" alignItems="center">
      <Text
        fontWeight="semibold"
        fontSize={['sm', 'md', 'lg']}
        w="75%"
        textAlign="center"
      >
        Nothing to edit... yet! Send us some feedback about what you'd like to
        do with this action!
      </Text>
    </Flex>
  )
}
