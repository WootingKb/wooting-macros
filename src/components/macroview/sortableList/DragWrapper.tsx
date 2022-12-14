import { ReactNode } from 'react'
import { DragHandleIcon } from '@chakra-ui/icons'
import { Box, HStack, useColorModeValue } from '@chakra-ui/react'
import { ActionEventType } from '../../../types'

type Props = {
  id: number
  element: ActionEventType
  children: ReactNode
}

export default function DragWrapper({ id, element, children }: Props) {
  const bg = useColorModeValue('stone.100', 'zinc.900')
  const handleBg = useColorModeValue('yellow.400', 'yellow.400')
  const handleIconColour = useColorModeValue('yellow.500', 'yellow.600')
  const shadowColour = useColorModeValue('md', 'white-md')

  return (
    <HStack
      w={element.type === 'DelayEventAction' ? 'fit-content' : '100%'}
      rounded="md"
      spacing="0px"
      bg={bg}
      shadow={shadowColour}
      sx={{ cursor: 'auto' }}
    >
      <Box
        p="4px"
        h="full"
        bg={handleBg}
        roundedLeft="md"
        sx={{ cursor: 'grabbing' }}
      >
        <DragHandleIcon w={4} h={8} color={handleIconColour} />
      </Box>
      {children}
    </HStack>
  )
}
