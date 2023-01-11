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
import { useMacroContext } from '../../../../contexts/macroContext'
import { useSelectedElement } from '../../../../contexts/selectors'
import { KeyType } from '../../../../constants/enums'
import { mouseEnumLookup } from '../../../../constants/MouseMap'
import { DownArrowIcon, DownUpArrowsIcon, UpArrowIcon } from '../../../icons'

interface Props {
  selectedElementId: number
}

export default function MousePressForm({ selectedElementId }: Props) {
  const [headingText, setHeadingText] = useState('')
  const [mousepressDuration, setMousepressDuration] = useState(1)
  const [mousepressType, setMousepressType] = useState<KeyType>()
  const selectedElement = useSelectedElement()
  const { updateElement } = useMacroContext()

  useEffect(() => {
    if (
      selectedElement === undefined ||
      selectedElement.type !== 'MouseEventAction'
    )
      return

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

  const onMousepressDurationChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(event.target.value)
      if (newValue === undefined) {
        return
      }
      setMousepressDuration(newValue)
    },
    [setMousepressDuration]
  )

  const onInputBlur = useCallback(() => {
    if (
      selectedElement === undefined ||
      selectedElement.type !== 'MouseEventAction'
    )
      return

    if (selectedElement.data.data.type !== 'DownUp') {
      return
    }
    const temp = {
      ...selectedElement,
      data: {
        ...selectedElement.data,
        data: {
          ...selectedElement.data.data,
          duration: mousepressDuration
        }
      }
    }
    updateElement(temp, selectedElementId)
  }, [mousepressDuration, selectedElement, selectedElementId, updateElement])

  const onMousepressTypeChange = useCallback(
    (newType: KeyType) => {
      if (
        selectedElement === undefined ||
        selectedElement.type !== 'MouseEventAction'
      )
        return

      setMousepressType(newType)
      let temp = { ...selectedElement }
      switch (newType) {
        case KeyType.Down:
          temp = {
            ...temp,
            data: { ...temp.data, data: { ...temp.data.data, type: 'Down' } }
          }
          break
        case KeyType.Up:
          temp = {
            ...temp,
            data: { ...temp.data, data: { ...temp.data.data, type: 'Up' } }
          }
          break
        case KeyType.DownUp:
          temp = {
            ...temp,
            data: {
              ...temp.data,
              data: {
                ...temp.data.data,
                type: 'DownUp',
                duration:
                  temp.data.data.type === 'DownUp' ? temp.data.data.duration : 1
              }
            }
          }
          break
        default:
          break
      }
      updateElement(temp, selectedElementId)
    },
    [selectedElement, selectedElementId, updateElement]
  )

  return (
    <>
      <Text w="full" fontWeight="semibold" fontSize={['sm', 'md']}>
        {headingText}
      </Text>
      <Divider />
      <Grid templateRows={'20px 1fr'} gap="2" w="full">
        <GridItem w="full" h="8px" alignItems="center" justifyContent="center">
          <Text fontSize={['xs', 'sm', 'md']} fontWeight="semibold">
            Type of keystroke
          </Text>
        </GridItem>
        <GridItem w="full">
          <Flex
            flexDir={['column', 'column', 'column', 'row']}
            gap="4px"
            justifyContent="space-around"
          >
            <Button
              variant="brandAccentLight"
              leftIcon={<DownUpArrowsIcon />}
              w="full"
              size={['sm', 'md']}
              onClick={() => onMousepressTypeChange(KeyType.DownUp)}
              isActive={mousepressType === KeyType.DownUp}
            >
              <Text fontSize={['md', 'md', 'sm']}>Full Press</Text>
            </Button>
            <Button
              variant="brandAccentLight"
              leftIcon={<DownArrowIcon />}
              w="full"
              size={['sm', 'md']}
              onClick={() => onMousepressTypeChange(KeyType.Down)}
              isActive={mousepressType === KeyType.Down}
            >
              <Text fontSize={['md', 'md', 'sm']}>Mouse Down</Text>
            </Button>
            <Button
              variant="brandAccentLight"
              leftIcon={<UpArrowIcon />}
              w="full"
              size={['sm', 'md']}
              onClick={() => onMousepressTypeChange(KeyType.Up)}
              isActive={mousepressType === KeyType.Up}
            >
              <Text fontSize={['md', 'md', 'sm']}>Mouse Up</Text>
            </Button>
          </Flex>
        </GridItem>
      </Grid>
      {mousepressType === KeyType.DownUp && (
        <Grid templateRows={'20px 1fr'} gap="2" w="full">
          <GridItem
            w="full"
            h="8px"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize={['xs', 'sm', 'md']} fontWeight="semibold">
              Duration (ms)
            </Text>
          </GridItem>
          <GridItem w="full">
            <Input
              type="number"
              variant="brandAccent"
              value={mousepressDuration}
              onChange={onMousepressDurationChange}
              onBlur={onInputBlur}
            />
          </GridItem>
        </Grid>
      )}
    </>
  )
}
