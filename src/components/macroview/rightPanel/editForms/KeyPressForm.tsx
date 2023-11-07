import {
  Button,
  Divider,
  Flex,
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
import { KeyType } from '../../../../constants/enums'
import {
  DownArrowIcon,
  DownUpArrowsIcon,
  ResetDefaultIcon,
  UpArrowIcon
} from '../../../icons'
import { KeyPressEventAction } from '../../../../types'

import { BoxText } from '../EditArea'
import { HIDLookup } from '../../../../constants/HIDmap'
import { DefaultMacroDelay } from "../../../../constants";
import { useSettingsContext } from "../../../../contexts/settingsContext";

interface Props {
  selectedElementId: number
  selectedElement: KeyPressEventAction
}

export default function KeyPressForm({
  selectedElementId,
  selectedElement
}: Props) {
  const config = useSettingsContext()
  const [keypressDuration, setKeypressDuration] = useState(
    config.config.DefaultElementDurationValue
  )
  const [keypressType, setKeypressType] = useState<KeyType>()
  const { updateElement } = useMacroContext()
  const bg = useColorModeValue('primary-light.50', 'primary-dark.700')
  const kebabColour = useColorModeValue('primary-light.500', 'primary-dark.500')
  const toast = useToast()

  useEffect(() => {
    if (
      selectedElement === undefined ||
      selectedElement.type !== 'KeyPressEventAction'
    )
      return

    const typeString = selectedElement.data.keytype as keyof typeof KeyType
    setKeypressType(KeyType[typeString])
    setKeypressDuration(keypressDuration)
  }, [bg, kebabColour, selectedElement, keypressDuration])

  const onKeypressDurationChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setKeypressDuration(Number(event.target.value))
    },
    [setKeypressDuration]
  )

  const onInputBlur = useCallback(() => {
    let duration = DefaultMacroDelay

    if (keypressDuration >= DefaultMacroDelay) {
      duration = keypressDuration
    } else {
      toast({
        title: 'Minimum duration',
        description: `Duration must be at least ${DefaultMacroDelay}ms`,
        status: 'warning',
        duration: 4000,
        isClosable: true
      })
      if (Number.isNaN(duration)) {
        return
      }
    }

    const temp: KeyPressEventAction = {
      ...selectedElement,
      data: {...selectedElement.data, press_duration: duration}
    }
    updateElement(temp, selectedElementId)
  }, [
    config.config.DefaultElementDurationValue,
    keypressDuration,
    selectedElement,
    selectedElementId,
    toast,
    updateElement
  ])

  const onResetClick = useCallback(() => {
    toast({
      title: 'Default duration applied',
      description: `Applied default duration of ${DefaultMacroDelay}ms`,
      status: 'info',
      duration: 4000,
      isClosable: true
    })

    setKeypressDuration(DefaultMacroDelay)

    const temp: KeyPressEventAction = {
      ...selectedElement,
      data: { ...selectedElement.data, press_duration: DefaultMacroDelay }
    }
    updateElement(temp, selectedElementId)
  }, [toast, selectedElement, updateElement, selectedElementId])

  const onKeypressTypeChange = useCallback(
    (newType: KeyType) => {
      setKeypressType(newType)
      const temp: KeyPressEventAction = {
        ...selectedElement,
        data: { ...selectedElement.data, keytype: KeyType[newType].toString() }
      }
      updateElement(temp, selectedElementId)
    },
    [selectedElement, selectedElementId, updateElement]
  )

  return (
    <>
      <HStack justifyContent="center" p={1}>
        <BoxText>
          {HIDLookup.get(selectedElement.data.keypress)?.displayString ?? ''}
        </BoxText>
      </HStack>
      <Divider />
      <Grid templateRows="20px 1fr" gap="2" w="full">
        <GridItem w="full" h="8px" alignItems="center" justifyContent="center">
          <Text fontSize={['xs', 'sm', 'md']} fontWeight="semibold">
            Type of keystroke
          </Text>
        </GridItem>
        <GridItem w="full">
          <Flex
            flexDir={['column', 'column', 'column', 'row']}
            gap="4px"
            justifyContent="space-around"
          >
            <Button
              variant="brandTertiary"
              leftIcon={<DownUpArrowsIcon />}
              w="full"
              size={['sm', 'md']}
              onClick={() => onKeypressTypeChange(KeyType.DownUp)}
              isActive={keypressType === KeyType.DownUp}
            >
              <Text fontSize={['md', 'md', 'sm']}>Full Press</Text>
            </Button>
            <Button
              variant="brandTertiary"
              leftIcon={<DownArrowIcon />}
              w="full"
              size={['sm', 'md']}
              onClick={() => onKeypressTypeChange(KeyType.Down)}
              isActive={keypressType === KeyType.Down}
            >
              <Text fontSize={['md', 'md', 'sm']}>Key Down</Text>
            </Button>
            <Button
              variant="brandTertiary"
              leftIcon={<UpArrowIcon />}
              w="full"
              size={['sm', 'md']}
              onClick={() => onKeypressTypeChange(KeyType.Up)}
              isActive={keypressType === KeyType.Up}
            >
              <Text fontSize={['md', 'md', 'sm']}>Key Up</Text>
            </Button>
          </Flex>
        </GridItem>
      </Grid>
      {keypressType === KeyType.DownUp && (
        <Grid templateRows="20px 1fr" gap={2} w="full">
          <GridItem
            w="full"
            h="8px"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize={['xs', 'sm', 'md']} fontWeight="semibold">
              Duration (ms) - 20ms minimum
            </Text>
          </GridItem>
          <VStack w="full">
            <Input
              type="number"
              placeholder={String(DefaultMacroDelay)}
              variant="brandAccent"
              value={keypressDuration}
              onChange={onKeypressDurationChange}
              onBlur={onInputBlur}
              isInvalid={Number.isNaN(keypressDuration)}
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
      )}
    </>
  )
}
