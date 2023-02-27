import { VStack, HStack, AspectRatio } from '@chakra-ui/react'
import EditArea from '../components/macroview/rightPanel/EditArea'
import SelectElementArea from '../components/macroview/leftPanel/SelectElementArea'
import SequencingArea from '../components/macroview/centerPanel/SequencingArea'
import Header from '../components/macroview/topArea/Header'
import { useMacroContext } from '../contexts/macroContext'
import { useCallback, useEffect, useState } from 'react'
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
import SelectElementButton from '../components/macroview/leftPanel/SelectElementButton'
import { ActionEventType, ActiveInfo } from '../types'
import { checkIfKeyboardKey, checkIfMouseEvent } from '../constants/utils'
import { KeyType } from '../constants/enums'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { useSettingsContext } from '../contexts/settingsContext'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import OverlayDraggableWrapper from '../components/macroview/leftPanel/OverlayDraggableWrapper'

type Props = {
  isEditing: boolean
  onOpenSettingsModal: () => void
}

export default function Macroview({ isEditing, onOpenSettingsModal }: Props) {
  const { changeIsUpdatingMacro } = useMacroContext()
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

  useEffect(() => {
    changeIsUpdatingMacro(isEditing)
  }, [changeIsUpdatingMacro, isEditing])

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
    <VStack h="full" spacing="0px" overflow="hidden">
      {/** Top Header */}
      <Header isEditing={isEditing} />
      <HStack
        w="full"
        h={{
          base: 'calc(100% - 80px)',
          md: 'calc(100% - 100px)',
          xl: 'calc(100% - 120px)'
        }}
        spacing="0"
      >
        {/** Bottom Panels */}
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
        <EditArea />
      </HStack>
    </VStack>
  )
}
