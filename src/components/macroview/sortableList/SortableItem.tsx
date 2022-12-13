import {
  RepeatClockIcon,
  DeleteIcon,
  EditIcon
} from '@chakra-ui/icons'
import { HStack, IconButton, Text, useColorModeValue } from '@chakra-ui/react'
import { useState, useEffect, useMemo } from 'react'
import { useMacroContext } from '../../../contexts/macroContext'
import { HIDLookup } from '../../../maps/HIDmap'
import { mouseEnumLookup } from '../../../maps/MouseMap'
import { sysEventLookup } from '../../../maps/SystemEventMap'
import { ActionEventType } from '../../../types'

type Props = {
  id: number
  element: ActionEventType
}

export default function SortableItem({ id, element }: Props) {
  const [isEditable, setIsEditable] = useState(true)
  const [displayText, setDisplayText] = useState<string | undefined>('')
  const borderColour = useColorModeValue('gray.400', 'gray.600')
  const highlightedColour = useColorModeValue('yellow.500', 'yellow.200')
  const { selectedElementId, onElementDelete, updateSelectedElementId } =
    useMacroContext()

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
            setDisplayText(sysEventLookup.get(element.data.action.type)?.displayString)
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
          return (
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
          )
        } else if (element.data.keytype === 'Down') {
          return (
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
          )
        } else {
          return (
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
          )
        }
      case 'MouseEventAction':
        if (element.data.data.type === 'DownUp') {
          return (
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
          )
        } else if (element.data.data.type === 'Down') {
          return (
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
          )
        } else {
          return (
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
          )
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
    <HStack w="100%" h="100%" justifyContent="space-around" spacing="0px">
      <HStack p="4px" px="8px" w="100%">
        {iconToDisplay}
        <Text
          fontWeight={
            selectedElementId !== undefined && id === selectedElementId + 1
              ? 'semibold'
              : 'normal'
          }
        >
          {displayText}
        </Text>
      </HStack>
      <HStack
        p="4px"
        h="100%"
        borderLeft="1px"
        borderColor={
          selectedElementId !== undefined && id === selectedElementId + 1
            ? highlightedColour
            : borderColour
        }
      >
        <IconButton
          aria-label="delete-button"
          icon={<DeleteIcon />}
          size={['xs', 'sm']}
          onClick={onDeleteButtonPress}
        />
        {isEditable && (
          <IconButton
            aria-label="edit-button"
            icon={<EditIcon />}
            size={['xs', 'sm']}
            onClick={onEditButtonPress}
          />
        )}
      </HStack>
    </HStack>
  )
}
