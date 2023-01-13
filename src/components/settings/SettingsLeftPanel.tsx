import {
  VStack,
  Divider,
  Text,
  useColorModeValue,
  HStack,
  Flex
} from '@chakra-ui/react'
import { openDiscordLink, openGithubLink } from '../../constants/externalLinks'
import { SettingsCategory } from '../../constants/enums'
import { SettingsGroup } from '../../constants/SettingsMap'
import SettingsButton from './SettingsButton'
import { type, version } from '@tauri-apps/api/os'
import { getVersion } from '@tauri-apps/api/app'
import { useEffect, useState } from 'react'
import { DiscordIcon, GithubIcon } from '../icons'
import useScrollbarStyles from '../../hooks/useScrollbarStyles'
import useBorderColour from '../../hooks/useBorderColour'

interface Props {
  pageIndex: number
  onSettingsButtonPress: (index: number) => void
}

export default function SettingsLeftPanel({
  pageIndex,
  onSettingsButtonPress
}: Props) {
  const panelBg = useColorModeValue('primary-light.50', 'bg-dark')
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

    getVersion()
      .then((version) => setVersionText(version))
      .catch(console.error)

    getOSType().catch((err) => console.error(err))
  }, [])

  return (
    <Flex
      bg={panelBg}
      borderRight="1px"
      borderColor={useBorderColour()}
      h="100vh"
      px={2}
      py={16}
      minWidth="200px"
      flexGrow={1}
      flexBasis="auto"
      justifyContent="flex-end"
      overflowY="auto"
      sx={useScrollbarStyles()}
    >
      <VStack w="200px" spacing={1}>
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
          <Text w="full" fontSize={{ base: 'xs', md: 'sm' }}>
            Got feedback? Let us know through these channels!
          </Text>
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
            <GithubIcon
              color={strokeColour}
              onClick={openGithubLink}
              _hover={{
                color: strokeHoverColour,
                cursor: 'pointer',
                transform: 'scale(125%)'
              }}
              transition="ease-out 150ms"
            />
          </HStack>
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
    </Flex>
  )
}
