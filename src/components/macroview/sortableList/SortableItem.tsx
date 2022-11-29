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
import { ActionEventType } from '../../../types'

type Props = {
  id: number
  element: ActionEventType
}

const SortableItem = ({ id, element }: Props) => {
  const [displayText, setDisplayText] = useState<string | undefined>('')
  const dividerColour = useColorModeValue('gray.400', 'gray.600')
  const { selectedElementId, onElementDelete, updateSelectedElementId } =
    useMacroContext()

  useEffect(() => {
    switch (element.type) {
      case 'KeyPressEventAction':
        setDisplayText(HIDLookup.get(element.data.keypress)?.displayString)
        break
      case 'DelayEventAction':
        setDisplayText(element.data.toString() + ' ms')
        break
      case 'MouseEventAction':
        setDisplayText('M' + element.data.data.button)
        break
      case 'SystemEventAction':
        setDisplayText(element.data.type.toString())
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
      <HStack p="4px" h="100%" borderLeft="1px" borderColor={dividerColour}>
        <IconButton
          aria-label="delete-button"
          icon={<DeleteIcon />}
          size={['xs', 'sm']}
          onClick={onDeleteButtonPress}
        ></IconButton>
        <IconButton
          aria-label="edit-button"
          icon={<EditIcon />}
          size={['xs', 'sm']}
          onClick={onEditButtonPress}
        ></IconButton>
      </HStack>
    </HStack>
  )
}

export default SortableItem
