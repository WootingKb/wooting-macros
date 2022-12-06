import { Divider, HStack, Switch, Text, VStack } from '@chakra-ui/react'

export default function WindowSettings() {
  return (
    <VStack w="100%" spacing={4}>
      <HStack w="100%" justifyContent="space-between">
        <VStack spacing={0} textAlign="left">
          <Text w="100%" fontSize="md" fontWeight="semibold">
            Launch on Startup
          </Text>
          <Text w="100%" fontSize="sm">
            The app will open during your computer's startup phase.
          </Text>
        </VStack>
        <Switch colorScheme="yellow" />
      </HStack>
      <Divider />
      <HStack w="100%" justifyContent="space-between">
        <VStack spacing={0} textAlign="left">
          <Text w="100%" fontSize="md" fontWeight="semibold">
            Minimize on Startup
          </Text>
          <Text w="100%" fontSize="sm">
            The app will open quietly in the background on startup. Requires
            'Launch on Startup' to be enabled.
          </Text>
        </VStack>
        <Switch colorScheme="yellow" />
      </HStack>
      <Divider/>
      <HStack w="100%" justifyContent="space-between">
        <VStack spacing={0} textAlign="left">
          <Text w="100%" fontSize="md" fontWeight="semibold">
            Minimize on Close
          </Text>
          <Text w="100%" fontSize="sm">
            Pressing X will minimize the app instead of closing it.
          </Text>
        </VStack>
        <Switch colorScheme="yellow" />
      </HStack>
    </VStack>
  )
}
