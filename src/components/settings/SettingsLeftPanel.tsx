import {
  VStack,
  Divider,
  Text,
  useColorModeValue,
  HStack,
  useColorMode
} from '@chakra-ui/react'
import { openDiscordLink, openTwitterLink } from '../../constants/externalLinks'
import { SettingsCategory } from '../../enums'
import { SettingsGroup } from '../../maps/SettingsMap'
import SettingsButton from './SettingsButton'
import { type, version } from '@tauri-apps/api/os'
import { getVersion } from '@tauri-apps/api/app'
import { useEffect, useState } from 'react'
import { DiscordIcon, TwitterIcon } from '../icons'
import {
  scrollbarStylesLight,
  scrollbarsStylesDark
} from '../../constants/utils'

type Props = {
  pageIndex: number
  onSettingsButtonPress: (index: number) => void
}

export default function SettingsLeftPanel({
  pageIndex,
  onSettingsButtonPress
}: Props) {
  const { colorMode } = useColorMode()
  const panelBg = useColorModeValue('primary-light.50', 'bg-dark')
  const borderColour = useColorModeValue(
    'primary-light.100',
    'primary-dark.700'
  )
  const [osText, setOsText] = useState<string | undefined>(undefined)
  const [versionText, setVersionText] = useState<string | undefined>(undefined)
  const applicationTextColour = useColorModeValue(
    'primary-light.500',
    'primary-dark.400'
  )
  const strokeColour = useColorModeValue('bg-dark', 'bg-light')
  const strokeHoverColour = useColorModeValue(
    'primary-accent.600',
    'primary-accent.400'
  )

  useEffect(() => {
    const getOSType = async () => {
      const os = await type()
      const osVersion = await version()
      switch (os) {
        case 'Linux':
          setOsText(`${os} (${osVersion})`)
          break
        case 'Darwin':
          setOsText(`${os} (${osVersion})`)
          break
        case 'Windows_NT':
          setOsText(`Windows (${osVersion})`)
          break

        default:
          break
      }
    }

    const getAppVersionText = async () => {
      await getVersion().then((version) => setVersionText(version))
    }

    getOSType().catch((err) => console.error(err))
    getAppVersionText().catch((err) => console.error(err))
  }, [])

  return (
    <VStack
      bg={panelBg}
      borderRight="1px"
      borderColor={borderColour}
      h="100vh"
      p={2}
      pt={4}
      w={['25%']}
      overflowY="auto"
      sx={colorMode === 'light' ? scrollbarStylesLight : scrollbarsStylesDark}
    >
      <VStack w="full" spacing={1}>
        <Text w="full" textStyle="miniHeader" ml={4}>
          General Settings
        </Text>
        {SettingsGroup.all
          .filter((setting) => setting.category === SettingsCategory.General)
          .map((setting) => (
            <SettingsButton
              setting={setting}
              index={setting.pageIndex}
              key={setting.displayString}
              isFocused={pageIndex == setting.pageIndex}
              setFocus={onSettingsButtonPress}
            />
          ))}
      </VStack>
      <Divider />
      <VStack w="full" spacing={1}>
        <Text w="full" textStyle="miniHeader" ml={4}>
          Other
        </Text>
        {SettingsGroup.all
          .filter((setting) => setting.category === SettingsCategory.Other)
          .map((setting) => (
            <SettingsButton
              setting={setting}
              index={setting.pageIndex}
              key={setting.displayString}
              isFocused={pageIndex == setting.pageIndex}
              setFocus={onSettingsButtonPress}
            />
          ))}
      </VStack>
      <Divider />
      <VStack w="full" spacing={2} px={1} pt={1}>
        <HStack w="full">
          <DiscordIcon
            color={strokeColour}
            onClick={openDiscordLink}
            _hover={{
              color: strokeHoverColour,
              cursor: 'pointer',
              transform: 'scale(125%)'
            }}
            transition="ease-out 150ms"
          />
          <TwitterIcon
            color={strokeColour}
            onClick={openTwitterLink}
            _hover={{
              color: strokeHoverColour,
              cursor: 'pointer',
              transform: 'scale(125%)'
            }}
            transition="ease-out 150ms"
          />
        </HStack>
        <Text w="full" fontSize={{ base: 'xs', md: 'sm' }}>
          Got Feedback? Let us know through these channels!
        </Text>
        <VStack w="full" spacing={0}>
          <Text
            w="full"
            fontSize={{ base: '2xs', md: 'xs' }}
            textColor={applicationTextColour}
          >
            Version {versionText}
          </Text>
          <Text
            w="full"
            fontSize={{ base: '2xs', md: 'xs' }}
            textColor={applicationTextColour}
          >
            {osText}
          </Text>
        </VStack>
      </VStack>
    </VStack>
  )
}
