import { HStack, VStack, Text, Switch } from '@chakra-ui/react'

interface Props {
  title: string
  description: string
  value: boolean
  onChange: (value: boolean) => void
}

export default function ToggleSetting({
  title,
  description,
  value,
  onChange
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
        isChecked={value}
        onChange={() => onChange(!value)}
      />
    </HStack>
  )
}
