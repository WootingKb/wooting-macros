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
  const bg = useColorModeValue('stone.100', 'zinc.900')
  const selectedBg = useColorModeValue('stone.200', 'zinc.800')
  const handleBg = useColorModeValue('yellow.400', 'yellow.400')
  const handleIconColour = useColorModeValue('yellow.500', 'yellow.600')
  const shadowColour = useColorModeValue('md', 'white-md')

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
      rounded="md"
      spacing="0px"
      bg={
        selectedElementId !== undefined && id === selectedElementId + 1
          ? selectedBg
          : bg
      }
      shadow={shadowColour}
      sx={{ cursor: 'auto' }}
    >
      <Box
        {...listeners}
        p="4px"
        h="full"
        bg={handleBg}
        roundedLeft="md"
        sx={{ cursor: 'grab' }}
      >
        <DragHandleIcon w={4} h={8} color={handleIconColour} />
      </Box>
      {children}
    </HStack>
  )
}
