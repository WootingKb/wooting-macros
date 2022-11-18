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
import { SequenceElement } from '../../types'
import SequenceElementDraggableDisplay from './SequenceElementDraggableDisplay'
import { useSequenceContext } from '../../contexts/sequenceContext'
import { useState } from 'react'
import SortableWrapper from './sortableList/SortableWrapper'
import SortableItem from './sortableList/SortableItem'
import DragWrapper from './sortableList/DragWrapper'

// TODO: Record functionality; add delay functionality
const SequencingArea = () => {
  const [activeId, setActiveId] = useState(undefined)
  const { sequence, addToSequence, overwriteSequence } = useSequenceContext()
  const dividerColour = useColorModeValue('gray.400', 'gray.600')

  const [sequenceList, setSequenceList] = useState([
    {
      text: "test 1",
      isSmall: true
    },
    {
      text: "test 2",
      isSmall: false
    },
    {
      text: "test 3",
      isSmall: false
    },
    {
      text: "test 4",
      isSmall: false
    },
    {
      text: "test 5",
      isSmall: true
    },
    {
      text: "test 6",
      isSmall: true
    },
    {
      text: "test 7",
      isSmall: true
    },
    {
      text: "test 8",
      isSmall: true
    },
    {
      text: "test 9",
      isSmall: true
    },
    {
      text: "test 10",
      isSmall: true
    }
  ]);
  const [items, setItems] = useState<number[]>(
    sequenceList.map((element, index) => index + 1)
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  function getSortedSequence(ids: number[]) {
    const sortedSequenceList = ids.map((id) => sequenceList[id - 1]);
    console.log(sortedSequenceList);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    console.log(over);

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
    const delayElement: SequenceElement = {
      id: sequence.length + 1,
      data: { type: 'Delay', data: 50 }
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
              <SortableWrapper id={id} key={id} isSmall={sequenceList[id - 1].isSmall}>
                <SortableItem id={id} element={sequenceList[id - 1]}/>
              </SortableWrapper>
            )}
          </VStack>
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <DragWrapper id={activeId} isSmall={sequenceList[activeId - 1].isSmall}>
              <SortableItem id={activeId} element={sequenceList[activeId - 1]}/>
            </DragWrapper>
          ) : undefined}
        </DragOverlay>
      </DndContext>
    </VStack>
  )
}

export default SequencingArea
