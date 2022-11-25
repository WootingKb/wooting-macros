import {
  Divider,
  Grid,
  GridItem,
  Flex,
  Input,
  Button,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useMacroContext } from '../../../contexts/macroContext'
import { useSelectedElement } from '../../../contexts/selectors'

const DelayForm = () => {
  const [delayDuration, setDelayDuration] = useState(0)
  const { selectedElementId, updateElement } = useMacroContext()
  const selectedElement = useSelectedElement()
  const dividerColour = useColorModeValue('gray.400', 'gray.600')

  useEffect(() => {
    if (selectedElement === undefined) {
      return
    }

    if (selectedElement.type !== 'Delay') {
      return
    }

    setDelayDuration(selectedElement.data)
  }, [selectedElement])

  const onDelayDurationChange = (newVal: number) => {
    if (selectedElement === undefined || selectedElementId === undefined) {
      return
    }
    setDelayDuration(newVal)
    const temp = { ...selectedElement }
    temp.data = newVal
    updateElement(temp, selectedElementId)
  }

  return (
    <>
      <Text fontWeight="semibold" fontSize={['sm', 'md']}>
        {'Delay Element'}
      </Text>
      <Divider borderColor={dividerColour} />
      <Grid templateRows={'20px 1fr'} gap="2" w="100%">
        <GridItem w="100%" h="8px" alignItems="center" justifyContent="center">
          <Text fontSize={['xs', 'sm', 'md']}>Duration (ms)</Text>
        </GridItem>
        <GridItem w="100%">
          <Flex gap={['4px']} alignItems="center" justifyContent="space-around">
            <Input
              variant="outline"
              borderColor="gray.400"
              value={delayDuration}
              onChange={(event) =>
                onDelayDurationChange(parseInt(event.target.value) || 0)
              }
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

export default DelayForm
