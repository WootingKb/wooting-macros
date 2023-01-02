import {
  Divider,
  Grid,
  GridItem,
  Flex,
  Button,
  Input,
  Text
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useMacroContext } from '../../../contexts/macroContext'
import { useSelectedElement } from '../../../contexts/selectors'
import { KeyType } from '../../../enums'
import { mouseEnumLookup } from '../../../maps/MouseMap'
import { DownArrowIcon, DownUpArrowsIcon, UpArrowIcon } from '../../icons'

export default function MousePressForm() {
  const [headingText, setHeadingText] = useState('')
  const [mousepressDuration, setMousepressDuration] = useState(1)
  const [mousepressType, setMousepressType] = useState<KeyType>()
  const selectedElement = useSelectedElement()
  const { selectedElementId, updateElement } = useMacroContext()

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

  const onMousepressDurationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    const newValue = parseInt(event.target.value)
    if (newValue === undefined) {
      return
    }
    temp.data.data.duration = newValue
    setMousepressDuration(newValue)
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
              onClick={() => onMousepressTypeChange(KeyType.DownUp)}
              isActive={mousepressType === KeyType.DownUp}
            >
              <Text fontSize={['md', 'md', 'sm']}>Full Press</Text>
            </Button>
            <Button
              variant="brand"
              leftIcon={<DownArrowIcon />}
              w="100%"
              size={['sm', 'md']}
              onClick={() => onMousepressTypeChange(KeyType.Down)}
              isActive={mousepressType === KeyType.Down}
            >
              <Text fontSize={['md', 'md', 'sm']}>Mouse Down</Text>
            </Button>
            <Button
              variant="brand"
              leftIcon={<UpArrowIcon />}
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
              isDisabled={mousepressType === KeyType.DownUp ? false : true}
              value={mousepressDuration}
              onChange={onMousepressDurationChange}
            />
          </Flex>
        </GridItem>
      </Grid>
    </>
  )
}
