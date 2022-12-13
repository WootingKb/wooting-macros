import { ReactNode } from 'react'
import { DragHandleIcon } from '@chakra-ui/icons'
import { Box, HStack, useColorModeValue } from '@chakra-ui/react'
import { ActionEventType } from '../../../types'
import { useMacroContext } from '../../../contexts/macroContext'

type Props = {
  id: number
  element: ActionEventType
  children: ReactNode
}

export default function DragWrapper({ id, element, children }: Props) {
  const { selectedElementId } = useMacroContext()
  const bg = useColorModeValue('stone.100', 'zinc.900')
  const borderColour = useColorModeValue('stone.500', 'zinc.500')
  const highlightedColour = useColorModeValue('yellow.500', 'yellow.400')

  return (
    <HStack
      w={element.type === 'DelayEventAction' ? 'fit-content' : '100%'}
      border="1px"
      borderColor={
        selectedElementId !== undefined && id === selectedElementId + 1
          ? highlightedColour
          : borderColour
      }
      rounded="md"
      spacing="0px"
      bg={bg}
      sx={{ cursor: 'auto' }}
    >
      <Box
        borderRight="1px"
        borderColor={
          selectedElementId !== undefined && id === selectedElementId + 1
            ? highlightedColour
            : borderColour
        }
        p="4px"
        h="full"
        sx={{ cursor: 'grabbing' }}
      >
        <DragHandleIcon w={4} h={8} />
      </Box>
      {children}
    </HStack>
  )
}
