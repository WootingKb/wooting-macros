import { HStack, VStack, Text, Switch } from "@chakra-ui/react";

type Props = {
    title: string
    description: string
}

export default function ToggleSetting({title, description}: Props) {
  return (
    <HStack w="100%" justifyContent="space-between" spacing={16}>
      <VStack spacing={0} textAlign="left">
        <Text w="100%" fontSize="md" fontWeight="semibold">
          {title}
        </Text>
        <Text w="100%" fontSize="sm">
          {description}
        </Text>
      </VStack>
      <Switch colorScheme="yellow" />
    </HStack>
  )
}