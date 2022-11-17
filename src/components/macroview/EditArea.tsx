import { StarIcon } from '@chakra-ui/icons'
import { VStack, Text, Input, ButtonGroup, Button, Flex, Select, Grid, GridItem, HStack, Divider } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useSelectedElement } from '../../contexts/selectors'
import { useSequenceContext } from '../../contexts/sequenceContext'
import { DelayUnit, KeyType } from '../../enums'
import { HIDLookup } from '../../maps/HIDmap'
import { ActionEventType } from '../../types'

const EditArea = () => {
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0) // this type refers to what kind of element is being edited
  const [delayDuration, setDelayDuration] = useState(0)
  const [keypressDuration, setKeypressDuration] = useState(1)
  const [keypressType, setKeypressType] = useState<KeyType>()
  const { selectedElementIndex } = useSequenceContext()
  const selectedElement = useSelectedElement()

  useEffect(() => {
    if (selectedElementIndex <= 0) {
      return
    }
    switch (selectedElement.data.type) {
      case 'KeyPressEvent': {
        const typeString: keyof typeof KeyType = selectedElement.data.data.keytype as keyof typeof KeyType
        setKeypressType(KeyType[typeString])
        setKeypressDuration(selectedElement.data.data.press_duration)
        setCurrentTypeIndex(0)
        break        
      }
      case 'Delay':
        setDelayDuration(selectedElement.data.data)
        setCurrentTypeIndex(1)
        break
      default:
        break
    }
  }, [selectedElement])


  const onDelayDurationChange = (event:any) => {
    setDelayDuration(event.target.value)
    // TODO: fix element display in sequencing area not updating when fields are changed
    selectedElement.data.data = parseInt(event.target.value)
  }

  const onKeypressDurationChange = (event:any) => {
    if (selectedElement.data.type !== "KeyPressEvent") {return}
    setKeypressDuration(event.target.value)
    selectedElement.data.data.press_duration = parseInt(event.target.value)
  }

  const onKeypressTypeChange = (newType:KeyType) => {
    if (selectedElement.data.type !== "KeyPressEvent") {return}
    setKeypressType(newType)
    selectedElement.data.data.keytype = KeyType[newType]
  }

  if (selectedElementIndex === 0) {
    return (
      <VStack
        w="25%"
        h="full"
        borderLeft="1px"
        borderColor="gray.200"
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
    return(
      <VStack w="25%" h="full" borderLeft="1px" borderColor="gray.200" alignItems="normal" p="8px">
        <Text fontWeight="semibold" fontSize={['sm', 'md']}>
          {selectedElement.data.type  + " Element"}
        </Text>
        <Divider borderColor="gray.300"/>
        <Grid templateRows={'20px 1fr'} gap="1">
          <GridItem w='100%' h="8px" alignItems="center" justifyContent="center">
            <Text fontSize={['xs', 'sm', 'md']}>Duration (ms)</Text>
          </GridItem>
          <GridItem w='100%'>
            <Flex gap={['4px']} alignItems="center" justifyContent="space-around">
              <Input
                variant="outline"
                borderColor="gray.400"
                value={delayDuration} onChange={onDelayDurationChange}
              />
            </Flex>
          </GridItem>
        </Grid>

        <Button variant="outline" colorScheme='blue' onClick={() => setDelayDuration(50)}>Set to Default</Button>
      </VStack>
    )
  }
  // default for keypress
  return (
      <VStack w="25%" h="full" borderLeft="1px" borderColor="gray.200" alignItems="normal" p="8px">
        <Text fontWeight="semibold" fontSize={['sm', 'md']}>
          {selectedElement.data.type + " Element"}
        </Text>
        <Divider borderColor="gray.300"/>
        <Grid templateRows={'20px 1fr'} gap="1">
          <GridItem w='100%' h="8px" alignItems="center" justifyContent="center">
            <Text fontSize={['xs', 'sm', 'md']}>Type of keystroke</Text>
          </GridItem>
          <GridItem w='100%'>
            <Flex flexDir={['column', 'row']} gap="4px" justifyContent="space-around">
              <Button leftIcon={<StarIcon/>} w="100%" size={['sm', 'md', 'lg']} onClick={() => onKeypressTypeChange(KeyType.DownUp)} isActive={keypressType === KeyType.DownUp}>Full Press</Button>
              <Button leftIcon={<StarIcon/>} w="100%" size={['sm', 'md', 'lg']} onClick={() => onKeypressTypeChange(KeyType.Down)} isActive={keypressType === KeyType.Down}>Key Down</Button>
              <Button leftIcon={<StarIcon/>} w="100%" size={['sm', 'md', 'lg']} onClick={() => onKeypressTypeChange(KeyType.Up)} isActive={keypressType === KeyType.Up}>Key Up</Button>
            </Flex>
          </GridItem>
        </Grid>
        <Grid templateRows={'20px 1fr'} gap="1">
          <GridItem w='100%' h="8px" alignItems="center" justifyContent="center">
            <Text fontSize={['xs', 'sm', 'md']}>Duration (ms)</Text>
          </GridItem>
          <GridItem w='100%'>
            <Flex gap={['4px']} alignItems="center" justifyContent="space-around">
              <Input
                variant="outline"
                borderColor="gray.400"
                isDisabled={keypressType === KeyType.DownUp ? false : true}
                value={keypressDuration} onChange={onKeypressDurationChange}
              />
            </Flex>
          </GridItem>
        </Grid>
      </VStack>
  )
}

export default EditArea
