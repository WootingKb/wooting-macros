import { Box, Button, HStack, useColorModeValue } from '@chakra-ui/react'
import { useState } from 'react'
import { MacroType } from "../../../constants/enums";

export default function MacroStateControls(macro_type: MacroType) {
  const secondBg = useColorModeValue('blue.50', 'gray.900')
  const [macroIsRunning, setMacroIsRunning] = useState(false)
  const borderColour = useColorModeValue('gray.400', 'gray.600')
  console.warn(macro_type)
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