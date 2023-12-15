import { VStack } from '@chakra-ui/react'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useCallback, useState } from 'react'
import { useMacroContext } from '../../../contexts/macroContext'
import useScrollbarStyles from '../../../hooks/useScrollbarStyles'
import DragWrapper from './sortableElement/DragWrapper'
import SortableItem from './sortableElement/SortableItem'
import SortableWrapper from './sortableElement/SortableWrapper'

interface Props {
  recording: boolean
  stopRecording: () => void
}

export default function SortableList({ recording, stopRecording }: Props) {
  const [activeId, setActiveId] = useState<number | undefined>(undefined)
  const { sequence, ids, overwriteIds } = useMacroContext()
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over === null) {
        return
      }

      if (active.id !== over.id) {
        const oldIndex = ids.indexOf(Number(active.id))
        const newIndex = ids.indexOf(Number(over.id))
        overwriteIds(arrayMove(ids, oldIndex, newIndex))
      }
      setActiveId(undefined)
    },
    [ids, overwriteIds, setActiveId]
  )

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      stopRecording()
      const { active } = event
      setActiveId(Number(active.id))
    },
    [stopRecording, setActiveId]
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <VStack
          bg="bg-dark"
          w="full"
          h="full"
          px={4}
          pb={4}
          overflowY="auto"
          overflowX="hidden"
          sx={useScrollbarStyles()}
        >
          {ids.map((id) => (
            <SortableWrapper
              id={id}
              key={id}
              isSmall={sequence[id - 1].type === 'DelayEventAction'}
            >
              <SortableItem
                id={id}
                element={sequence[id - 1]}
                recording={recording}
                stopRecording={stopRecording}
              />
            </SortableWrapper>
          ))}
        </VStack>
      </SortableContext>
      <DragOverlay>
        {activeId ? (
          <DragWrapper id={activeId} element={sequence[activeId - 1]}>
            <SortableItem
              id={activeId}
              element={sequence[activeId - 1]}
              recording={recording}
              stopRecording={stopRecording}
            />
          </DragWrapper>
        ) : undefined}
      </DragOverlay>
    </DndContext>
  )
}
