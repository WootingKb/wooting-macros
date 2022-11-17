import { Box, Divider, HStack, IconButton, Text, useColorModeValue } from '@chakra-ui/react'
import {
  DeleteIcon,
  DragHandleIcon,
  EditIcon,
  StarIcon,
  RepeatClockIcon
} from '@chakra-ui/icons'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SequenceElement } from '../../types'
import { useEffect, useState } from 'react'
import { HIDLookup } from '../../maps/HIDmap'
import { useSequenceContext } from '../../contexts/sequenceContext'

type Props = {
  element: SequenceElement
}

const SequenceElementDraggableDisplay = ({ element }: Props) => {
  const [isSmallVariant, setIsSmallVariant] = useState(false)
  const [displayText, setDisplayText] = useState<string | undefined>('')
  const bg = useColorModeValue("white", "gray.800")
    const dividerColour = useColorModeValue("gray.400", "gray.600")
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
        setIsSmallVariant(false)
        setDisplayText(HIDLookup.get(element.data.data.keypress)?.displayString)
        break
      case 'Delay':
        setIsSmallVariant(true)
        setDisplayText(element.data.data.toString() + ' ms')
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
      w={isSmallVariant ? 'fit-content' : '100%'}
      border="1px"
      borderColor={dividerColour}
      rounded="md"
      spacing="0px"
      bg={bg}
      sx={{ cursor: 'auto' }}
    >
      <Box
        {...listeners}
        borderRight="1px"
        borderColor={dividerColour}
        p="4px"
        h="full"
        sx={isDragging ? { cursor: 'grabbing' } : { cursor: 'grab' }}
      >
        <DragHandleIcon w={4} h={8} />
      </Box>
      <HStack p="4px" px="8px" w="100%">
        {isSmallVariant && <RepeatClockIcon />}
        {!isSmallVariant && <StarIcon />}
        <Text>{displayText}</Text>
      </HStack>
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
