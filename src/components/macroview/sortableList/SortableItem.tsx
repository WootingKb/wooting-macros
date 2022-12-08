import {
  RepeatClockIcon,
  StarIcon,
  DeleteIcon,
  EditIcon
} from '@chakra-ui/icons'
import { HStack, IconButton, Text, useColorModeValue } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
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
  const dividerColour = useColorModeValue('gray.400', 'gray.600')
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
            setDisplayText(sysEventLookup.get(element.data.type)?.displayString)
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
        {element.type === 'DelayEventAction' && <RepeatClockIcon />}
        {element.type === 'KeyPressEventAction' && <StarIcon />}
        <Text>{displayText}</Text>
      </HStack>
      <HStack
        p="4px"
        h="100%"
        borderLeft="1px"
        borderColor={
          ((selectedElementId !== undefined) && (id === selectedElementId + 1)) ? highlightedColour : dividerColour
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
