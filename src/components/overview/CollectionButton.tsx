import { Box, HStack, Switch, Text, useColorModeValue } from '@chakra-ui/react'
import { StarIcon } from '@chakra-ui/icons'
import { Collection } from '../../types'

type Props = {
  collection: Collection
  index: number
  isFocused: boolean
  setFocus: (index: number) => void
  toggleCollection: (index: number) => void
}

function CollectionButton({
  collection,
  index,
  isFocused,
  setFocus,
  toggleCollection
}: Props) {
  const buttonBg = useColorModeValue('gray.300', 'gray.700')

  return (
    <Box
      pos="relative"
      w="100%"
      bg={isFocused ? buttonBg : ''}
      p="4px"
      rounded="md"
    >
      <HStack justifyContent="space-between">
        <Box
          as="button"
          pos="absolute"
          w="full"
          h="full"
          onClick={() => setFocus(index)}
        ></Box>
        <StarIcon />
        <Text>{collection.name}</Text>
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

export default CollectionButton
