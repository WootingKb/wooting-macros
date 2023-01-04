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
  const radioBg = useColorModeValue('primary-light.50', 'primary-dark.800')
  const radioHoverBg = useColorModeValue(
    'primary-light.100',
    'primary-dark.700'
  )

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
              <Radio colorScheme="primary-accent" value={'light'} variant="brand" />
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
              <Radio colorScheme="primary-accent" value={'dark'} variant="brand" />
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
