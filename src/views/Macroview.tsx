import { VStack, HStack, useColorModeValue } from '@chakra-ui/react'
import { BaseSyntheticEvent, useCallback, useEffect, useState } from 'react'
import { useApplicationContext } from '../contexts/applicationContext'
import { useSelectedCollection, useSelectedMacro } from '../contexts/selectors'
import { KeyType, MacroType, RecordingType } from '../enums'
import { webCodeHIDLookup } from '../maps/HIDmap'
import { Keypress, Collection, Macro, MousePressAction } from '../types'
import { updateBackendConfig } from '../utils'
import EditArea from '../components/macroview/EditArea'
import MacroviewHeader from '../components/macroview/Header'
import MacroTypeArea from '../components/macroview/MacroTypeArea'
import SelectElementArea from '../components/macroview/SelectElementArea'
import SequencingArea from '../components/macroview/SequencingArea'
import TriggerArea from '../components/macroview/TriggerArea'
import { useSequenceContext } from '../contexts/sequenceContext'
import useRecording from '../hooks/useRecording'

type Props = {
  isEditing: boolean
}

const Macroview = ({ isEditing }: Props) => {
  const { collections, selection, changeSelectedMacroIndex } = useApplicationContext()
  const {
    sequence,
    ids,
    overwriteSequence,
    overwriteIds,
    updateSelectedElementId
  } = useSequenceContext()
  const currentCollection: Collection = useSelectedCollection()
  const currentMacro: Macro = useSelectedMacro()
  const { recording, toggle, items } = useRecording(RecordingType.Trigger)
  const [macroName, setMacroName] = useState('Macro Name')
  const [triggerKeys, setTriggerKeys] = useState<
    Keypress[]
  >([])
  const [selectedMacroType, setSelectedMacroType] = useState(0)
  // need state for 'allow_while_other_keys', just a boolean
  const dividerColour = useColorModeValue('gray.400', 'gray.600')

  useEffect(() => {
    if (!isEditing) {
      overwriteSequence([])
      return
    }
    // this could be cleaned up later
    updateSelectedElementId(-1)
    setMacroName(currentMacro.name)
    setTriggerKeys(currentMacro.trigger.data)
    overwriteSequence(currentMacro.sequence)
  }, [currentMacro, isEditing, overwriteSequence, updateSelectedElementId])

  useEffect(() => {
    console.log(items)
    setTriggerKeys(
      items.filter(
        (element): element is Keypress => 'keypress' in element
      )
    )
  }, [items])

  const onMacroTypeButtonPress = (index: number) => {
    setSelectedMacroType(index)
  }

  const onMacroNameChange = (event: BaseSyntheticEvent) => {
    setMacroName(event.target.value)
  }

  const onSaveButtonPress = () => {
  
    const itemToAdd: Macro = {
      name: macroName,
      active: true,
      macro_type: MacroType[selectedMacroType],
      trigger: {
        type: 'KeyPressEvent',
        data: triggerKeys,
        allow_while_other_keys: false
      },
      sequence: ids.map((id) => sequence[id - 1])
    }

    if (isEditing) {
      currentCollection.macros[selection.macroIndex] = itemToAdd
    } else {
      currentCollection.macros.push(itemToAdd)
    }

    overwriteIds([])
    overwriteSequence([])
    updateSelectedElementId(-1)
    changeSelectedMacroIndex(-1)
    updateBackendConfig(collections)
  }

  return (
    <VStack h="100%" spacing="0px" overflow="hidden">
      <MacroviewHeader
        triggerKeys={triggerKeys}
        macroName={macroName}
        isEditing={isEditing}
        onMacroNameChange={onMacroNameChange}
        onSaveButtonPress={onSaveButtonPress}
      />
      <HStack w="100%" h={130} spacing="8px" p="8px">
        <MacroTypeArea
          selectedMacroType={selectedMacroType}
          onMacroTypeButtonPress={onMacroTypeButtonPress}
        />
        <TriggerArea
          recording={recording}
          triggerKeys={triggerKeys}
          onRecordButtonPress={toggle}
        />
      </HStack>
      <HStack
        w="100%"
        h="calc(100% - 190px)"
        borderTop="1px"
        borderColor={dividerColour}
        spacing="0"
      >
        {/** Bottom Panels */}
        <SelectElementArea />
        <SequencingArea />
        <EditArea />
      </HStack>
    </VStack>
  )
}

export default Macroview
