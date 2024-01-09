import {
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  VStack
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { borderRadiusStandard } from '../../theme/config'

interface Props {
  title: string
  description: string
  defaultValue: number
  onChange: (value: string) => void
  minimum: number
  maximum: number
}

export default function NumberInputSetting({
  title,
  description,
  defaultValue,
  onChange,
  minimum,
  maximum
}: Props) {
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(defaultValue.toString())
  }, [defaultValue])

  useEffect(() => {
    if (value !== '') {
      onChange(value)
    }
  }, [value, onChange])

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
      <NumberInput
        w="25%"
        size="sm"
        rounded={borderRadiusStandard}
        variant="brand"
        step={5}
        value={value}
        onChange={(valueAsString) => setValue(valueAsString)}
        min={minimum}
        max={maximum}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </HStack>
  )
}
