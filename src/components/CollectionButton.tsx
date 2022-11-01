import { Button } from '@chakra-ui/react'
import { Collection } from '../types'

type Props = {
  collection: Collection
  index: number
  onClick: (params:any) => any
}

function CollectionButton({collection, index, onClick}: Props) {

  return (
    <Button bg={collection.active ? "gray.300" : "gray.400"} p="4px" rounded="md" w="100%" fontWeight={collection.active ? "bold" : "normal"} onClick={() => onClick(index)}>{collection.name}</Button>
  )
}

export default CollectionButton