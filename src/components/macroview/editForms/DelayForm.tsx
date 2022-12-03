import {
  Divider,
  Grid,
  GridItem,
  Flex,
  Input,
  Button,
  Text
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useMacroContext } from '../../../contexts/macroContext'
import { useSelectedElement } from '../../../contexts/selectors'

export default function DelayForm() {
  const [delayDuration, setDelayDuration] = useState(0)
  const { selectedElementId, updateElement } = useMacroContext()
  const selectedElement = useSelectedElement()

  useEffect(() => {
    if (selectedElement === undefined) {
      return
    }

    if (selectedElement.type !== 'DelayEventAction') {
      return
    }

    setDelayDuration(selectedElement.data)
  }, [selectedElement])

  const onDelayDurationChange = (event: any) => {
    if (selectedElement === undefined || selectedElementId === undefined) {
      return
    }

    const newValue = parseInt(event.target.value)
    if (newValue === undefined) {
      return
    }

    setDelayDuration(newValue)
    const temp = { ...selectedElement }
    temp.data = newValue
    updateElement(temp, selectedElementId)
  }

  return (
    <>
      <Text fontWeight="semibold" fontSize={['sm', 'md']}>
        {'Delay Element'}
      </Text>
      <Divider />
      <Grid templateRows={'20px 1fr'} gap="2" w="100%">
        <GridItem w="100%" h="8px" alignItems="center" justifyContent="center">
          <Text fontSize={['xs', 'sm', 'md']}>Duration (ms)</Text>
        </GridItem>
        <GridItem w="100%">
          <Flex gap={['4px']} alignItems="center" justifyContent="space-around">
            <Input
              type="number"
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
        onClick={() => onDelayDurationChange(50)}
      >
        Set to Default
      </Button>
    </>
  )
}
