import {
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  HStack,
  Input,
  Text,
  useColorModeValue,
  useToast, VStack
} from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useMacroContext } from '../../../../contexts/macroContext'
import { useSettingsContext } from '../../../../contexts/settingsContext'
import { DelayEventAction } from '../../../../types'
import { borderRadiusStandard } from '../../../../theme/config'
import { DefaultDelayDelay } from "../../../../constants/utils";
import { ResetDefaultIcon } from "../../../icons";

interface Props {
  selectedElementId: number
  selectedElement: DelayEventAction
}

export default function DelayForm({
  selectedElementId,
  selectedElement
}: Props) {
  const [delayDuration, setDelayDuration] = useState(DefaultDelayDelay)
  const { updateElement } = useMacroContext()
  const { config } = useSettingsContext()
  const bg = useColorModeValue('primary-light.50', 'primary-dark.700')
  const kebabColour = useColorModeValue('primary-light.500', 'primary-dark.500')
  const toast = useToast()
  const [resetTriggered, setResetTriggered] = useState(false)

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
    let duration = Number(delayDuration)

    if (delayDuration === '') {
      toast({
        title: 'Default duration applied',
        description: 'Applied default duration of 20ms',
        status: 'info',
        duration: 4000,
        isClosable: true
      })
      duration = 20
    } else if (Number(delayDuration) < 1) {
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
  }, [delayDuration, selectedElement, selectedElementId, updateElement])

  // const resetDuration = useCallback(() => {
  //   setDelayDuration(config.DefaultDelayValue.toString())
  //   const temp: DelayEventAction = {
  //     ...selectedElement,
  //     data: config.DefaultDelayValue
  //   }
  //   updateElement(temp, selectedElementId)
  // }, [
  //   config.DefaultDelayValue,
  //   selectedElement,
  //   selectedElementId,
  //   updateElement
  // ])

  useEffect(() => {
    if (resetTriggered) {
      onInputBlur()
      setResetTriggered(false)
    }
  }, [resetTriggered])

  const onResetClick = () => {
    setDelayDuration('')
    setResetTriggered(true)
  }

  return (
    <>
      <HStack justifyContent="center" p={1}>
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
            fontSize={['sm', 'md', 'md']}
            w="fit-content"
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
        <VStack w="full">
          <Input
            type="number"
            placeholder={DefaultDelayDelay}
            variant="brandAccent"
            value={delayDuration}
            onChange={onDelayDurationChange}
            onBlur={onInputBlur}
            isInvalid={Number.isNaN(parseInt(delayDuration))}
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
            <Text fontSize={['md', 'md', 'sm']}>Reset to Default</Text>
          </Button>
        </VStack>
      </Grid>
    </>
  )
}
