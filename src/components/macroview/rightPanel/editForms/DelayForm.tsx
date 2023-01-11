import { Divider, Grid, GridItem, Input, Button, Text } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { useMacroContext } from '../../../../contexts/macroContext'
import { useSelectedElement } from '../../../../contexts/selectors'
import { useSettingsContext } from '../../../../contexts/settingsContext'
import { ActionEventType } from '../../../../types'

interface Props {
  selectedElementId: number
}

export default function DelayForm({ selectedElementId }: Props) {
  const [delayDuration, setDelayDuration] = useState(0)
  const { updateElement } = useMacroContext()
  const { config } = useSettingsContext()
  const selectedElement = useSelectedElement()

  useEffect(() => {
    if (
      selectedElement === undefined ||
      selectedElement.type !== 'DelayEventAction'
    )
      return

    setDelayDuration(selectedElement.data)
  }, [selectedElement])

  const onDelayDurationChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(event.target.value)
      if (newValue === undefined) {
        return
      }
      setDelayDuration(newValue)
    },
    [setDelayDuration]
  )

  const onInputBlur = useCallback(() => {
    if (selectedElement === undefined) {
      return
    }
    const temp: ActionEventType = {
      ...selectedElement,
      type: 'DelayEventAction',
      data: delayDuration
    }
    updateElement(temp, selectedElementId)
  }, [delayDuration, selectedElement, selectedElementId, updateElement])

  const resetDuration = useCallback(() => {
    if (selectedElement === undefined) {
      return
    }
    setDelayDuration(config.DefaultDelayValue)
    const temp: ActionEventType = {
      ...selectedElement,
      type: 'DelayEventAction',
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
      <Text w="full" fontWeight="semibold" fontSize={['sm', 'md']}>
        Delay Element
      </Text>
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
          />
        </GridItem>
      </Grid>
      <Button variant="brand" w="fit-content" onClick={resetDuration}>
        Set to Default
      </Button>
    </>
  )
}
