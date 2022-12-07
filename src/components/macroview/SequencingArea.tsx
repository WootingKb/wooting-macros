import {
  VStack,
  HStack,
  Text,
  Button,
  Divider,
  Alert,
  AlertIcon,
  AlertDescription,
  useColorModeValue,
  Stack
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
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
import { useCallback, useEffect, useState } from 'react'
import SortableWrapper from './sortableList/SortableWrapper'
import SortableItem from './sortableList/SortableItem'
import DragWrapper from './sortableList/DragWrapper'
import { Keypress, MousePressAction } from '../../types'
import { useMacroContext } from '../../contexts/macroContext'
import useRecordingSequence from '../../hooks/useRecordingSequence'

const isKeypress = (
  e: Keypress | MousePressAction | undefined
): e is Keypress => {
  return (e as Keypress).keypress !== undefined
}

// ask about how to deal with dndkit's types, e.g. UniqueIdentifier
export default function SequencingArea() {
  const [activeId, setActiveId] = useState<number | undefined>(undefined)
  const { recording, startRecording, stopRecording, item } =
    useRecordingSequence()
  const { sequence, ids, onElementAdd, overwriteIds, overwriteSequence } = useMacroContext()
  const dividerColour = useColorModeValue('gray.400', 'gray.600')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragEnd = useCallback((event: any) => {
    // make usecallback
    // events are objects, how to deal with getting the library's types easily?
    const { active, over } = event

    if (over === null) {
      return
    }

    if (active.id !== over.id) {
      const oldIndex = ids.indexOf(active.id)
      const newIndex = ids.indexOf(over.id)
      console.log(oldIndex)
      console.log(newIndex)
      overwriteIds(arrayMove(ids, oldIndex, newIndex))
    }
    setActiveId(undefined)
  }, [ids, overwriteIds])

  const handleDragStart = useCallback((event: any) => {
    // ask about dnd library types, esp. UniqueIdentifier and how to deal with it
    const { active } = event
    setActiveId(active.id)
  }, [])

  useEffect(() => {
    if (item === undefined) {
      return
    }
    // TODO: add a delay based on the difference in event timestamps
    // if (timeSinceLast !== undefined && timeSinceLast > 0) {
    //   onElementAdd({
    //     type: 'DelayEventAction',
    //     data: timeSinceLast
    //   })
    // }

    if (isKeypress(item)) {
      onElementAdd({
        type: 'KeyPressEventAction',
        data: item
      })
    } else {
      onElementAdd({
        type: 'MouseEventAction',
        data: { type: 'Press', data: item }
      })
    }
  }, [item, onElementAdd])

  return (
    <VStack w="41%" h="full" p="3">
      {/** Header */}
      <VStack w="100%">
        <Stack
          direction={['column', 'row']}
          w="100%"
          textAlign="left"
          justifyContent="space-between"
          alignItems={["start", "center"]}
        >
          <Text fontWeight="semibold" fontSize={['sm', 'md']}>
            Sequence
          </Text>
          {/* <Alert status="warning" w={["full", "fit"]} rounded="md" py="1" px={["2", "3"]}>
            <AlertIcon boxSize={['16px', '20px']} />
            <AlertDescription fontSize={['xs', 'sm']} fontWeight="bold">
              1+ elements may trigger another macro!
            </AlertDescription>
          </Alert> */}
        </Stack>
      </VStack>
      <HStack justifyContent="right" w="100%" alignItems="center">
          <Button
            leftIcon={<EditIcon />}
            size={['xs', 'sm', 'md']}
            colorScheme={recording ? 'red' : 'gray'}
            onClick={recording ? stopRecording : startRecording}
          >
            {recording ? 'Stop' : 'Record'}
          </Button>
          <Button
            leftIcon={<DeleteIcon />}
            size={['xs', 'sm', 'md']}
            onClick={() => overwriteSequence([])}
          >
            Clear
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
              <SortableWrapper
                id={id}
                key={id}
                isSmall={sequence[id - 1].type === 'DelayEventAction'}
              >
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
