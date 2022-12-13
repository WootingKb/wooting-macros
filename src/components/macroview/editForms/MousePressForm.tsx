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
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                  />
                </svg>
              }
              w="100%"
              size={['sm', 'md']}
              onClick={() => onMousepressTypeChange(KeyType.DownUp)}
              isActive={mousepressType === KeyType.DownUp}
            >
              <Text fontSize={['md', 'md', 'sm']}>Full Press</Text>
            </Button>
            <Button
              variant="brand"
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
                  />
                </svg>
              }
              w="100%"
              size={['sm', 'md']}
              onClick={() => onMousepressTypeChange(KeyType.Down)}
              isActive={mousepressType === KeyType.Down}
            >
              <Text fontSize={['md', 'md', 'sm']}>Mouse Down</Text>
            </Button>
            <Button
              variant="brand"
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
                  />
                </svg>
              }
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
