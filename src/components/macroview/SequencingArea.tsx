import {
  VStack,
  HStack,
  Text,
  Button,
  Divider,
  Alert,
  AlertIcon,
  AlertDescription,
  Stack
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
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
import { useSettingsContext } from '../../contexts/settingsContext'
import { useApplicationContext } from '../../contexts/applicationContext'

const isKeypress = (
  e: Keypress | MousePressAction | undefined
): e is Keypress => {
  return (e as Keypress).keypress !== undefined
}

export default function SequencingArea() {
  const [activeId, setActiveId] = useState<number | undefined>(undefined)
  const [showAlert, setShowAlert] = useState(false)
  const { recording, startRecording, stopRecording, item } =
    useRecordingSequence()
  const { sequence, ids, onElementAdd, overwriteIds, overwriteSequence } =
    useMacroContext()
  const { collections } = useApplicationContext()
  const { config } = useSettingsContext()

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
    [ids, overwriteIds]
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event
    setActiveId(Number(active.id))
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
    // need to adjust this use effect / move functionality elsewhere, putting onElementAdd in the dependencies breaks it
  }, [item])

  useEffect(() => {
    // Need to update this later, for some reason the useEffect doesn't end when returning, and the code outside the forEach loops is executed, thus having only 1 setState()
    let matchFound = false
    collections.forEach((collection) => {
      collection.macros.forEach((macro) => {
        if (macro.trigger.type === 'KeyPressEvent') {
          macro.trigger.data.forEach((triggerKey) => {
            if (
              sequence.filter(
                (element) =>
                  element.type === 'KeyPressEventAction' &&
                  element.data.keypress === triggerKey
              ).length > 0
            ) {
              matchFound = true
              return
            }
          })
        } else {
          if (
            sequence.filter(
              (element) =>
                element.type === 'MouseEventAction' &&
                macro.trigger.type === 'MouseEvent' &&
                element.data.data.button === macro.trigger.data
            ).length > 0
          ) {
            matchFound = true
            return
          }
        }
      })
    })
    setShowAlert(matchFound)
  }, [collections, sequence, setShowAlert])

  return (
    <VStack w="41%" h="full" p="3">
      {/** Header */}
      <VStack w="100%">
        <Stack
          direction={['column', 'row']}
          w="100%"
          textAlign="left"
          justifyContent="space-between"
          alignItems={['start', 'center']}
        >
          <Text fontWeight="semibold" fontSize={['sm', 'md']}>
            Sequence
          </Text>
          {showAlert && (
            <Alert
              status="warning"
              w={['full', 'fit']}
              rounded="md"
              py="1"
              px={['2', '3']}
            >
              <AlertIcon boxSize={['16px', '20px']} />
              <AlertDescription fontSize={['xs', 'sm']} fontWeight="bold">
                1+ elements may trigger another macro!
              </AlertDescription>
            </Alert>
          )}
        </Stack>
      </VStack>
      <HStack justifyContent="right" w="100%" alignItems="center">
        <Button
          variant="brand"
          leftIcon={<EditIcon />}
          size={['xs', 'sm', 'md']}
          colorScheme={recording ? 'red' : 'gray'}
          onClick={recording ? stopRecording : startRecording}
        >
          {recording ? 'Stop' : 'Record'}
        </Button>
        <Button
          variant="brand"
          leftIcon={<DeleteIcon />}
          size={['xs', 'sm', 'md']}
          onClick={() => overwriteSequence([])}
        >
          Clear
        </Button>
        <Button
          variant="brand"
          leftIcon={<AddIcon />}
          size={['xs', 'sm', 'md']}
          onClick={() => {
            onElementAdd({
              type: 'DelayEventAction',
              data: config.DefaultDelayValue
            })
          }}
        >
          Add Delay
        </Button>
      </HStack>
      <Divider />
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
            <DragWrapper id={activeId} element={sequence[activeId - 1]}>
              <SortableItem id={activeId} element={sequence[activeId - 1]} />
            </DragWrapper>
          ) : undefined}
        </DragOverlay>
      </DndContext>
    </VStack>
  )
}
