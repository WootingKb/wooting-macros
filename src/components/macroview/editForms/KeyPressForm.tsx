import { StarIcon } from '@chakra-ui/icons'
import {
  Divider,
  Grid,
  GridItem,
  Flex,
  Button,
  Input,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useMacroContext } from '../../../contexts/macroContext'
import { useSelectedElement } from '../../../contexts/selectors'
import { KeyType } from '../../../enums'
import { HIDLookup } from '../../../maps/HIDmap'

const KeyPressForm = () => {
  const [headingText, setHeadingText] = useState('')
  const [keypressDuration, setKeypressDuration] = useState(1)
  const [keypressType, setKeypressType] = useState<KeyType>()
  const selectedElement = useSelectedElement()
  const { selectedElementId, updateElement } = useMacroContext()
  const dividerColour = useColorModeValue('gray.400', 'gray.600')

  useEffect(() => {
    if (selectedElement === undefined) {
      return
    }

    if (selectedElement.type !== 'KeyPressEvent') {
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

  const onKeypressDurationChange = (newVal: number) => {
    // need to ask about these guards, seems really redundant
    if (selectedElement === undefined) {
      return
    }
    if (selectedElement.type !== 'KeyPressEvent') {
      return
    }
    if (selectedElementId === undefined) {
      return
    }
    setKeypressDuration(newVal)
    const temp = { ...selectedElement }
    temp.data.press_duration = newVal
    updateElement(temp, selectedElementId)
  }

  const onKeypressTypeChange = (newType: KeyType) => {
    if (selectedElement === undefined) {
      return
    }
    if (selectedElement.type !== 'KeyPressEvent') {
      return
    }
    if (selectedElementId === undefined) {
      return
    }
    setKeypressType(newType)
    const temp = { ...selectedElement }
    temp.data.keytype = KeyType[newType]
    updateElement(temp, selectedElementId)
  }

  return (
    <>
      <Text fontWeight="semibold" fontSize={['sm', 'md']}>
        {headingText}
      </Text>
      <Divider borderColor={dividerColour} />
      <Grid templateRows={'20px 1fr'} gap="2" w="100%">
        <GridItem w="100%" h="8px" alignItems="center" justifyContent="center">
          <Text fontSize={['xs', 'sm', 'md']}>Type of keystroke</Text>
        </GridItem>
        <GridItem w="100%">
          <Flex
            flexDir={['column', 'column', 'column', 'row']}
            gap="4px"
            justifyContent="space-around"
          >
            <Button
              leftIcon={<StarIcon />}
              w="100%"
              size={['sm', 'md']}
              onClick={() => onKeypressTypeChange(KeyType.DownUp)}
              isActive={keypressType === KeyType.DownUp}
            >
              <Text fontSize={['md', 'md', 'sm']}>Full Press</Text>
            </Button>
            <Button
              leftIcon={<StarIcon />}
              w="100%"
              size={['sm', 'md']}
              onClick={() => onKeypressTypeChange(KeyType.Down)}
              isActive={keypressType === KeyType.Down}
            >
              <Text fontSize={['md', 'md', 'sm']}>Key Down</Text>
            </Button>
            <Button
              leftIcon={<StarIcon />}
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
      <Grid templateRows={'20px 1fr'} gap="2">
        <GridItem w="100%" h="8px" alignItems="center" justifyContent="center">
          <Text fontSize={['xs', 'sm', 'md']}>Duration (ms)</Text>
        </GridItem>
        <GridItem w="100%">
          <Flex gap={['4px']} alignItems="center" justifyContent="space-around">
            <Input
              variant="outline"
              borderColor="gray.400"
              isDisabled={keypressType === KeyType.DownUp ? false : true}
              value={keypressDuration}
              onChange={(event) =>
                onKeypressDurationChange(parseInt(event.target.value) || 0)
              }
            />
          </Flex>
        </GridItem>
      </Grid>
    </>
  )
}

export default KeyPressForm