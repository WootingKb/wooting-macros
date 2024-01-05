import { Box, Button, HStack, useColorModeValue } from '@chakra-ui/react'
import { useState } from 'react'
import { executeMacro } from '../../../constants/utils'
import { Macro, MacroIndividualCommand } from '../../../types'
import useMainBgColour from '../../../hooks/useMainBgColour'

export interface MacroDataInterface {
  macro_data: Macro
}

function execute(macro_data: Macro, action: MacroIndividualCommand) {
  executeMacro({ macro_data }, action).then(() => {
    console.error(action.type, 'macro: ', macro_data.name)
  })
}

export default function MacroStateControls({ macro_data }: MacroDataInterface) {
  const secondBg = useColorModeValue('blue.50', 'gray.900')
  const primaryBg = useMainBgColour()
  const [macroIsRunning, setMacroIsRunning] = useState(false)
  const borderColour = useColorModeValue('gray.400', 'gray.600')

  function StartStopButtons() {
    return (
      <HStack
        border="1px"
        borderColor={borderColour}
        rounded="md"
        spacing="16px"
        p="3"
        position="relative" // Add relative position
      >
        <Button
          variant="yellowGradient"
          isDisabled={macroIsRunning}
          onClick={() => {
            setMacroIsRunning(true)
            execute(macro_data, { type: 'Start' })
          }}
        >
          Start
        </Button>
        <Button
          display="hidden"
          variant="yellowGradient"
          isDisabled={!macroIsRunning}
          onClick={() => {
            setMacroIsRunning(false)
            execute(macro_data, { type: 'Stop' })
          }}
        >
          Stop
        </Button>
        <Box
          position="absolute"
          // left="50%"
          transform="translate(20%, -140%)"
          fontSize="md"
          zIndex="1"
          bgColor={secondBg}
        >
          {'Macro Controls'}
        </Box>
      </HStack>
    )
  }

  function StartButton() {
    return (
      <HStack
        border="1px"
        borderColor={borderColour}
        rounded="md"
        spacing="16px"
        p="3"
        position="relative" // Add relative position
      >
        <Button
          variant="yellowGradient"
          isDisabled={macroIsRunning}
          onClick={() => {
            setMacroIsRunning(true)
            execute(macro_data, { type: 'Start' })
            setTimeout(() => {
              setMacroIsRunning(false)
            }, 3000)
          }}
        >
          Start
        </Button>
        <Box
          position="absolute"
          // left="50%"
          transform="translate(6%, -140%)"
          fontSize="md"
          zIndex="1"
          bgColor={primaryBg}
        >
          {'Controls'}
        </Box>
      </HStack>
    )
  }

  return (
    <>
      {macro_data.macro_type === 'OnHold' && <StartStopButtons />}
      {(macro_data.macro_type === 'Single' ||
        macro_data.macro_type === 'RepeatX' ||
        macro_data.macro_type === 'Toggle') && <StartButton />}
    </>
  )
}
