import { MoonIcon, SunIcon } from '@chakra-ui/icons'
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
import { useCallback, useEffect, useState } from 'react'
import { useSettingsContext } from '../../../contexts/settingsContext'

export default function AppearanceSettings() {
  const [value, setValue] = useState('')
  const { updateTheme } = useSettingsContext()
  const { colorMode } = useColorMode()
  const radioBg = useColorModeValue('gray.100', 'gray.700')
  const radioHoverBg = useColorModeValue('gray.200', 'gray.600')

  useEffect(() => {
    if (colorMode === 'light') {
      setValue('light')
    } else {
      setValue('dark')
    }
  }, [colorMode, setValue])

  const onThemeChange = useCallback(
    (newValue: string) => {
      if (newValue === colorMode) {
        return
      }
      updateTheme(newValue)
    },
    [colorMode, updateTheme]
  )

  return (
    <VStack w="100%" spacing={4}>
      <VStack w="100%" spacing={4} textAlign="left">
        <Text w="100%" fontSize="md" fontWeight="semibold">
          Theme
        </Text>
        <RadioGroup w="100%" value={value}>
          <VStack>
            <HStack
              as="button"
              w="100%"
              bg={radioBg}
              _hover={{ bg: radioHoverBg }}
              p="4"
              gap={2}
              rounded="md"
              onClick={() => onThemeChange('light')}
            >
              <Radio colorScheme="yellow" value={'light'} />
              <SunIcon />
              <Text fontWeight="semibold">Light</Text>
            </HStack>
            <HStack
              as="button"
              w="100%"
              bg={radioBg}
              _hover={{ bg: radioHoverBg }}
              p="4"
              gap={2}
              rounded="md"
              onClick={() => onThemeChange('dark')}
            >
              <Radio colorScheme="yellow" value={'dark'} />
              <MoonIcon />
              <Text fontWeight="semibold">Dark</Text>
            </HStack>
          </VStack>
        </RadioGroup>
      </VStack>
      <Divider />
    </VStack>
  )
}
