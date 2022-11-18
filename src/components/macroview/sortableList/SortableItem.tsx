import { RepeatClockIcon, StarIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Divider, HStack, IconButton, Text } from '@chakra-ui/react'

type Props = {
    id: number
    element: any
}

const SortableItem = ({id, element}: Props) => {
  return (
    <HStack>
        <HStack p="4px" px="8px" w="100%">
        {element.isSmall && <RepeatClockIcon />}
        {!element.isSmall && <StarIcon />}
        <Text>{element.text}</Text>
      </HStack>
      <Divider orientation="vertical" />
      <HStack p="4px" h="full">
        <IconButton
          aria-label="delete-button"
          icon={<DeleteIcon />}
          size={['xs', 'sm']}
        //   onClick={onDeleteButtonPress}
        ></IconButton>
        <IconButton
          aria-label="edit-button"
          icon={<EditIcon />}
          size={['xs', 'sm']}
        //   onClick={onEditButtonPress}
        ></IconButton>
      </HStack>
    </HStack>
  )
}

export default SortableItem