import {
  VStack,
  HStack,
  Text,
  Button,
  Divider,
  useColorModeValue
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
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
import { useSequenceContext } from '../../contexts/sequenceContext'
import { useEffect, useState } from 'react'
import SortableWrapper from './sortableList/SortableWrapper'
import SortableItem from './sortableList/SortableItem'
import DragWrapper from './sortableList/DragWrapper'
import { ActionEventType } from '../../types'

// TODO: Record functionality
const SequencingArea = () => {
  const [activeId, setActiveId] = useState(undefined)
  const { sequence, addToSequence } = useSequenceContext()
  const dividerColour = useColorModeValue('gray.400', 'gray.600')

  const [items, setItems] = useState<number[]>([]);

  useEffect(() => {
    setItems(sequence.map((element, index) => index + 1))
  }, [sequence])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  function getSortedSequence(ids: number[]) {
    const sortedSequenceList = ids.map((id) => sequence[id - 1]);
    console.log(sortedSequenceList);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (over === null) {
      return;
    }

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        const sortedIds = arrayMove(items, oldIndex, newIndex);
        return sortedIds;
      });
    }
    setActiveId(undefined);
  }

  function handleDragStart(event: any) {
    const { active } = event;
    setActiveId(active.id);
  }

  const onAddDelayButtonPress = () => {
    const delayElement: ActionEventType = {
      type: 'Delay',
      data: 50
    }

    addToSequence(delayElement)
  }

  return (
    <VStack w="41%" h="full" p="3">
      {/** Header */}
      <HStack justifyContent="space-between" w="100%" alignItems="center">
        <Text fontWeight="semibold" fontSize={['sm', 'md']}>
          Sequence
        </Text>
        <HStack>
          <Button leftIcon={<EditIcon />} size={['xs', 'sm', 'md']}>
            Record
          </Button>
          <Button
            leftIcon={<EditIcon />}
            size={['xs', 'sm', 'md']}
            onClick={onAddDelayButtonPress}
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
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}
        >
          <VStack w="100%" h="100%" overflowY="auto" overflowX="hidden">
            {items.map((id) => 
              <SortableWrapper id={id} key={id} isSmall={sequence[id - 1].type === "Delay"}>
                <SortableItem id={id} element={sequence[id - 1]}/>
              </SortableWrapper>
            )}
          </VStack>
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <DragWrapper id={activeId} isSmall={sequence[activeId - 1].type === "Delay"}>
              <SortableItem id={activeId} element={sequence[activeId - 1]}/>
            </DragWrapper>
          ) : undefined}
        </DragOverlay>
      </DndContext>
    </VStack>
  )
}

export default SequencingArea
