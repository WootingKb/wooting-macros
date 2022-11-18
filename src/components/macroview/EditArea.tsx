import { StarIcon } from '@chakra-ui/icons'
import {
  VStack,
  Text,
  Input,
  Button,
  Flex,
  Grid,
  GridItem,
  Divider,
  useColorModeValue
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useSelectedElement } from '../../contexts/selectors'
import { useSequenceContext } from '../../contexts/sequenceContext'
import { KeyType } from '../../enums'
import { HIDLookup } from '../../maps/HIDmap'

const EditArea = () => {
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0) // this type refers to what kind of element is being edited
  const [delayDuration, setDelayDuration] = useState(0)
  const [headingText, setHeadingText] = useState('')
  const [keypressDuration, setKeypressDuration] = useState(1)
  const [keypressType, setKeypressType] = useState<KeyType>()
  const { selectedElementIndex } = useSequenceContext()
  const selectedElement = useSelectedElement()
  const dividerColour = useColorModeValue('gray.400', 'gray.600')

  useEffect(() => {
    if (selectedElementIndex < 0) {
      return
    }
    switch (selectedElement.type) {
      case 'KeyPressEvent': {
        const typeString: keyof typeof KeyType = selectedElement.data
          .keytype as keyof typeof KeyType
        setKeypressType(KeyType[typeString])
        setKeypressDuration(selectedElement.data.press_duration)
        setHeadingText(
          `Key ${HIDLookup.get(selectedElement.data.keypress)?.displayString}`
        )
        setCurrentTypeIndex(0)
        break
      }
      case 'Delay':
        setDelayDuration(selectedElement.data)
        setHeadingText('Delay Element')
        setCurrentTypeIndex(1)
        break
      default:
        break
    }
  }, [selectedElement])

  const onDelayDurationChange = (event: any) => {
    setDelayDuration(event.target.value)
    // TODO: fix element display in sequencing area not updating when fields are changed
    selectedElement.data = parseInt(event.target.value)
  }

  const onKeypressDurationChange = (event: any) => {
    if (selectedElement.type !== 'KeyPressEvent') {
      return
    }
    setKeypressDuration(event.target.value)
    selectedElement.data.press_duration = parseInt(event.target.value)
  }

  const onKeypressTypeChange = (newType: KeyType) => {
    if (selectedElement.type !== 'KeyPressEvent') {
      return
    }
    setKeypressType(newType)
    selectedElement.data.keytype = KeyType[newType]
  }

  if (selectedElementIndex === -1) {
    return (
      <VStack
        w="25%"
        h="full"
        borderLeft="1px"
        borderColor={dividerColour}
        justifyContent="center"
      >
        <Text
          fontWeight="semibold"
          fontSize={['sm', 'md']}
          w="50%"
          textAlign="center"
        >
          Select an Element to edit
        </Text>
      </VStack>
    )
  }

  if (currentTypeIndex === 1) {
    return (
      <VStack
        w="25%"
        h="full"
        borderLeft="1px"
        borderColor={dividerColour}
        alignItems="center"
        p="3"
      >
        <Text fontWeight="semibold" fontSize={['sm', 'md']}>
          {headingText}
        </Text>
        <Divider borderColor={dividerColour} />
        <Grid templateRows={'20px 1fr'} gap="2" w="100%">
          <GridItem
            w="100%"
            h="8px"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize={['xs', 'sm', 'md']}>Duration (ms)</Text>
          </GridItem>
          <GridItem w="100%">
            <Flex
              gap={['4px']}
              alignItems="center"
              justifyContent="space-around"
            >
              <Input
                variant="outline"
                borderColor="gray.400"
                value={delayDuration}
                onChange={onDelayDurationChange}
              />
            </Flex>
          </GridItem>
        </Grid>
        <Button
          variant="outline"
          w="fit-content"
          colorScheme="yellow"
          onClick={() => setDelayDuration(50)}
        >
          Set to Default
        </Button>
      </VStack>
    )
  }
  // default for keypress
  return (
    <VStack
      w="25%"
      h="full"
      borderLeft="1px"
      borderColor={dividerColour}
      alignItems="center"
      p="3"
    >
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
              onChange={onKeypressDurationChange}
            />
          </Flex>
        </GridItem>
      </Grid>
    </VStack>
  )
}

export default EditArea
