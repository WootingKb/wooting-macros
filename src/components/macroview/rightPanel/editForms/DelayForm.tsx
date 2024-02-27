import {
  Button,
  Divider,
  Grid,
  GridItem,
  HStack,
  Input,
  Text,
  useColorModeValue,
  useToast,
  VStack
} from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useMacroContext } from '../../../../contexts/macroContext'
import { DelayEventAction } from '../../../../types'
import { DefaultDelayDelay } from '../../../../constants/utils'
import { ResetDefaultIcon } from '../../../icons'
import { useSettingsContext } from '../../../../contexts/settingsContext'
import { BoxText } from '../EditArea'

interface Props {
  selectedElementId: number
  selectedElement: DelayEventAction
}

export default function DelayForm({
  selectedElementId,
  selectedElement
}: Props) {
  const config = useSettingsContext()
  const [delayDuration, setDelayDuration] = useState(
    config.config.DefaultDelayValue
  )
  const { updateElement } = useMacroContext()
  const bg = useColorModeValue('primary-light.50', 'primary-dark.700')
  const kebabColour = useColorModeValue('primary-light.500', 'primary-dark.500')
  const toast = useToast()

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
      setDelayDuration(Number(event.target.value))
    },
    [setDelayDuration]
  )

  const onInputBlur = useCallback(() => {
    let duration = delayDuration

    if (delayDuration < 1) {
      toast({
        title: 'Minimum duration applied',
        description: 'Applied minimum duration of 1ms',
        status: 'info',
        duration: 4000,
        isClosable: true
      })
      duration = 1
    } else if (Number.isNaN(duration)) {
      return
    }

    const temp: DelayEventAction = {
      ...selectedElement,
      data: duration
    }
    updateElement(temp, selectedElementId)
  }, [delayDuration, selectedElement, selectedElementId, toast, updateElement])

  const onResetClick = useCallback(() => {
    toast({
      title: 'Default duration applied',
      description: `Applied default duration of ${config.config.DefaultDelayValue}ms`,
      status: 'info',
      duration: 4000,
      isClosable: true
    })
    setDelayDuration(config.config.DefaultDelayValue)
    const temp: DelayEventAction = {
      ...selectedElement,
      data: config.config.DefaultDelayValue
    }
    updateElement(temp, selectedElementId)
  }, [
    toast,
    config.config.DefaultDelayValue,
    selectedElement,
    updateElement,
    selectedElementId
  ])

  return (
    <>
      <HStack justifyContent="center" p={1}>
        <Text>Editing element</Text>
        <BoxText>Delay</BoxText>
      </HStack>
      <Divider />
      <Grid templateRows="20px 1fr" gap="2" w="full">
        <GridItem w="full" h="8px" alignItems="center" justifyContent="center">
          <Text fontSize={['xs', 'sm', 'md']}>Duration (ms)</Text>
        </GridItem>
        <VStack w="full">
          <Input
            type="number"
            placeholder={String(DefaultDelayDelay)}
            variant="brandAccent"
            value={delayDuration}
            onChange={onDelayDurationChange}
            onBlur={onInputBlur}
            isInvalid={Number.isNaN(delayDuration)}
          />
          <Button
            variant="brandTertiary"
            leftIcon={<ResetDefaultIcon />}
            w="full"
            value=""
            m={1}
            size={['sm', 'md']}
            onClick={onResetClick}
          >
            <Text fontSize={['sm', 'md']}>Reset to Default</Text>
          </Button>
        </VStack>
      </Grid>
    </>
  )
}
