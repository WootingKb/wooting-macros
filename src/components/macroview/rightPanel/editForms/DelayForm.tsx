import {
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  HStack,
  Input,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useMacroContext } from '../../../../contexts/macroContext'
import { useSettingsContext } from '../../../../contexts/settingsContext'
import { DelayEventAction } from '../../../../types'
import { borderRadiusStandard } from '../../../../theme/config'

interface Props {
  selectedElementId: number
  selectedElement: DelayEventAction
}

export default function DelayForm({
  selectedElementId,
  selectedElement
}: Props) {
  const [delayDuration, setDelayDuration] = useState('0')
  const { updateElement } = useMacroContext()
  const { config } = useSettingsContext()
  const bg = useColorModeValue('primary-light.50', 'primary-dark.700')
  const kebabColour = useColorModeValue('primary-light.500', 'primary-dark.500')

  useEffect(() => {
    if (
      selectedElement === undefined ||
      selectedElement.type !== 'DelayEventAction'
    )
      return

    setDelayDuration(selectedElement.data.toString())
  }, [selectedElement])

  const onDelayDurationChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDelayDuration(event.target.value)
    },
    [setDelayDuration]
  )

  const onInputBlur = useCallback(() => {
    let duration
    if (delayDuration === '') {
      duration = 0
    } else {
      duration = parseInt(delayDuration)
      if (Number.isNaN(duration)) {
        return
      }
    }

    const temp: DelayEventAction = {
      ...selectedElement,
      data: duration
    }
    updateElement(temp, selectedElementId)
  }, [delayDuration, selectedElement, selectedElementId, updateElement])

  const resetDuration = useCallback(() => {
    setDelayDuration(config.DefaultDelayValue.toString())
    const temp: DelayEventAction = {
      ...selectedElement,
      data: config.DefaultDelayValue
    }
    updateElement(temp, selectedElementId)
  }, [
    config.DefaultDelayValue,
    selectedElement,
    selectedElementId,
    updateElement
  ])

  return (
    <>
      <HStack justifyContent="center">
        <Text>Editing element</Text>
        <Box
          h="32px"
          w="fit-content"
          bg={bg}
          border="1px solid"
          py={1}
          px={3}
          borderColor={kebabColour}
          rounded={borderRadiusStandard}
        >
          <Text
            w="fit-content"
            fontSize="sm"
            fontWeight="bold"
            whiteSpace="nowrap"
          >
            {'Delay'}
          </Text>
        </Box>
      </HStack>
      <Divider />
      <Grid templateRows={'20px 1fr'} gap="2" w="full">
        <GridItem w="full" h="8px" alignItems="center" justifyContent="center">
          <Text fontSize={['xs', 'sm', 'md']}>Duration (ms)</Text>
        </GridItem>
        <GridItem w="full">
          <Input
            type="number"
            variant="brandAccent"
            value={delayDuration}
            onChange={onDelayDurationChange}
            onBlur={onInputBlur}
            isInvalid={Number.isNaN(parseInt(delayDuration))}
          />
        </GridItem>
      </Grid>
      <Button variant="brand" w="fit-content" onClick={resetDuration}>
        Set to Default
      </Button>
    </>
  )
}
