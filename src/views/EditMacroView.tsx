import { BaseSyntheticEvent, useEffect, useState } from 'react'
import { ActionEventType, Collection, Keypress, Macro } from '../types'
import { webCodeHIDLookup } from '../HIDmap'
import { HStack, VStack, Divider } from '@chakra-ui/react'
import { updateBackendConfig } from '../utils'
import { KeyType, MacroType, ViewState } from '../enums'
import MacroviewHeader from '../components/macroview/Header'
import MacroTypeArea from '../components/macroview/MacroTypeArea'
import TriggerArea from '../components/macroview/TriggerArea'
import EditArea from '../components/macroview/EditArea'
import SelectElementArea from '../components/macroview/SelectElementArea'
import SequencingArea from '../components/macroview/SequencingArea'
import { useApplicationContext } from '../contexts/applicationContext'
import {
  useSelectedCollection,
  useSelectedMacro,
  useSequence
} from '../contexts/selectors'

const EditMacroView = () => {
  const { collections, selection, changeViewState } = useApplicationContext()
  const sequence = useSequence()

  const currentCollection: Collection = useSelectedCollection()
  const currentMacro: Macro = useSelectedMacro()

  const [recording, setRecording] = useState(false)
  const [macroName, setMacroName] = useState('')
  const [triggerKeys, setTriggerKeys] = useState<Keypress[]>([])
  const [selectedMacroType, setSelectedMacroType] = useState(0)

  useEffect(() => {
    setMacroName(currentMacro.name)
    setTriggerKeys(currentMacro.trigger.data)
  }, [])

  const addTriggerKey = (event: KeyboardEvent) => {
    event.preventDefault()

    const HIDcode = webCodeHIDLookup.get(event.code)?.HIDcode
    if (HIDcode == undefined) {
      return
    }

    const keypress: Keypress = {
      keypress: HIDcode,
      press_duration: 0,
      keytype: KeyType[KeyType.Down]
    }

    setTriggerKeys((triggerKeys) => [...triggerKeys, keypress])
    if (triggerKeys.length == 3) {
      setRecording(false)
    }
  }

  useEffect(() => {
    if (!recording) {
      return
    }
    // Does not get mouse input for trigger
    window.addEventListener('keydown', addTriggerKey, false)
    // TODO: stop backend trigger listening
    return () => {
      window.removeEventListener('keydown', addTriggerKey, false)
      // TODO: start backend trigger listening
    }
  }, [addTriggerKey])

  const onRecordButtonPress = () => {
    if (!recording) {
      setTriggerKeys([])
    }
    setRecording(!recording)
  }

  const onMacroTypeButtonPress = (index: number) => {
    setSelectedMacroType(index)
  }

  const onMacroNameChange = (event: BaseSyntheticEvent) => {
    setMacroName(event.target.value)
  }

  const onSaveButtonPress = () => {
    const sequenceList: ActionEventType[] = sequence.map(
      (element) => element.data
    )
    currentCollection.macros[selection.macroIndex] = {
      name: macroName,
      active: true,
      macro_type: MacroType[selectedMacroType],
      trigger: { type: 'KeyPressEvent', data: triggerKeys },
      sequence: sequenceList
    }
    changeViewState(ViewState.Overview)
    updateBackendConfig(collections)
  }

  return (
    <VStack minH="100vh" spacing="0px" overflow="hidden">
      {/** Header */}
      <MacroviewHeader
        triggerKeys={triggerKeys}
        macroName={macroName}
        isEditing={true}
        onMacroNameChange={onMacroNameChange}
        onSaveButtonPress={onSaveButtonPress}
      />
      <HStack w="100%" h={130} spacing="8px" p="8px">
        {/** Macro Type Area */}
        <MacroTypeArea
          selectedMacroType={selectedMacroType}
          onMacroTypeButtonPress={onMacroTypeButtonPress}
        />
        {/** Trigger Area */}
        <TriggerArea
          recording={recording}
          triggerKeys={triggerKeys}
          onRecordButtonPress={onRecordButtonPress}
        />
      </HStack>
      <Divider />
      <HStack
        w="100%"
        h="calc(100% - 190px)"
        borderTop="1px"
        borderColor="gray.200"
      >
        {/** Left Panel */}
        <SelectElementArea />
        {/** Center Panel */}
        <SequencingArea />
        {/** Right Panel */}
        <EditArea />
      </HStack>
    </VStack>
  )
}

export default EditMacroView
