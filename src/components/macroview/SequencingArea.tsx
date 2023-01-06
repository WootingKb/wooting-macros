import {
  VStack,
  HStack,
  Text,
  Button,
  Divider,
  Alert,
  AlertIcon,
  AlertDescription,
  Stack,
  useColorMode,
  useDisclosure
} from '@chakra-ui/react'
import { DeleteIcon, TimeIcon } from '@chakra-ui/icons'
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
import { useCallback, useState } from 'react'
import SortableWrapper from './sortableList/SortableWrapper'
import SortableItem from './sortableList/SortableItem'
import DragWrapper from './sortableList/DragWrapper'
import { Keypress, MousePressAction } from '../../types'
import { useMacroContext } from '../../contexts/macroContext'
import useRecordingSequence from '../../hooks/useRecordingSequence'
import { useSettingsContext } from '../../contexts/settingsContext'
import { KeyType } from '../../constants/enums'
import {
  scrollbarsStylesDark,
  scrollbarStylesLight
} from '../../constants/utils'
import ClearSequenceModal from './ClearSequenceModal'
import { RecordIcon, StopIcon } from '../icons'

const isKeypress = (
  e: Keypress | MousePressAction | undefined
): e is Keypress => {
  return (e as Keypress).keypress !== undefined
}

export default function SequencingArea() {
  const [activeId, setActiveId] = useState<number | undefined>(undefined)
  const {
    sequence,
    ids,
    willCauseTriggerLooping,
    onElementAdd,
    onElementsAdd,
    updateElement,
    overwriteIds
  } = useMacroContext()
  const { config } = useSettingsContext()
  const { colorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onItemChanged = useCallback(
    (
      item: Keypress | MousePressAction | undefined,
      prevItem: Keypress | MousePressAction | undefined,
      timeDiff: number,
      isUpEvent: boolean
    ) => {
      if (item === undefined) {
        return
      }

      if (isUpEvent && prevItem !== undefined) {
        if ('keypress' in prevItem && 'keypress' in item) {
          if (prevItem.keypress === item.keypress) {
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
          if (prevItem.button === item.button) {
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
      }

      if (prevItem === undefined) {
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
      } else {
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
      }
    },
    [onElementAdd, onElementsAdd, sequence.length, updateElement]
  )

  const { recording, startRecording, stopRecording } =
    useRecordingSequence(onItemChanged)

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

  return (
    <VStack w="41%" h="full">
      {/** Header */}
      <VStack w="full" px={[2, 4, 6]} pt={[2, 4]}>
        <Stack
          direction={['column', 'row']}
          w="full"
          textAlign="left"
          justifyContent="space-between"
          alignItems={['start', 'center']}
        >
          <Text fontWeight="semibold" fontSize={['sm', 'md']}>
            Sequence
          </Text>
          {willCauseTriggerLooping && (
            <Alert
              status="error"
              w={['full', 'fit']}
              rounded="md"
              py="1"
              px={['2', '3']}
            >
              <AlertIcon boxSize={['16px', '20px']} />
              <AlertDescription fontSize={['xs', 'sm']} fontWeight="bold">
                1+ elements may trigger this macro again or another macro!
              </AlertDescription>
            </Alert>
          )}
        </Stack>
      </VStack>
      <HStack
        justifyContent="right"
        w="full"
        alignItems="center"
        px={[2, 4, 6]}
      >
        <Button
          variant="brandWarning"
          leftIcon={<DeleteIcon />}
          size={['xs', 'sm', 'md']}
          onClick={onOpen}
          isDisabled={sequence.length === 0}
        >
          Clear
        </Button>
        <Button
          variant="brandRecord"
          leftIcon={recording ? <StopIcon /> : <RecordIcon />}
          size={['xs', 'sm', 'md']}
          isActive={recording}
          onClick={recording ? stopRecording : startRecording}
        >
          {recording ? 'Stop' : 'Record'}
        </Button>
        <Button
          variant="brandAccent"
          leftIcon={<TimeIcon />}
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
      <ClearSequenceModal
        isOpen={isOpen}
        onClose={onClose}
        stopRecording={stopRecording}
      />
      <Divider w="full" />
      {/** Timeline */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <VStack
            w="full"
            h="full"
            px={4}
            pb={4}
            overflowY="auto"
            overflowX="hidden"
            sx={
              colorMode === 'light'
                ? scrollbarStylesLight
                : scrollbarsStylesDark
            }
          >
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
