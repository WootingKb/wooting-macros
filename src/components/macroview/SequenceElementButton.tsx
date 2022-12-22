import { Button, Text, useColorModeValue } from '@chakra-ui/react'
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
  const borderColour = useColorModeValue(
    'primary-light.500',
    'primary-dark.500'
  )

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
    <Button
      variant="brand"
      w="full"
      size={['sm']}
      onClick={handleAddElement}
      border="1px"
      borderColor={borderColour}
    >
      <Text fontSize={['xs', 'sm', 'md']}>{displayText}</Text>
    </Button>
  )
}
