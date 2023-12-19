import { ReactNode } from 'react'
import { DragHandleIcon } from '@chakra-ui/icons'
import { Center, HStack, useColorModeValue } from '@chakra-ui/react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMacroContext } from '../../../../contexts/macroContext'
import useMainBgColour from '../../../../hooks/useMainBgColour'
import { borderRadiusStandard } from '../../../../theme/config'

interface Props {
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
  const bg = useMainBgColour()
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
      rounded={borderRadiusStandard}
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
        roundedLeft={borderRadiusStandard}
        cursor="grab"
      >
        <DragHandleIcon w={4} h={8} color={handleIconColour} />
      </Center>
      {children}
    </HStack>
  )
}
