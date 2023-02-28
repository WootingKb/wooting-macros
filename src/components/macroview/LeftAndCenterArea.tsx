import { AspectRatio } from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { KeyType } from '../../constants/enums'
import { checkIfKeyboardKey, checkIfMouseEvent } from '../../constants/utils'
import { useMacroContext } from '../../contexts/macroContext'
import { useSettingsContext } from '../../contexts/settingsContext'
import { ActiveInfo, ActionEventType } from '../../types'
import SequencingArea from './centerPanel/SequencingArea'
import OverlayDraggableWrapper from './leftPanel/OverlayDraggableWrapper'
import SelectElementArea from './leftPanel/SelectElementArea'
import SelectElementButton from './leftPanel/SelectElementButton'

interface Props {
  onOpenSettingsModal: () => void
}

export default function LeftAndCenterArea({ onOpenSettingsModal }: Props) {
  const [activeId, setActiveId] = useState<number | undefined>(undefined)
  const [activeInfo, setActiveInfo] = useState<ActiveInfo>(undefined)
  const [ratioVal, setRatioVal] = useState<number | undefined>(undefined)
  const [activeProperties, setActiveProperties] = useState<
    ActionEventType | undefined
  >(undefined)
  const { sequence, onElementAdd, onElementsAdd } = useMacroContext()
  const { config } = useSettingsContext()
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 2.5 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleAddElement = useCallback(
    (properties: ActionEventType) => {
      if (config.AutoAddDelay) {
        if (
          sequence.at(-1)?.type !== 'DelayEventAction' &&
          sequence.length > 0
        ) {
          onElementsAdd([
            {
              type: 'DelayEventAction',
              data: config.DefaultDelayValue
            },
            properties
          ])
        } else {
          onElementAdd(properties)
        }
      } else {
        onElementAdd(properties)
      }
    },
    [
      config.AutoAddDelay,
      config.DefaultDelayValue,
      onElementAdd,
      onElementsAdd,
      sequence
    ]
  )

  const calculateRatio = useCallback((info: ActiveInfo) => {
    if (info === undefined) {
      return
    }
    if (checkIfKeyboardKey(info)) {
      return info.colSpan !== undefined ? info.colSpan / 1 : 1
    } else {
      return 2 / 0.75
    }
  }, [])

  const getProperties = useCallback((info: ActiveInfo): ActionEventType => {
    if (info === undefined) {
      return {
        type: 'KeyPressEventAction',
        data: {
          keypress: -1,
          press_duration: 1,
          keytype: KeyType[KeyType.DownUp]
        }
      }
    }
    if (checkIfKeyboardKey(info)) {
      return {
        type: 'KeyPressEventAction',
        data: {
          keypress: info.HIDcode,
          press_duration: 1,
          keytype: KeyType[KeyType.DownUp]
        }
      }
    } else if (checkIfMouseEvent(info)) {
      return {
        type: 'MouseEventAction',
        data: {
          type: 'Press',
          data: {
            type: 'DownUp',
            button: info.enumVal,
            duration: 20
          }
        }
      }
    } else {
      return {
        type: 'SystemEventAction',
        data: info.defaultData
      }
    }
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { over } = event

      if (activeProperties && over && over.id === 'sortableList') {
        handleAddElement(activeProperties)
      }
      setActiveId(undefined)
      setRatioVal(undefined)
      setActiveProperties(undefined)
    },
    [activeProperties, handleAddElement]
  )

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event

      if (active.data.current) {
        setActiveInfo(active.data.current.info)
        setRatioVal(calculateRatio(active.data.current.info))
        setActiveProperties(getProperties(active.data.current.info))
      }
      setActiveId(Number(active.id))
    },
    [calculateRatio, getProperties]
  )

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SelectElementArea />
      <SequencingArea onOpenSettingsModal={onOpenSettingsModal} />
      <DragOverlay zIndex={2} modifiers={[restrictToWindowEdges]}>
        {activeInfo && activeId ? (
          <OverlayDraggableWrapper
            id={activeInfo.displayString}
            info={activeInfo}
          >
            <AspectRatio ratio={ratioVal ?? 1}>
              <SelectElementButton
                nameText={activeInfo.displayString}
                properties={
                  activeProperties ?? {
                    type: 'KeyPressEventAction',
                    data: {
                      keypress: -1,
                      press_duration: 1,
                      keytype: KeyType[KeyType.DownUp]
                    }
                  }
                }
              />
            </AspectRatio>
          </OverlayDraggableWrapper>
        ) : undefined}
      </DragOverlay>
    </DndContext>
  )
}
