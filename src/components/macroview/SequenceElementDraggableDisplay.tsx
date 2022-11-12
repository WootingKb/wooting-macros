import { Box, Divider, HStack, IconButton } from '@chakra-ui/react'
import { DeleteIcon, DragHandleIcon, EditIcon } from '@chakra-ui/icons'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SequenceElement } from '../../types'
import { useEffect, useState } from 'react'
import { HIDLookup } from '../../HIDmap'
import { useSequenceContext } from '../../contexts/sequenceContext'

type Props = {
  element: SequenceElement
}

// TODO:
// 1. variant for Delay Element required

const SequenceElementDraggableDisplay = ({ element }: Props) => {
  const [displayText, setDisplayText] = useState<string | undefined>('')
  const { selectedElementIndex, removeFromSequence, updateElementIndex } =
    useSequenceContext()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: element.id, transition: null })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  useEffect(() => {
    switch (element.data.type) {
      case 'KeyPressEvent':
        setDisplayText(HIDLookup.get(element.data.data.keypress)?.displayString)
        break
      case 'Delay':
        setDisplayText('Delay')
        break
      default:
        break
    }
  }, [element.id])

  const onEditButtonPress = () => {
    if (selectedElementIndex === element.id) {
      return
    }
    updateElementIndex(element.id)
  }

  const onDeleteButtonPress = () => {
    if (selectedElementIndex === element.id) {
      updateElementIndex(0)
    }

    removeFromSequence(element)
  }

  return (
    <HStack
      ref={setNodeRef}
      style={style}
      {...attributes}
      w="100%"
      border="1px"
      rounded="md"
      spacing="0px"
      bg="white"
      sx={{ cursor: 'auto' }}
    >
      <Box
        {...listeners}
        borderRight="1px"
        p="4px"
        h="full"
        sx={isDragging ? { cursor: 'grabbing' } : { cursor: 'grab' }}
      >
        <DragHandleIcon w={4} h={8} />
      </Box>
      <Box p="4px" pl="8px" w="100%">
        {displayText}
      </Box>
      <Divider orientation="vertical" />
      <HStack p="4px" h="full">
        <IconButton
          aria-label="delete-button"
          icon={<DeleteIcon />}
          size={['xs', 'sm']}
          onClick={onDeleteButtonPress}
        ></IconButton>
        <IconButton
          aria-label="edit-button"
          icon={<EditIcon />}
          size={['xs', 'sm']}
          onClick={onEditButtonPress}
        ></IconButton>
      </HStack>
    </HStack>
  )
}

export default SequenceElementDraggableDisplay
