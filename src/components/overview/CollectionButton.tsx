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
  setFocus: (index: number) => void
  toggleCollection: (index: number) => void
}

export default function CollectionButton({
  collection,
  index,
  isFocused,
  setFocus,
  toggleCollection
}: Props) {
  const buttonBg = useColorModeValue('primary-light.300', 'primary-dark.800')
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
        {index === 0 ? (
          <Box maxHeight="32px">
            <em-emoji shortcodes=":smile:" size="32px" />
          </Box>
        ) : (
          <Box maxHeight="32px">
            <em-emoji shortcodes={collection.icon} size="32px" />
          </Box>
        )}
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
