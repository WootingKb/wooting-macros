import {
  VStack,
  Divider,
  Text,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react'
import { openDiscordLink, openTwitterLink } from '../../constants/externalLinks'
import { SettingsCategory } from '../../enums'
import { SettingsGroup } from '../../maps/SettingsMap'
import SettingsButton from './SettingsButton'
import { type, version } from '@tauri-apps/api/os'
import { getVersion } from '@tauri-apps/api/app'
import { useEffect, useState } from 'react'
import { DiscordIcon, TwitterIcon } from '../icons'

type Props = {
  pageIndex: number
  onSettingsButtonPress: (index: number) => void
}

export default function SettingsLeftPanel({
  pageIndex,
  onSettingsButtonPress
}: Props) {
  const panelBg = useColorModeValue('primary-light.200', 'primary-dark.900')
  const borderColour = useColorModeValue(
    'primary-light.500',
    'primary-dark.500'
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
      css={{
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}
    >
      <VStack w="100%" spacing={1}>
        <Text w="100%" textStyle="miniHeader" ml={4}>
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
      <Divider borderColor={borderColour} />
      <VStack w="100%" spacing={1}>
        <Text w="100%" textStyle="miniHeader" ml={4}>
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
      <Divider borderColor={borderColour} />
      <VStack w="100%" spacing={2} px={1} pt={1}>
        <HStack w="100%">
          <DiscordIcon
            color={strokeColour}
            onClick={openDiscordLink}
            _hover={{
              color: strokeHoverColour,
              cursor: 'pointer',
              transform: 'scale(110%)'
            }}
          />
          <TwitterIcon
            color={strokeColour}
            onClick={openTwitterLink}
            _hover={{
              color: strokeHoverColour,
              cursor: 'pointer',
              transform: 'scale(110%)'
            }}
          />
        </HStack>
        <Text w="100%" fontSize={['xs']}>
          Got Feedback? Let us know through these channels!
        </Text>
        <VStack w="100%" spacing={0}>
          <Text w="100%" fontSize={['2xs']} textColor={applicationTextColour}>
            Version {versionText}
          </Text>
          <Text w="100%" fontSize={['2xs']} textColor={applicationTextColour}>
            {osText}
          </Text>
        </VStack>
      </VStack>
    </VStack>
  )
}
