import { Box, Button } from '@chakra-ui/react'
import { Collection } from '../types'

type Props = {
  collection: Collection
  index: number
  isFocused: boolean
  setFocus: (index:number) => void
  toggleCollection: (index:number) => void
}

function CollectionButton({collection, index, isFocused, setFocus, toggleCollection}: Props) {

  return (
    <Box pos="relative" w="100%">
      <Button bg={collection.active ? "gray.300" : "gray.400"} p="4px" rounded="md" w="100%" fontWeight={isFocused ? "bold" : "normal"} onClick={() => setFocus(index)}>{collection.name}</Button>
      <Box as='button' borderRadius='full' bg={collection.active ? "blue.300" : "gray.600"} pos="absolute" top="-2px" right="-2px" w="4" h="4" onClick={() => toggleCollection(index)}></Box>      
    </Box>
  )
}

export default CollectionButton