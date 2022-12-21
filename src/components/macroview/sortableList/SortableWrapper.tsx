import { ReactNode } from 'react'
import { DragHandleIcon } from '@chakra-ui/icons'
import { HStack, useColorModeValue, Center } from '@chakra-ui/react'
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
  const bg = useColorModeValue('primary-light.100', 'primary-dark.900')
  const selectedBg = useColorModeValue('primary-light.200', 'primary-dark.800')
  const handleBg = useColorModeValue('primary-accent.300', 'primary-accent.400')
  const handleIconColour = useColorModeValue(
    'primary-accent.600',
    'primary-accent.700'
  )
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
      <Center
        {...listeners}
        p={2}
        h="full"
        bg={handleBg}
        roundedLeft="md"
        sx={{ cursor: 'grab' }}
      >
        <DragHandleIcon w={4} h={8} color={handleIconColour} />
      </Center>
      {children}
    </HStack>
  )
}
