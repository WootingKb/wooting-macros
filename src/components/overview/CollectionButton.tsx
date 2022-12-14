import { StarIcon } from '@chakra-ui/icons'
import {
  Box,
  Image,
  HStack,
  Switch,
  Text,
  useColorModeValue,
  Circle
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
  const buttonBg = useColorModeValue('stone.300', 'zinc.800')
  const borderColour = useColorModeValue('stone.500', 'zinc.500')
  const selectedTextColour = useColorModeValue('yellow.700', 'yellow.400')

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
          <Circle position="relative" role="group" pl="1">
            <StarIcon />
          </Circle>
        ) : (
          <Circle position="relative" role="group">
            <Image
              borderRadius="lg"
              border="1px"
              borderColor={borderColour}
              src={collection.icon}
              fallbackSrc="https://via.placeholder.com/125"
              alt="Collection Icon"
              boxSize="25px"
              objectFit="cover"
            />
          </Circle>
        )}
        <Text
          noOfLines={1}
          fontWeight="semibold"
          textColor={isFocused ? selectedTextColour : ''}
        >
          {collection.name}
        </Text>
        <Switch
          size="sm"
          variant="brand"
          zIndex={10}
          defaultChecked={collection.active}
          isChecked={collection.active}
          onChange={() => toggleCollection(index)}
        />
      </HStack>
    </Box>
  )
}
