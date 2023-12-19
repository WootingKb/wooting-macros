import { HStack, Switch, Text, VStack } from '@chakra-ui/react'

interface Props {
  title: string
  description: string
  value: boolean
  onChange: (value: boolean) => void
  didDependencyCheckFail?: boolean
}

export default function ToggleSetting({
  title,
  description,
  value,
  onChange,
  didDependencyCheckFail = false
}: Props) {
  return (
    <HStack w="full" justifyContent="space-between" spacing={16}>
      <VStack spacing={0} textAlign="left">
        <Text w="full" fontSize="md" fontWeight="semibold">
          {title}
        </Text>
        <Text w="full" fontSize="sm">
          {description}
        </Text>
      </VStack>
      <Switch
        variant="brand"
        defaultChecked={value}
        isDisabled={didDependencyCheckFail}
        isChecked={didDependencyCheckFail ? false : value}
        onChange={() => onChange(!value)}
      />
    </HStack>
  )
}
