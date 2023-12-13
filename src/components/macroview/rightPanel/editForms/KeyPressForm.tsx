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
  useColorModeValue
} from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useMacroContext } from '../../../../contexts/macroContext'
import { KeyType } from '../../../../constants/enums'
import { HIDLookup } from '../../../../constants/HIDmap'
import { DownArrowIcon, DownUpArrowsIcon, UpArrowIcon } from '../../../icons'
import { KeyPressEventAction } from '../../../../types'
import { borderRadiusStandard } from '../../../../theme/config'

interface Props {
  selectedElementId: number
  selectedElement: KeyPressEventAction
}

export default function KeyPressForm({
  selectedElementId,
  selectedElement
}: Props) {
  const [headingText, setHeadingText] = useState<JSX.Element | string>('')
  const [keypressDuration, setKeypressDuration] = useState('1')
  const [keypressType, setKeypressType] = useState<KeyType>()
  const { updateElement } = useMacroContext()
  const bg = useColorModeValue('primary-light.50', 'primary-dark.700')
  const kebabColour = useColorModeValue('primary-light.500', 'primary-dark.500')

  useEffect(() => {
    if (
      selectedElement === undefined ||
      selectedElement.type !== 'KeyPressEventAction'
    )
      return

    const typeString = selectedElement.data.key_type as keyof typeof KeyType
    setKeypressType(KeyType[typeString])
    setKeypressDuration(selectedElement.data.press_duration.toString())
    setHeadingText(
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
    )
  }, [selectedElement])

  const onKeypressDurationChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setKeypressDuration(event.target.value)
    },
    [setKeypressDuration]
  )

  const onInputBlur = useCallback(() => {
    let duration
    if (keypressDuration === '') {
      duration = 0
    } else {
      duration = parseInt(keypressDuration)
      if (Number.isNaN(duration)) {
        return
      }
    }

    const temp: KeyPressEventAction = {
      ...selectedElement,
      data: { ...selectedElement.data, press_duration: duration }
    }
    updateElement(temp, selectedElementId)
  }, [keypressDuration, selectedElement, selectedElementId, updateElement])

  const onKeypressTypeChange = useCallback(
    (newType: KeyType) => {
      setKeypressType(newType)
      const temp: KeyPressEventAction = {
        ...selectedElement,
        data: { ...selectedElement.data, key_type: KeyType[newType].toString() }
      }
      updateElement(temp, selectedElementId)
    },
    [selectedElement, selectedElementId, updateElement]
  )

  return (
    <>
      <Text w="full" fontWeight="semibold" fontSize={['sm', 'md']}>
        {headingText}
      </Text>
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
              Duration (ms)
            </Text>
          </GridItem>
          <GridItem w="full">
            <Input
              type="number"
              variant="brandAccent"
              value={keypressDuration}
              onChange={onKeypressDurationChange}
              onBlur={onInputBlur}
              isInvalid={Number.isNaN(parseInt(keypressDuration))}
            />
          </GridItem>
        </Grid>
      )}
    </>
  )
}
