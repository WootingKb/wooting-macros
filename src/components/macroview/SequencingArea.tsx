import { VStack, HStack, Text, Button, Divider, useColorModeValue } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
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

// TODO: Record functionality; add delay functionality
const SequencingArea = () => {
  const [activeId, setActiveId] = useState(undefined);
  const { sequence, addToSequence, overwriteSequence } = useSequenceContext()
  const dividerColour = useColorModeValue("gray.400", "gray.600")

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event:any) => {
    const {active} = event;
    console.log(active.id)
    console.log(sequence)
    setActiveId(active.id);
  }

  const handleDragEnd = (event: any) => {
    if (event.active.id !== event.over.id) {
      const oldIndex = sequence.findIndex(
        (element) => element.id === event.active.id
      )
      const newIndex = sequence.findIndex(
        (element) => element.id === event.over.id
      )

      overwriteSequence(arrayMove(sequence, oldIndex, newIndex))
    }

    setActiveId(undefined)
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
      <Divider borderColor={dividerColour}/>
      {/** Timeline */}
      <DndContext 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
        collisionDetection={closestCenter}
        sensors={sensors}
        >
        <SortableContext
          items={sequence.map((element) => element.id)}
          strategy={verticalListSortingStrategy}
        >
          <VStack w="100%" h="100%" overflowY="auto" overflowX="hidden">
            {sequence.map((element: SequenceElement) => (
              <SequenceElementDraggableDisplay element={element} key={element.id} />
            ))}
          </VStack>
        </SortableContext>
        <DragOverlay>
          {activeId ? <SequenceElementDraggableDisplay element={sequence[activeId]} /> : undefined}
        </DragOverlay>
      </DndContext>
    </VStack>
  )
}

export default SequencingArea
