import { Divider, Grid, GridItem, Input, Button, Text, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { useMacroContext } from '../../../../contexts/macroContext'
import { useSettingsContext } from '../../../../contexts/settingsContext'
import { DelayEventAction } from '../../../../types'

interface Props {
  selectedElementId: number
  selectedElement: DelayEventAction
}

export default function DelayForm({
  selectedElementId,
  selectedElement
}: Props) {
  const [delayDuration, setDelayDuration] = useState("0")
  const { updateElement } = useMacroContext()
  const { config } = useSettingsContext()

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
      duration = 0;
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
    <VStack
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      w="full"
      gap={2}
    >
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
            isInvalid={Number.isNaN(parseInt(delayDuration))}
          />
        </GridItem>
      </Grid>
      <Button variant="brand" w="fit-content" onClick={resetDuration}>
        Set to Default
      </Button>
    </VStack>
  )
}
