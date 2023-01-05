import { TimeIcon, EditIcon } from '@chakra-ui/icons'
import {
  Divider,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useMacroContext } from '../../../contexts/macroContext'
import { HIDLookup } from '../../../constants/HIDmap'
import { mouseEnumLookup } from '../../../constants/MouseMap'
import { sysEventLookup } from '../../../constants/SystemEventMap'
import { ActionEventType } from '../../../types'
import {
  DownArrowIcon,
  DownUpArrowsIcon,
  KebabVertical,
  UpArrowIcon
} from '../../icons'

type Props = {
  id: number
  element: ActionEventType
}

export default function SortableItem({ id, element }: Props) {
  const [isEditable, setIsEditable] = useState(true)
  const [displayText, setDisplayText] = useState<string | undefined>('')
  const [isKeyboardKey, setIsKeyboardKey] = useState(false)
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

  const onDuplicate = useCallback(() => {
    const newElement = { ...element }
    onElementAdd(newElement)
  }, [element, onElementAdd])

  useEffect(() => {
    switch (element.type) {
      case 'KeyPressEventAction':
        setDisplayText(HIDLookup.get(element.data.keypress)?.displayString)
        setIsEditable(true)
        setIsKeyboardKey(true)
        break
      case 'DelayEventAction':
        setDisplayText(element.data.toString() + ' ms')
        setIsEditable(true)
        setIsKeyboardKey(false)
        break
      case 'MouseEventAction':
        setDisplayText(
          mouseEnumLookup.get(element.data.data.button)?.displayString
        )
        setIsEditable(true)
        setIsKeyboardKey(false)
        break
      case 'SystemEventAction':
        switch (element.data.type) {
          case 'Open':
            setDisplayText(
              sysEventLookup.get(element.data.action.type)?.displayString
            )
            setIsEditable(true)
            setIsKeyboardKey(false)
            break
          case 'Volume':
            setDisplayText(
              sysEventLookup.get(element.data.action.type)?.displayString
            )
            setIsEditable(false)
            setIsKeyboardKey(false)
            break
          case 'Clipboard':
            setDisplayText(
              sysEventLookup.get(element.data.action.type)?.displayString
            )
            switch (element.data.action.type) {
              case 'PasteUserDefinedString':
                setIsEditable(true)
                setIsKeyboardKey(false)
                break
              case 'Sarcasm':
                setIsEditable(false)
                setIsKeyboardKey(false)
                break
              default:
                setIsEditable(false)
                setIsKeyboardKey(false)
                break
            }
            break
          case 'Brightness':
            setDisplayText(
              sysEventLookup.get(element.data.action.type)?.displayString
            )
            setIsEditable(true)
            setIsKeyboardKey(false)
            break
          default:
            setDisplayText('err')
            setIsEditable(false)
            setIsKeyboardKey(false)
            break
        }
        break
      default:
        break
    }
  }, [element.data, element.type, id])

  const iconToDisplay = useMemo(() => {
    switch (element.type) {
      case 'DelayEventAction':
        return <TimeIcon />
      case 'KeyPressEventAction':
        if (element.data.keytype === 'DownUp') {
          return <DownUpArrowsIcon />
        } else if (element.data.keytype === 'Down') {
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

  const onEditButtonPress = () => {
    if (selectedElementId === id - 1) {
      return
    }
    updateSelectedElementId(id - 1)
  }

  const onDeleteButtonPress = () => {
    if (selectedElementId === id - 1) {
      updateSelectedElementId(undefined)
    }
    onElementDelete(id - 1)
  }

  return (
    <HStack
      w="full"
      h="full"
      justifyContent="space-around"
      spacing="0px"
      onClick={onEditButtonPress}
    >
      <HStack p={1} px={2} w="full" spacing={0} gap={4}>
        {iconToDisplay}
        <Text
          bg={isKeyboardKey ? bg : 'none'}
          border={isKeyboardKey ? '1px solid' : 'none'}
          borderColor={kebabColour}
          py={isKeyboardKey ? 1 : 0}
          px={isKeyboardKey ? 3 : 0}
          fontWeight={
            selectedElementId !== undefined && id === selectedElementId + 1
              ? 'bold'
              : 'normal'
          }
          rounded="md"
        >
          {displayText}
        </Text>
      </HStack>
      <HStack py={2} pr={4} h="full" spacing={0} gap={3} alignItems="flex-end">
        {isEditable && (
          <IconButton
            variant="brandSecondary"
            aria-label="edit-button"
            icon={<EditIcon />}
            size={['xs', 'sm']}
            onClick={onEditButtonPress}
          />
        )}
        <Menu variant="brand">
          <MenuButton
            h="24px"
            aria-label="Kebab Menu Button"
            color={kebabColour}
            _hover={{ color: kebabHoverColour }}
          >
            <KebabVertical />
          </MenuButton>
          <MenuList p="2" right={0}>
            <MenuItem onClick={onDuplicate}>Duplicate</MenuItem>
            <Divider />
            <MenuItem onClick={onDeleteButtonPress} textColor="red.500">
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </HStack>
  )
}
