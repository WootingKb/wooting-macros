import { VStack, Text, Input, ButtonGroup, Button, Flex, Select, Grid, GridItem } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useSelectedElement } from '../../contexts/selectors'
import { useSequenceContext } from '../../contexts/sequenceContext'
import { DelayUnit } from '../../enums'
import { HIDLookup } from '../../maps/HIDmap'
import { ActionEventType } from '../../types'

const EditArea = () => {
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0)
  const [displayText, setDisplayText] = useState<string | undefined>('')
  const [delayDuration, setDelayDuration] = useState<number>(0)
  const [delayUnit, setDelayUnit] = useState<DelayUnit>(DelayUnit.Milliseconds)
  const { sequence, selectedElementIndex } = useSequenceContext()
  const selectedElement = useSelectedElement()

  useEffect(() => {
    if (selectedElementIndex <= 0) {
      return
    }
    switch (selectedElement.data.type) {
      case 'KeyPressEvent':
        setDisplayText(
          HIDLookup.get(selectedElement.data.data.keypress)?.displayString
        )
        setCurrentTypeIndex(0)
        break
      case 'Delay':
        setDisplayText(selectedElement.data.data.toString())
        setDelayDuration(selectedElement.data.data)
        setCurrentTypeIndex(1)
        break
      default:
        break
    }
  }, [selectedElement])


  const onDelayDurationChange = (event:any) => {
    setDelayDuration(event.target.value)
    // update
    // TODO: fix element display in sequencing area not updating when fields are changed
    selectedElement.data.data = parseInt(event.target.value)
  }
  const onDelayUnitChange = (event:any) => {
    setDelayUnit(event.target.value)
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
      <VStack w="25%" h="full" borderLeft="1px" borderColor="gray.200" alignItems="normal" p="3">
        <Text fontWeight="semibold" fontSize={['sm', 'md']}>
          {selectedElement.data.type}
        </Text>
        <Grid templateRows='repeat(2, 1fr)' gap="0px">
          <GridItem w='100%' h="8px" alignItems="center" justifyContent="center">
            <Text>Duration</Text>
          </GridItem>
          <GridItem w='100%'>
            <Flex gap={['4px']} alignItems="center" justifyContent="space-around">
              <Input
                maxW={['50%', '65%', '75%']}
                maxH="32px"
                variant="outline"
                borderColor="gray.400"
                value={delayDuration} onChange={onDelayDurationChange}
              />
              <Select value={delayUnit} onChange={onDelayUnitChange}
                maxW={['50%', '35%', '25%']}
                >
                <option value={DelayUnit.Milliseconds}>ms</option>
                <option value={DelayUnit.Seconds}>s</option>
                <option value={DelayUnit.Minutes}>min</option>
              </Select>
            </Flex>
          </GridItem>
        </Grid>

        <Button variant="outline" colorScheme='blue' onClick={() => setDelayDuration(50)}>Set to Default</Button>
      </VStack>
    )
  }

  // default for keypress
  return (
    <VStack w="25%" h="full" borderLeft="1px" borderColor="gray.200">
      <Text fontWeight="semibold" fontSize={['sm', 'md']}>
        {selectedElement.data.type}
      </Text>
      <Text>{displayText}</Text>
    </VStack>
  )
}

export default EditArea
