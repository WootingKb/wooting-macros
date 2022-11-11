import { Box, Divider, HStack, IconButton } from '@chakra-ui/react'
import { DeleteIcon, DragHandleIcon, EditIcon } from '@chakra-ui/icons'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ActionEventType, SequenceElement } from '../../types'
import { useEffect, useState } from 'react'
import { HIDLookup } from '../../HIDmap'

type Props = {
  element: SequenceElement
}

const SequenceElementDraggableDisplay = ({ element }: Props) => {
  // this component potentially has different styles based on the ActionEventType
  const [displayText, setDisplayText] = useState<string | undefined>('')
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: element.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  useEffect(() => {
    switch (element.data.type) {
      case "KeyPressEvent":
        setDisplayText(HIDLookup.get(element.data.data.keypress)?.displayString)
        break;
      case "Delay":
        setDisplayText("Delay")
        break
      default:
        break;
    }
  }, [element.id])

  return (
    <HStack
      ref={setNodeRef}
      style={style}
      {...attributes}
      w="100%"
      border="1px"
      rounded="md"
      spacing="0px"
    >
      <Box {...listeners} borderRight="1px" p="4px" h="full">
        <DragHandleIcon w={4} h={8} />
      </Box>
      <Box p="4px" pl="8px" w="100%">{displayText}</Box>
      <Divider orientation='vertical' />
      <HStack p="4px" h="full">
        <IconButton aria-label='delete-button' icon={<DeleteIcon/>} size={['xs', 'sm']}></IconButton>
        <IconButton aria-label='edit-button' icon={<EditIcon/>} size={['xs', 'sm']}></IconButton>
      </HStack>
    </HStack>
  )
}

export default SequenceElementDraggableDisplay
