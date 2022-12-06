import { AddIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import {
  HStack,
  VStack,
  Text,
  Divider,
  Radio,
  RadioGroup,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export default function AppearanceSettings() {
  const { colorMode, toggleColorMode } = useColorMode()
  const radioBg = useColorModeValue('gray.100', 'gray.700')
  const [value, setValue] = useState('')

  useEffect(() => {
    if (colorMode === 'light') {
      setValue('light')
    } else {
      setValue('dark')
    }
  }, [colorMode, setValue])

  const onThemeChange = (newValue: string) => {
    if (newValue === colorMode) {
      return
    }
    setValue(newValue)
    toggleColorMode()
  }

  return (
    <VStack w="100%" spacing={4}>
      <VStack w="100%" spacing={4} textAlign="left">
        <Text w="100%" fontSize="md" fontWeight="semibold">
          Theme
        </Text>
        <RadioGroup w="100%" onChange={onThemeChange} value={value}>
          <VStack>
            <HStack w="100%" bg={radioBg} p="4" gap={2} rounded="md">
              <Radio colorScheme="yellow" value={'light'} />
              <SunIcon />
              <Text>Light</Text>
            </HStack>
            <HStack w="100%" bg={radioBg} p="4" gap={2} rounded="md">
              <Radio colorScheme="yellow" value={'dark'} />
              <MoonIcon />
              <Text>Dark</Text>
            </HStack>
            <HStack
              w="100%"
              bg={radioBg}
              p="4"
              gap={2}
              rounded="md"
              opacity="50%"
            >
              <Radio colorScheme="yellow" value={'system'} isDisabled />
              {/** change icon later */}
              <AddIcon />
              <Text>System Theme</Text>
            </HStack>
          </VStack>
        </RadioGroup>
      </VStack>
      <Divider />
      <VStack w="100%" spacing={4} textAlign="left">
        <Text w="100%" fontSize="md" fontWeight="semibold">
          Accent Colour
        </Text>
      </VStack>
    </VStack>
  )
}
