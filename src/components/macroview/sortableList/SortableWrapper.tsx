import { ReactNode } from 'react'
import { DragHandleIcon } from '@chakra-ui/icons'
import { HStack, Box, useColorModeValue } from '@chakra-ui/react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ActionEventType } from '../../../types'

type Props = {
  id: number
  element: ActionEventType
  children: ReactNode
}

const SortableWrapper = ({ id, element, children }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: id })
  const bg = useColorModeValue('white', 'gray.800')
  const dividerColour = useColorModeValue('gray.400', 'gray.600')

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1
  }

  return (
    <HStack
      ref={setNodeRef}
      style={style}
      {...attributes}
      w={element.type === 'Delay' ? 'fit-content' : '100%'}
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
        sx={{ cursor: 'grab' }}
      >
        <DragHandleIcon w={4} h={8} />
      </Box>
      {children}
    </HStack>
  )
}

export default SortableWrapper
