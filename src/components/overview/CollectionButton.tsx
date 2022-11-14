import { Box, Button, HStack, Switch, Text } from '@chakra-ui/react'
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
  return (
    <Box
      as="button"
      pos="relative"
      w="100%"
      bg={isFocused ? 'gray.400' : ''}
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
          defaultChecked={collection.active}
          isChecked={collection.active}
          onChange={() => toggleCollection(index)}
        />
      </HStack>
    </Box>
  )
}

export default CollectionButton
