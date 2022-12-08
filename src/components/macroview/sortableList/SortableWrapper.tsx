import { ReactNode } from 'react'
import { DragHandleIcon } from '@chakra-ui/icons'
import { HStack, Box, useColorModeValue } from '@chakra-ui/react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMacroContext } from '../../../contexts/macroContext'

type Props = {
  id: number
  isSmall: boolean
  children: ReactNode
}

export default function SortableWrapper({ id, isSmall, children }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: id })
  const { selectedElementId } = useMacroContext()
  const bg = useColorModeValue('white', 'gray.800')
  const dividerColour = useColorModeValue('gray.400', 'gray.600')
  const highlightedColour = useColorModeValue('yellow.500', 'yellow.200')

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
      w={isSmall ? 'fit-content' : '100%'}
      border="1px"
      borderColor={
        selectedElementId !== undefined && id === selectedElementId + 1
          ? highlightedColour
          : dividerColour
      }
      rounded="md"
      spacing="0px"
      bg={bg}
      sx={{ cursor: 'auto' }}
    >
      <Box
        {...listeners}
        borderRight="1px"
        borderColor={
          selectedElementId !== undefined && id === selectedElementId + 1
            ? highlightedColour
            : dividerColour
        }
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
