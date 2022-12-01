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
import { mouseEnumLookup } from '../../../maps/MouseMap'

export default function MousePressForm() {
  const [headingText, setHeadingText] = useState('')
  const [mousepressDuration, setMousepressDuration] = useState(1)
  const [mousepressType, setMousepressType] = useState<KeyType>()
  const selectedElement = useSelectedElement()
  const { selectedElementId, updateElement } = useMacroContext()
  const dividerColour = useColorModeValue('gray.400', 'gray.600')

  useEffect(() => {
    if (selectedElement === undefined) {
      return
    }

    if (selectedElement.type !== 'MouseEventAction') {
      return
    }

    const typeString: keyof typeof KeyType = selectedElement.data.data
      .type as keyof typeof KeyType
    setMousepressType(KeyType[typeString])
    if (selectedElement.data.data.type === 'DownUp') {
      setMousepressDuration(selectedElement.data.data.duration)
    }
    setHeadingText(
      `${mouseEnumLookup.get(selectedElement.data.data.button)?.displayString}`
    )
  }, [selectedElement])

  const onMousepressDurationChange = (newVal: number) => {
    // need to ask about these guards, seems really redundant
    if (selectedElement === undefined) {
      return
    }
    if (selectedElement.type !== 'MouseEventAction') {
      return
    }
    if (selectedElementId === undefined) {
      return
    }
    const temp = { ...selectedElement }
    if (temp.data.data.type !== 'DownUp') {
      return
    }
    temp.data.data.duration = newVal
    setMousepressDuration(newVal)
    updateElement(temp, selectedElementId)
  }

  const onMousepressTypeChange = (newType: KeyType) => {
    if (selectedElement === undefined) {
      return
    }
    if (selectedElement.type !== 'MouseEventAction') {
      return
    }
    if (selectedElementId === undefined) {
      return
    }
    setMousepressType(newType)
    const temp = { ...selectedElement }
    switch (newType) {
      case KeyType.Down:
        temp.data.data.type = 'Down'
        break
      case KeyType.Up:
        temp.data.data.type = 'Up'
        break
      case KeyType.DownUp:
        temp.data.data.type = 'DownUp'
        break
      default:
        break
    }
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
              onClick={() => onMousepressTypeChange(KeyType.DownUp)}
              isActive={mousepressType === KeyType.DownUp}
            >
              <Text fontSize={['md', 'md', 'sm']}>Full Press</Text>
            </Button>
            <Button
              leftIcon={<StarIcon />}
              w="100%"
              size={['sm', 'md']}
              onClick={() => onMousepressTypeChange(KeyType.Down)}
              isActive={mousepressType === KeyType.Down}
            >
              <Text fontSize={['md', 'md', 'sm']}>Mouse Down</Text>
            </Button>
            <Button
              leftIcon={<StarIcon />}
              w="100%"
              size={['sm', 'md']}
              onClick={() => onMousepressTypeChange(KeyType.Up)}
              isActive={mousepressType === KeyType.Up}
            >
              <Text fontSize={['md', 'md', 'sm']}>Mouse Up</Text>
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
              isDisabled={mousepressType === KeyType.DownUp ? false : true}
              value={mousepressDuration}
              onChange={(event) =>
                onMousepressDurationChange(parseInt(event.target.value) || 0)
              }
            />
          </Flex>
        </GridItem>
      </Grid>
    </>
  )
}
