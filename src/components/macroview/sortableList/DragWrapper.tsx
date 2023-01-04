import { ReactNode } from 'react'
import { DragHandleIcon } from '@chakra-ui/icons'
import { Center, HStack, useColorModeValue } from '@chakra-ui/react'
import { ActionEventType } from '../../../types'
import { useMacroContext } from '../../../contexts/macroContext'

type Props = {
  id: number
  element: ActionEventType
  children: ReactNode
}

export default function DragWrapper({ id, element, children }: Props) {
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

  return (
    <HStack
      w={element.type === 'DelayEventAction' ? 'fit-content' : 'full'}
      rounded="md"
      spacing="0px"
      bg={
        selectedElementId !== undefined && id === selectedElementId + 1
          ? selectedBg
          : bg
      }
      shadow={shadowColour}
    >
      <Center p={2} h="full" bg={handleBg} roundedLeft="md" cursor="grab">
        <DragHandleIcon w={4} h={8} color={handleIconColour} />
      </Center>
      {children}
    </HStack>
  )
}
