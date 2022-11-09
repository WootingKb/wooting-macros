import { Box, HStack } from '@chakra-ui/react'
import { DragHandleIcon } from '@chakra-ui/icons'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ActionEventType } from '../../types'

type Props = {
  elementID: number
  properties: ActionEventType
}

const SequenceElementDraggableDisplay = ({ elementID, properties }: Props) => {
  // this component potentially has different styles based on the ActionEventType
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: elementID })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <HStack
      ref={setNodeRef}
      style={style}
      {...attributes}
      w="100%"
      border="1px"
      rounded="md"
    >
      <Box {...listeners} borderRight="1px" p="4px">
        <DragHandleIcon w={6} h={8} />
      </Box>
      <Box p="4px">{properties.data.toString() + elementID}</Box>
    </HStack>
  )
}

export default SequenceElementDraggableDisplay
