import { VStack, HStack, Text, Button, Divider } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { DndContext } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SequenceElement } from '../../types'
import SequenceElementDraggableDisplay from './SequenceElementDraggableDisplay'
import { useSequenceContext } from '../../contexts/sequenceContext'

const SequencingArea = () => {
  const { sequence, overwriteSequence } = useSequenceContext()

  const handleDrag = (event: any) => {
    if (event.active.id !== event.over.id) {
      const oldIndex = sequence.findIndex(
        (element) => element.id === event.active.id
      )
      const newIndex = sequence.findIndex(
        (element) => element.id === event.over.id
      )
      overwriteSequence(arrayMove(sequence, oldIndex, newIndex))
    }
  }

  return (
    <VStack w="41%" h="full" p="4px">
      {/** Header */}
      <HStack justifyContent="space-around" w="100%">
        <Text fontWeight="semibold" fontSize={['sm', 'md']}>
          Sequence
        </Text>
        <Button leftIcon={<EditIcon />} size={['sm', 'md']}>
          Record
        </Button>
        <Button leftIcon={<EditIcon />} size={['sm', 'md']}>
          Add Delay
        </Button>
      </HStack>
      <Divider />
      {/** Timeline */}
      <DndContext onDragEnd={handleDrag} modifiers={[restrictToVerticalAxis]}>
        <SortableContext
          items={sequence.map((element) => element.id)}
          strategy={verticalListSortingStrategy}
        >
          <VStack w="100%" h="100%" overflowY="auto" overflowX="hidden">
            {sequence.map((element: SequenceElement, index: number) => (
              <SequenceElementDraggableDisplay element={element} key={index} />
            ))}
          </VStack>
        </SortableContext>
      </DndContext>
    </VStack>
  )
}

export default SequencingArea
