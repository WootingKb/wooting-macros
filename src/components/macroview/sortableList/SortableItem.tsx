import { RepeatClockIcon, EditIcon } from '@chakra-ui/icons'
import {
  Divider,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text
} from '@chakra-ui/react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useMacroContext } from '../../../contexts/macroContext'
import { HIDLookup } from '../../../maps/HIDmap'
import { mouseEnumLookup } from '../../../maps/MouseMap'
import { sysEventLookup } from '../../../maps/SystemEventMap'
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
  const {
    selectedElementId,
    onElementAdd,
    onElementDelete,
    updateSelectedElementId
  } = useMacroContext()

  const onDuplicate = useCallback(() => {
    const newElement = { ...element }
    onElementAdd(newElement)
  }, [element, onElementAdd])

  useEffect(() => {
    switch (element.type) {
      case 'KeyPressEventAction':
        setDisplayText(HIDLookup.get(element.data.keypress)?.displayString)
        setIsEditable(true)
        break
      case 'DelayEventAction':
        setDisplayText(element.data.toString() + ' ms')
        setIsEditable(true)
        break
      case 'MouseEventAction':
        setDisplayText(
          mouseEnumLookup.get(element.data.data.button)?.displayString
        )
        setIsEditable(true)
        break
      case 'SystemEventAction':
        switch (element.data.type) {
          case 'Open':
            setDisplayText(
              sysEventLookup.get(element.data.action.type)?.displayString
            )
            setIsEditable(true)
            break
          case 'Volume':
            setDisplayText(
              sysEventLookup.get(element.data.action.type)?.displayString
            )
            setIsEditable(false)
            break
          case 'Clipboard':
            setDisplayText(
              sysEventLookup.get(element.data.action.type)?.displayString
            )
            switch (element.data.action.type) {
              case 'PasteUserDefinedString':
                setIsEditable(true)
                break
              case 'Sarcasm':
                setIsEditable(false)
                break
              default:
                setIsEditable(false)
                break
            }
            break
          case 'Brightness':
            setDisplayText(
              sysEventLookup.get(element.data.action.type)?.displayString
            )
            setIsEditable(true)
            break
          default:
            setDisplayText('err')
            setIsEditable(false)
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
        return <RepeatClockIcon />
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
    <HStack w="full" h="full" justifyContent="space-around" spacing="0px" onClick={onEditButtonPress}>
      <HStack p={1} px={2} w="full">
        {iconToDisplay}
        <Text
          fontWeight={
            selectedElementId !== undefined && id === selectedElementId + 1
              ? 'bold'
              : 'normal'
          }
        >
          {displayText}
        </Text>
      </HStack>
      <HStack p={2} h="full">
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
            as={IconButton}
            aria-label="Kebab Menu Button"
            icon={
              <KebabVertical
                color={
                  selectedElementId !== undefined &&
                  id === selectedElementId + 1
                    ? 'primary-accent.600'
                    : ''
                }
              />
            }
            variant="link"
          />
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
