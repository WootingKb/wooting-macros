import { Box, Text, Tooltip, useColorModeValue } from '@chakra-ui/react'
import { useCallback } from 'react'
import { useMacroContext } from '../../../contexts/macroContext'
import { useSettingsContext } from '../../../contexts/settingsContext'
import { ActionEventType } from '../../../types'

interface Props {
  properties: ActionEventType
  nameText: string
  descText?: string
}

export default function SelectElementButton({
  properties,
  nameText,
  descText = ''
}: Props) {
  const { sequence, onElementAdd, onElementsAdd } = useMacroContext()
  const { config } = useSettingsContext()
  const bg = useColorModeValue('primary-light.50', 'primary-dark.700')
  const textColor = useColorModeValue('bg-dark', 'bg-light')
  const hoverBg = useColorModeValue('primary-light.100', 'primary-dark.600')
  const borderColour = useColorModeValue(
    'primary-light.300',
    'primary-dark.600'
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
    <Tooltip
      label={descText === '' ? '' : descText}
      hasArrow
      variant="brandSecondary"
      textAlign="center"
    >
      <Box
        w="full"
        h="full"
        as="button"
        bg={bg}
        p={2}
        _hover={{ bg: hoverBg }}
        color={textColor}
        border="1px"
        borderColor={borderColour}
        rounded='md'
        onClick={handleAddElement}
        transition="ease-out 150ms"
      >
        <Text
          w="full"
          fontWeight="semibold"
          fontSize={['sm', 'md', 'md']}
          cursor="pointer"
          overflowWrap="normal"
          wordBreak="break-word"
        >
          {nameText}
        </Text>
      </Box>
    </Tooltip>
  )
}
