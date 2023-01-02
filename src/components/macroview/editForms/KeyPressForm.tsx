import {
  Divider,
  Grid,
  GridItem,
  Flex,
  Button,
  Input,
  Text
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { useMacroContext } from '../../../contexts/macroContext'
import { useSelectedElement } from '../../../contexts/selectors'
import { KeyType } from '../../../enums'
import { HIDLookup } from '../../../maps/HIDmap'
import { DownArrowIcon, DownUpArrowsIcon, UpArrowIcon } from '../../icons'

export default function KeyPressForm() {
  const [headingText, setHeadingText] = useState('')
  const [keypressDuration, setKeypressDuration] = useState(1)
  const [keypressType, setKeypressType] = useState<KeyType>()
  const selectedElement = useSelectedElement()
  const { selectedElementId, updateElement } = useMacroContext()

  useEffect(() => {
    if (selectedElement === undefined) {
      return
    }

    if (selectedElement.type !== 'KeyPressEventAction') {
      return
    }

    const typeString: keyof typeof KeyType = selectedElement.data
      .keytype as keyof typeof KeyType
    setKeypressType(KeyType[typeString])
    setKeypressDuration(selectedElement.data.press_duration)
    setHeadingText(
      `Key ${HIDLookup.get(selectedElement.data.keypress)?.displayString}`
    )
  }, [selectedElement])

  const onKeypressDurationChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // need to ask about these guards, seems really redundant
      if (
        selectedElement === undefined ||
        selectedElement.type !== 'KeyPressEventAction'
      ) {
        return
      }
      if (selectedElementId === undefined) {
        return
      }
      const newValue = parseInt(event.target.value)
      if (newValue === undefined) {
        return
      }
      setKeypressDuration(newValue)
      const temp = {
        ...selectedElement,
        data: { ...selectedElement.data, press_duration: newValue }
      }
      updateElement(temp, selectedElementId)
    },
    [selectedElement, selectedElementId, updateElement]
  )

  const onKeypressTypeChange = useCallback(
    (newType: KeyType) => {
      if (
        selectedElement === undefined ||
        selectedElement.type !== 'KeyPressEventAction'
      ) {
        return
      }
      if (selectedElementId === undefined) {
        return
      }
      setKeypressType(newType)
      const temp = {
        ...selectedElement,
        data: { ...selectedElement.data, keytype: KeyType[newType].toString() }
      }
      updateElement(temp, selectedElementId)
    },
    [selectedElement, selectedElementId, updateElement]
  )

  return (
    <>
      <Text fontWeight="semibold" fontSize={['sm', 'md']}>
        {headingText}
      </Text>
      <Divider />
      <Grid templateRows={'20px 1fr'} gap="2" w="100%">
        <GridItem w="100%" h="8px" alignItems="center" justifyContent="center">
          <Text fontSize={['xs', 'sm', 'md']} fontWeight="semibold">
            Type of keystroke
          </Text>
        </GridItem>
        <GridItem w="100%">
          <Flex
            flexDir={['column', 'column', 'column', 'row']}
            gap="4px"
            justifyContent="space-around"
          >
            <Button
              variant="brand"
              leftIcon={<DownUpArrowsIcon />}
              w="100%"
              size={['sm', 'md']}
              onClick={() => onKeypressTypeChange(KeyType.DownUp)}
              isActive={keypressType === KeyType.DownUp}
            >
              <Text fontSize={['md', 'md', 'sm']}>Full Press</Text>
            </Button>
            <Button
              variant="brand"
              leftIcon={<DownArrowIcon />}
              w="100%"
              size={['sm', 'md']}
              onClick={() => onKeypressTypeChange(KeyType.Down)}
              isActive={keypressType === KeyType.Down}
            >
              <Text fontSize={['md', 'md', 'sm']}>Key Down</Text>
            </Button>
            <Button
              variant="brand"
              leftIcon={<UpArrowIcon />}
              w="100%"
              size={['sm', 'md']}
              onClick={() => onKeypressTypeChange(KeyType.Up)}
              isActive={keypressType === KeyType.Up}
            >
              <Text fontSize={['md', 'md', 'sm']}>Key Up</Text>
            </Button>
          </Flex>
        </GridItem>
      </Grid>
      <Grid templateRows={'20px 1fr'} gap="2" w="100%">
        <GridItem w="100%" h="8px" alignItems="center" justifyContent="center">
          <Text fontSize={['xs', 'sm', 'md']} fontWeight="semibold">
            Duration (ms)
          </Text>
        </GridItem>
        <GridItem w="100%">
          <Flex gap={['4px']} alignItems="center" justifyContent="space-around">
            <Input
              type="number"
              variant="brand"
              isDisabled={keypressType === KeyType.DownUp ? false : true}
              value={keypressDuration}
              onChange={onKeypressDurationChange}
            />
          </Flex>
        </GridItem>
      </Grid>
    </>
  )
}
