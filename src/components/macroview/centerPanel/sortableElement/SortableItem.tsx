import { EditIcon, TimeIcon } from '@chakra-ui/icons'
import {
  Box,
  Divider,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { useCallback, useMemo } from 'react'
import { useMacroContext } from '../../../../contexts/macroContext'
import { ActionEventType } from '../../../../types'
import {
  DownArrowIcon,
  DownUpArrowsIcon,
  KebabVertical,
  UpArrowIcon
} from '../../../icons'
import {
  checkIfElementIsEditable,
  getElementDisplayString
} from '../../../../constants/utils'
import { KeyType } from '../../../../constants/enums'
import { borderRadiusStandard } from '../../../../theme/config'

interface Props {
  id: number
  element: ActionEventType
  recording: boolean
  stopRecording: () => void
}

export default function SortableItem({
  id,
  element,
  recording,
  stopRecording
}: Props) {
  const isEditable = checkIfElementIsEditable(element)
  const displayText = getElementDisplayString(element)
  const {
    selectedElementId,
    onElementAdd,
    onElementDelete,
    updateSelectedElementId
  } = useMacroContext()
  const bg = useColorModeValue('primary-light.50', 'primary-dark.700')
  const kebabColour = useColorModeValue('primary-light.500', 'primary-dark.500')
  const kebabHoverColour = useColorModeValue(
    'primary-light.900',
    'primary-dark.400'
  )
  const deleteTextColour = useColorModeValue('red.500', 'red.200')
  const isKeyboardKey = useMemo(() => {
    return element.type === 'KeyPressEventAction'
  }, [element.type])
  const isSelected = selectedElementId === id - 1

  const onDuplicate = useCallback(() => {
    const newElement = { ...element }
    onElementAdd(newElement)
  }, [element, onElementAdd])

  const iconToDisplay = useMemo(() => {
    switch (element.type) {
      case 'DelayEventAction':
        return <TimeIcon />
      case 'KeyPressEventAction':
        if (element.data.key_type === 'DownUp') {
          return <DownUpArrowsIcon />
        } else if (element.data.key_type === 'Down') {
          return <DownArrowIcon />
        } else {
          return <UpArrowIcon />
        }
      case 'MouseEventAction':
        if (element.data.data.type === 'DownUp') {
          return <DownUpArrowsIcon />
        } else if (element.data.data.type === 'Down') {
          return <DownArrowIcon />
        } else {
          return <UpArrowIcon />
        }
      case 'SystemEventAction':
        return <></>
      default:
        return <></>
    }
  }, [element])

  const onItemPress = useCallback(() => {
    if (recording) return

    if (isSelected) {
      return
    }
    if (checkIfElementIsEditable(element)) updateSelectedElementId(id - 1)
  }, [element, id, isSelected, recording, updateSelectedElementId])

  const onEditButtonPress = useCallback(() => {
    stopRecording()
    if (isSelected) {
      return
    }
    updateSelectedElementId(id - 1)
  }, [id, isSelected, stopRecording, updateSelectedElementId])

  const onDeleteButtonPress = useCallback(() => {
    if (isSelected) {
      updateSelectedElementId(undefined)
    }
    onElementDelete(id - 1)
  }, [id, isSelected, onElementDelete, updateSelectedElementId])

  const secondBg = useColorModeValue('primary-light.100', 'primary-dark.800')

  return (
    <HStack
      w="full"
      h="full"
      bg={
        selectedElementId !== undefined && id === selectedElementId + 1
          ? 'inherit'
          : secondBg
      }
      justifyContent="space-around"
      spacing="0px"
      rounded={borderRadiusStandard}
      cursor={isEditable ? 'pointer' : 'default'}
      onClick={onItemPress}
    >
      <HStack p={1} px={2} w="full" spacing={0} gap={4}>
        {iconToDisplay}
        <Flex
          minW="40px"
          maxW={['150px', '240px', '400px', '620px']}
          h="32px"
          {...(isKeyboardKey
            ? {
                bg: bg,
                border: '1px solid',
                px: 3
              }
            : {})}
          borderColor={kebabColour}
          alignItems="center"
          justifyContent="center"
          rounded={borderRadiusStandard}
        >
          <Text
            h="fit-content"
            fontWeight={
              selectedElementId !== undefined && id === selectedElementId + 1
                ? 'bold'
                : 'normal'
            }
            noOfLines={1}
          >
            {displayText}
          </Text>
        </Flex>
      </HStack>
      <HStack py={2} pr={2} h="full" spacing={0} gap={2} alignItems="flex-end">
        {element.type === 'KeyPressEventAction' &&
          element.data.key_type === KeyType[KeyType.DownUp] && (
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
                fontWeight={
                  selectedElementId !== undefined &&
                  id === selectedElementId + 1
                    ? 'bold'
                    : 'normal'
                }
                fontSize="sm"
                whiteSpace="nowrap"
              >
                {element.data.press_duration + ' ms'}
              </Text>
            </Box>
          )}
        {element.type === 'MouseEventAction' &&
          element.data.data.type === 'DownUp' && (
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
                fontWeight={
                  selectedElementId !== undefined &&
                  id === selectedElementId + 1
                    ? 'bold'
                    : 'normal'
                }
                fontSize="sm"
                whiteSpace="nowrap"
              >
                {element.data.data.duration + ' ms'}
              </Text>
            </Box>
          )}
        {isEditable && (
          <IconButton
            variant="brandSecondary"
            aria-label="Edit item"
            icon={<EditIcon />}
            size={['xs', 'sm']}
            onClick={onEditButtonPress}
          />
        )}
        <Menu variant="brand">
          <MenuButton
            h="24px"
            aria-label="Item options"
            color={kebabColour}
            px={2}
            _hover={{ color: kebabHoverColour }}
          >
            <KebabVertical />
          </MenuButton>
          <MenuList p="2" right={0}>
            <MenuItem onClick={onDuplicate}>Duplicate</MenuItem>
            <Divider />
            <MenuItem
              onClick={onDeleteButtonPress}
              textColor={deleteTextColour}
            >
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </HStack>
  )
}
