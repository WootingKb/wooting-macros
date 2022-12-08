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
  const bg = useColorModeValue('white', 'gray.800')
  const dividerColour = useColorModeValue('gray.400', 'gray.600')
  const highlightedColour = useColorModeValue('yellow.500', 'yellow.200')

  return (
    <HStack
      w={element.type === 'DelayEventAction' ? 'fit-content' : '100%'}
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
        borderRight="1px"
        borderColor={
          selectedElementId !== undefined && id === selectedElementId + 1
            ? highlightedColour
            : dividerColour
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
