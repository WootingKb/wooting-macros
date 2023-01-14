import { HStack, VStack, Text, Switch } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useSettingsContext } from '../../contexts/settingsContext'

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
  const { config } = useSettingsContext()

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
        isDisabled={!config.AutoStart && title === 'Minimize on startup'}
        isChecked={!config.AutoStart && title === 'Minimize on startup' ? false : value}
        onChange={() => onChange(!value)}
      />
    </HStack>
  )
}
