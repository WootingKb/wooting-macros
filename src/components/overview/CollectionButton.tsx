import {
  Box,
  HStack,
  Switch,
  Text,
  useColorModeValue,
  Tooltip
} from '@chakra-ui/react'
import { Collection } from '../../types'

type Props = {
  collection: Collection
  index: number
  isFocused: boolean
  isMacroOutputEnabled: boolean
  setFocus: (index: number) => void
  toggleCollection: (index: number) => void
}

export default function CollectionButton({
  collection,
  index,
  isFocused,
  isMacroOutputEnabled,
  setFocus,
  toggleCollection
}: Props) {
  const buttonBg = useColorModeValue('primary-accent.50', 'primary-accent.800')
  const selectedTextColour = useColorModeValue('primary-accent.700', 'primary-accent.400')

  return (
    <Box
      pos="relative"
      w="100%"
      bg={isFocused ? buttonBg : ''}
      p="2"
      rounded="md"
      _hover={{ bg: buttonBg }}
    >
      <HStack justifyContent="space-between">
        <Box
          as="button"
          pos="absolute"
          w="full"
          h="full"
          zIndex={10}
          onClick={() => setFocus(index)}
        ></Box>
        <Box maxHeight="32px">
          <em-emoji shortcodes={collection.icon} size="32px" />
        </Box>
        <Text
          noOfLines={1}
          fontWeight="semibold"
          textColor={isFocused ? selectedTextColour : ''}
        >
          {collection.name}
        </Text>
        <Tooltip
          variant="brand"
          placement="bottom"
          hasArrow
          aria-label="Toggle Collection Switch"
          label={collection.active ? 'Disable Collection' : 'Enable Collection'}
        >
          <Box>
            <Switch
              size="sm"
              variant="brand"
              zIndex={10}
              opacity={isMacroOutputEnabled ? 1 : 0.5}
              defaultChecked={collection.active}
              isChecked={collection.active}
              onChange={() => toggleCollection(index)}
            />
          </Box>
        </Tooltip>
      </HStack>
    </Box>
  )
}
