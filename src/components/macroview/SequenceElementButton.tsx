import { Box, Text, useColorModeValue } from '@chakra-ui/react'
import { useCallback } from 'react'
import { useMacroContext } from '../../contexts/macroContext'
import { useSettingsContext } from '../../contexts/settingsContext'
import { ActionEventType } from '../../types'

type Props = {
  properties: ActionEventType
  displayText: string
}

export default function SequenceElementButton({
  properties,
  displayText
}: Props) {
  const { sequence, onElementAdd, onElementsAdd } = useMacroContext()
  const { config } = useSettingsContext()
  const bg = useColorModeValue('primary-light.200', 'primary-dark.800')
  const textColor = useColorModeValue('bg-dark', 'bg-light')
  const hoverBg = useColorModeValue('primary-light.300', 'primary-dark.700')

  const handleAddElement = useCallback(() => {
    if (config.AutoAddDelay) {
      if (sequence.at(-1)?.type !== 'DelayEventAction' && sequence.length > 0) {
        onElementsAdd([
          {
            type: 'DelayEventAction',
            data: config.DefaultDelayValue
          },
          properties
        ])
      } else {
        onElementAdd(properties)
      }
    } else {
      onElementAdd(properties)
    }
  }, [
    config.AutoAddDelay,
    config.DefaultDelayValue,
    onElementAdd,
    onElementsAdd,
    properties,
    sequence
  ])

  return (
    <Box
      w="full"
      as="button"
      bg={bg}
      _hover={{ bg: hoverBg }}
      _active={{ bg: hoverBg }}
      color={textColor}
      rounded="md"
      onClick={handleAddElement}
      textAlign="center"
      css={{ 'word-break': 'break-all' }}
    >
      <Text fontWeight="semibold" fontSize={['xs', 'sm', 'md']} cursor="pointer">
        {displayText}
      </Text>
    </Box>
  )
}
