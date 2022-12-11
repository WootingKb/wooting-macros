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
  const buttonBg = useColorModeValue('gray.300', 'gray.700')
  const borderColour = useColorModeValue('gray.400', 'gray.600')

  return (
    <Box
      pos="relative"
      w="100%"
      bg={isFocused ? buttonBg : ''}
      p="4px"
      rounded="md"
      _hover={{ bg: buttonBg }}
    >
      <HStack justifyContent="space-between">
        <Box
          as="button"
          pos="absolute"
          w="full"
          h="full"
          onClick={() => setFocus(index)}
        ></Box>
        {index === 0 ? (
          <Box pl="1" h="full" justifyContent="center" alignItems="center">
            <StarIcon />
          </Box>
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
        <Text noOfLines={1} fontWeight={isFocused ? 'semibold' : 'normal'}>{collection.name}</Text>
        <Switch
          size="sm"
          colorScheme="yellow"
          defaultChecked={collection.active}
          isChecked={collection.active}
          onChange={() => toggleCollection(index)}
        />
      </HStack>
    </Box>
  )
}
