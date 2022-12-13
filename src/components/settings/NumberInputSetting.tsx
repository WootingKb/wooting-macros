import {
  HStack,
  VStack,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'

type Props = {
  title: string
  description: string
  defaultValue: number
  onChange: (value: string) => void
}

export default function NumberInputSetting({
  title,
  description,
  defaultValue,
  onChange
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
    <HStack w="100%" justifyContent="space-between" spacing={16}>
      <VStack spacing={0} textAlign="left">
        <Text w="100%" fontSize="md" fontWeight="semibold">
          {title}
        </Text>
        <Text w="100%" fontSize="sm">
          {description}
        </Text>
      </VStack>
      <NumberInput
        w="25%"
        size="sm"
        rounded="md"
        variant="brand"
        step={5}
        value={value}
        onChange={(valueAsString) => setValue(valueAsString)}
        min={1}
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
