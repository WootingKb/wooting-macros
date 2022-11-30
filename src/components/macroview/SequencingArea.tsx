import {
  VStack,
  HStack,
  Text,
  Button,
  Divider,
  useColorModeValue
} from '@chakra-ui/react'
import { AddIcon, EditIcon } from '@chakra-ui/icons'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { useEffect, useState } from 'react'
import SortableWrapper from './sortableList/SortableWrapper'
import SortableItem from './sortableList/SortableItem'
import DragWrapper from './sortableList/DragWrapper'
import { RecordingType } from '../../enums'
import useRecording from '../../hooks/useRecording'
import { Keypress, MousePressAction } from '../../types'
import { useMacroContext } from '../../contexts/macroContext'

// ask about how to deal with dndkit's types, e.g. UniqueIdentifier
export default function SequencingArea() {
  const [activeId, setActiveId] = useState<number | undefined>(undefined)
  const { recording, startRecording, stopRecording, items } = useRecording(
    RecordingType.Sequence
  )
  const { sequence, ids, onElementAdd, overwriteIds } = useMacroContext()
  const dividerColour = useColorModeValue('gray.400', 'gray.600')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (over === null) {
      return
    }

    if (active.id !== over.id) {
      const oldIndex = ids.indexOf(active.id)
      const newIndex = ids.indexOf(over.id)
      overwriteIds(arrayMove(ids, oldIndex, newIndex))
    }
    setActiveId(undefined)
  }

  function handleDragStart(event: any) {
    const { active } = event
    setActiveId(active.id)
  }

  useEffect(() => {
    if (items.length > 0) {
      const element = items[items.length - 1]

      const isKeypress = (e: Keypress | MousePressAction): e is Keypress => {
        return (e as Keypress).keypress !== undefined
      }

      if (isKeypress(element)) {
        onElementAdd({
          type: 'KeyPressEventAction',
          data: element
        })
      } else {
        onElementAdd({
          type: 'MouseEventAction',
          data: { type: 'Press', data: element }
        })
      }
    }
  }, [items, onElementAdd])

  return (
    <VStack w="41%" h="full" p="3">
      {/** Header */}
      <HStack justifyContent="space-between" w="100%" alignItems="center">
        <Text fontWeight="semibold" fontSize={['sm', 'md']}>
          Sequence
        </Text>
        <HStack>
          <Button
            leftIcon={<EditIcon />}
            size={['xs', 'sm', 'md']}
            colorScheme={recording ? 'red' : 'gray'}
            onClick={recording ? stopRecording : startRecording}
          >
            {recording ? 'Stop' : 'Record'}
          </Button>
          <Button
            leftIcon={<AddIcon />}
            size={['xs', 'sm', 'md']}
            onClick={() => {
              onElementAdd({
                type: 'DelayEventAction',
                data: 50
              })
            }}
          >
            Add Delay
          </Button>
        </HStack>
      </HStack>
      <Divider borderColor={dividerColour} />
      {/** Timeline */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <VStack w="100%" h="100%" overflowY="auto" overflowX="hidden">
            {ids.map((id) => (
              <SortableWrapper id={id} key={id} element={sequence[id - 1]}>
                <SortableItem id={id} element={sequence[id - 1]} />
              </SortableWrapper>
            ))}
          </VStack>
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <DragWrapper element={sequence[activeId - 1]}>
              <SortableItem id={activeId} element={sequence[activeId - 1]} />
            </DragWrapper>
          ) : undefined}
        </DragOverlay>
      </DndContext>
    </VStack>
  )
}
