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
import { KeyType } from '../../enums'

const isKeypress = (
  e: Keypress | MousePressAction | undefined
): e is Keypress => {
  return (e as Keypress).keypress !== undefined
}

export default function SequencingArea() {
  const [activeId, setActiveId] = useState<number | undefined>(undefined)
  const [showAlert, setShowAlert] = useState(false)
  const {
    recording,
    startRecording,
    stopRecording,
    item,
    eventType,
    prevItem,
    prevEventType,
    timeDiff
  } = useRecordingSequence()
  const {
    sequence,
    ids,
    onElementAdd,
    onElementsAdd,
    updateElement,
    overwriteIds,
    overwriteSequence
  } = useMacroContext()
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
    // Need to update this later, for some reason the useEffect doesn't end when returning, and the code outside the forEach loops is executed, thus to work around this we have only 1 setState()
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

  useEffect(() => {
    if (item === undefined) {
      return
    }

    if (prevItem !== undefined) {
      // if there is a previous element with a down event, check if the new event was an up event
      if (eventType === 'Up' && prevEventType === 'Down') {
        // current element is up event
        if ('keypress' in prevItem && 'keypress' in item) {
          // 1. previous element was a keypress and current element is a keypress
          if (prevItem.keypress === item.keypress) {
            // 1.1 if the last event was a down event for the same key, then we update the duration of the DownUp event to be the diff in timestamps
            updateElement(
              {
                type: 'KeyPressEventAction',
                data: {
                  ...prevItem,
                  keytype: KeyType[KeyType.DownUp],
                  press_duration: timeDiff
                }
              },
              sequence.length - 1
            )
            return
          }
        } else if ('button' in prevItem && 'button' in item) {
          // 2. previous element was a mouse event and current element is a mouse event
          updateElement(
            {
              type: 'MouseEventAction',
              data: {
                type: 'Press',
                data: { ...prevItem, type: 'DownUp', duration: timeDiff }
              }
            },
            sequence.length - 1
          )
          return
        }
      }
      if (isKeypress(item)) {
        onElementsAdd([
          {
            type: 'DelayEventAction',
            data: timeDiff
          },
          {
            type: 'KeyPressEventAction',
            data: item
          }
        ])
      } else {
        onElementsAdd([
          {
            type: 'DelayEventAction',
            data: timeDiff
          },
          {
            type: 'MouseEventAction',
            data: { type: 'Press', data: item }
          }
        ])
      }
    } else {
      // add current element to sequence
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
    }
  }, [item])

  return (
    <VStack w="41%" h="full">
      {/** Header */}
      <VStack w="100%" px="3" pt="3">
        <Stack
          direction={['column', 'row']}
          w="100%"
          textAlign="left"
          justifyContent="space-between"
          alignItems={['start', 'center']}
        >
          <Text fontWeight="semibold" fontSize={['sm', 'md']}>
            SEQUENCE
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
      <HStack justifyContent="right" w="100%" alignItems="center" px="3">
        <Button
          variant="brandRecord"
          leftIcon={<EditIcon />}
          size={['xs', 'sm', 'md']}
          isActive={recording}
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
      <Divider w="95%" alignSelf="center" />
      {/** Timeline */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <VStack w="100%" h="100%" px="3" overflowY="auto" overflowX="hidden">
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
