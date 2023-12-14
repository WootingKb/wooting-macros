import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Input,
  Text,
  useColorModeValue,
  useToast
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { useMacroContext } from '../../../../contexts/macroContext'
import { KeyType } from '../../../../constants/enums'
import { mouseEnumLookup } from '../../../../constants/MouseMap'
import { DownArrowIcon, DownUpArrowsIcon, UpArrowIcon } from '../../../icons'
import { MouseEventAction } from '../../../../types'
import { borderRadiusStandard } from '../../../../theme/config'

interface Props {
  selectedElementId: number
  selectedElement: MouseEventAction
}

export default function MousePressForm({
  selectedElementId,
  selectedElement
}: Props) {
  const [headingText, setHeadingText] = useState<JSX.Element | string>('')
  const [mousepressDuration, setMousepressDuration] = useState('20')
  const [mousepressType, setMousepressType] = useState<KeyType>()
  const { updateElement } = useMacroContext()
  const bg = useColorModeValue('primary-light.50', 'primary-dark.700')
  const kebabColour = useColorModeValue('primary-light.500', 'primary-dark.500')
  const toast = useToast()

  useEffect(() => {
    const typeString: keyof typeof KeyType = selectedElement.data.data
      .type as keyof typeof KeyType
    setMousepressType(KeyType[typeString])
    if (selectedElement.data.data.type === 'DownUp') {
      setMousepressDuration(selectedElement.data.data.duration.toString())
    }

    setHeadingText(
      <HStack justifyContent="center" p={1}>
        <Text>Editing element</Text>
        <Box
          h="32px"
          w="fit-content"
          bg={bg}
          border="1px solid"
          py={1}
          px={3}
          borderColor={kebabColour}
          rounded={borderRadiusStandard}
        >
          <Text
            w="fit-content"
            fontSize={['sm', 'md', 'md']}
            whiteSpace="nowrap"
          >
            {
              mouseEnumLookup.get(selectedElement.data.data.button)
                ?.displayString
            }
          </Text>
        </Box>
      </HStack>
    )
  }, [selectedElement])

  const onMousepressDurationChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setMousepressDuration(event.target.value)
    },
    [setMousepressDuration]
  )

  const onInputBlur = useCallback(() => {
    if (selectedElement.data.data.type !== 'DownUp') {
      return
    }
    let duration = 20

    if (Number(mousepressDuration) > 20) {
      duration = Number(mousepressDuration)
    } else if (mousepressDuration === '') {
      toast({
        title: 'Default duration applied',
        description: 'Applied default duration of 20ms',
        status: 'info',
        duration: 4000,
        isClosable: true
      })
    } else {
      toast({
        title: 'Minimum duration',
        description: 'Duration must be at least 20ms',
        status: 'warning',
        duration: 4000,
        isClosable: true
      })
      if (Number.isNaN(duration)) {
        return
      }
    }

    const temp: MouseEventAction = {
      ...selectedElement,
      data: {
        ...selectedElement.data,
        data: {
          ...selectedElement.data.data,
          duration
        }
      }
    }
    updateElement(temp, selectedElementId)
  }, [mousepressDuration, selectedElement, selectedElementId, updateElement])

  const onMousepressTypeChange = useCallback(
    (newType: KeyType) => {
      setMousepressType(newType)
      let temp: MouseEventAction = { ...selectedElement }
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
              variant="brandTertiary"
              leftIcon={<DownUpArrowsIcon />}
              w="full"
              size={['sm', 'md']}
              onClick={() => onMousepressTypeChange(KeyType.DownUp)}
              isActive={mousepressType === KeyType.DownUp}
            >
              <Text fontSize={['md', 'md', 'sm']}>Full Press</Text>
            </Button>
            <Button
              variant="brandTertiary"
              leftIcon={<DownArrowIcon />}
              w="full"
              size={['sm', 'md']}
              onClick={() => onMousepressTypeChange(KeyType.Down)}
              isActive={mousepressType === KeyType.Down}
            >
              <Text fontSize={['md', 'md', 'sm']}>Mouse Down</Text>
            </Button>
            <Button
              variant="brandTertiary"
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
              placeholder="20"
              variant="brandAccent"
              value={mousepressDuration}
              onChange={onMousepressDurationChange}
              onBlur={onInputBlur}
              isInvalid={Number.isNaN(parseInt(mousepressDuration))}
            />
          </GridItem>
        </Grid>
      )}
    </>
  )
}
