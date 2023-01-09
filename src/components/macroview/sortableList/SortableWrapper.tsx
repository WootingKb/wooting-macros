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

export default function SortableWrapper({
  id,
  isSmall,
  children,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: id })
  const { selectedElementId } = useMacroContext()
  const bg = useColorModeValue('bg-light', 'primary-dark.900')
  const selectedBg = useColorModeValue(
    'primary-accent.200',
    'primary-accent.800'
  )
  const handleBg = useColorModeValue('primary-accent.100', 'primary-accent.300')
  const handleIconColour = useColorModeValue(
    'primary-accent.700',
    'primary-accent.800'
  )
  const shadowColour = useColorModeValue('sm', 'white-sm')

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
      w={isSmall ? 'fit-content' : 'full'}
      rounded="md"
      spacing="0px"
      bg={
        selectedElementId !== undefined && id === selectedElementId + 1
          ? selectedBg
          : bg
      }
      shadow={shadowColour}
    >
      <Center
        {...listeners}
        py={2}
        px={4}
        h="full"
        bg={handleBg}
        roundedLeft="md"
        cursor="grab"
      >
        <DragHandleIcon w={4} h={8} color={handleIconColour} />
      </Center>
      {children}
    </HStack>
  )
}
