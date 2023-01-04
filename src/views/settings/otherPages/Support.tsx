import { EmailIcon } from '@chakra-ui/icons'
import {
  HStack,
  VStack,
  Text,
  IconButton,
  Divider,
  useColorModeValue
} from '@chakra-ui/react'
import { DiscordIcon } from '../../../components/icons'
import {
  openDiscordLink,
  openSupportEmail
} from '../../../constants/externalLinks'

export default function Support() {
  const iconColour = useColorModeValue('black', 'white')

  return (
    <VStack w="full" spacing={4}>
      <HStack w="full" justifyContent="space-between">
        <VStack spacing="0">
          <Text w="full" fontWeight="semibold">
            Need some help?
          </Text>
          <Text w="full">
            Send us an email or ask us and the community on discord!
          </Text>
        </VStack>
        <HStack>
          <IconButton
            onClick={openSupportEmail}
            variant="brand"
            aria-label="Email link button"
            icon={<EmailIcon />}
          />
          <IconButton
            onClick={openDiscordLink}
            variant="brand"
            aria-label="Discord link button"
            icon={<DiscordIcon color={iconColour} />}
          />
        </HStack>
      </HStack>
      <Divider />
      <Text w="full" fontWeight="semibold">
        Guides
      </Text>
      <Text w="full">Coming soon</Text>
    </VStack>
  )
}
