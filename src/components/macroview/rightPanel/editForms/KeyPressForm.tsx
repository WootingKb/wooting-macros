import {
  Box,
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
import { HIDLookup } from '../../../../constants/HIDmap'
import {
  DownArrowIcon,
  DownUpArrowsIcon,
  ResetDefaultIcon,
  UpArrowIcon
} from '../../../icons'
import { KeyPressEventAction } from '../../../../types'
import { borderRadiusStandard } from '../../../../theme/config'
import { DefaultMacroDelay } from '../../../../constants/utils'

interface Props {
  selectedElementId: number
  selectedElement: KeyPressEventAction
}

export default function KeyPressForm({
  selectedElementId,
  selectedElement
}: Props) {
  const [keypressDuration, setKeypressDuration] = useState(DefaultMacroDelay)
  const [keypressType, setKeypressType] = useState<KeyType>()
  const { updateElement } = useMacroContext()
  const bg = useColorModeValue('primary-light.50', 'primary-dark.700')
  const kebabColour = useColorModeValue('primary-light.500', 'primary-dark.500')
  const toast = useToast()
  const [resetTriggered, setResetTriggered] = useState(false)

  useEffect(() => {
    if (
      selectedElement === undefined ||
      selectedElement.type !== 'KeyPressEventAction'
    )
      return

    const typeString = selectedElement.data.keytype as keyof typeof KeyType
    setKeypressType(KeyType[typeString])
    setKeypressDuration(selectedElement.data.press_duration.toString())
  }, [bg, kebabColour, selectedElement])

  const onKeypressDurationChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setKeypressDuration(event.target.value)
    },
    [setKeypressDuration]
  )

  const onInputBlur = useCallback(() => {
    let duration = 20

    if (Number(keypressDuration) >= 20) {
      duration = Number(keypressDuration)
    } else if (keypressDuration === '') {
      toast({
        title: 'Default duration applied',
        description: 'Applied default duration of 20ms',
        status: 'info',
        duration: 4000,
        isClosable: true
      })
    } else {
      toast({
        title: 'Minimum duration',
        description: 'Duration must be at least 20ms',
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
    keypressDuration,
    selectedElement,
    selectedElementId,
    toast,
    updateElement
  ])

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

  useEffect(() => {
    if (resetTriggered) {
      onInputBlur()
      setResetTriggered(false)
    }
  }, [onInputBlur, resetTriggered])

  const onResetClick = () => {
    setKeypressDuration('')
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
            whiteSpace="nowrap"
            fontWeight="bold"
          >
            {HIDLookup.get(selectedElement.data.keypress)?.displayString}
          </Text>
        </Box>
      </HStack>
      <Divider />
      <Grid templateRows={'20px 1fr'} gap="2" w="full">
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
              placeholder="20"
              variant="brandAccent"
              value={keypressDuration}
              onChange={onKeypressDurationChange}
              onBlur={onInputBlur}
              isInvalid={Number.isNaN(parseInt(keypressDuration))}
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
      )}
    </>
  )
}
