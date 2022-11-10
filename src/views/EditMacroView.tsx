import { BaseSyntheticEvent, useEffect, useState } from 'react'
import { ActionEventType, Collection, Keypress, Macro } from '../types'
import { webCodeHIDLookup } from '../HIDmap'
import { HStack, VStack, Divider } from '@chakra-ui/react'
import { updateBackendConfig } from '../utils'
import { KeyType, MacroType, ViewState } from '../enums'
import MacroviewHeader from '../components/macroview/MacroviewHeader'
import MacroviewTypeArea from '../components/macroview/MacroviewTypeArea'
import MacroviewTriggerArea from '../components/macroview/MacroviewTriggerArea'
import MacroviewEditElementArea from '../components/macroview/MacroviewEditElementArea'
import MacroviewSequenceElementArea from '../components/macroview/MacroviewSequenceElementArea'
import MacroviewSequencingArea from '../components/macroview/MacroviewSequencingArea'
import { useApplicationContext } from '../contexts/applicationContext'
import { useSelectedCollection, useSelectedMacro } from '../contexts/selectors'

const EditMacroView = () => {
  const { collections, selection, changeViewState } = useApplicationContext()

  const currentCollection: Collection = useSelectedCollection()
  const currentMacro: Macro = useSelectedMacro()

  const [recording, setRecording] = useState(false)
  const [macroName, setMacroName] = useState('')
  const [triggerKeys, setTriggerKeys] = useState<Keypress[]>([])
  const [sequenceList, setSequenceList] = useState<ActionEventType[]>([])
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
    currentCollection.macros[selection.macroIndex] = {
      name: macroName,
      active: true,
      macro_type: MacroType[selectedMacroType],
      trigger: { type: 'KeyPressEvent', data: triggerKeys },
      sequence: []
    }
    changeViewState(ViewState.Overview)
    updateBackendConfig(collections)
  }

  const onSequenceChange = (newList: ActionEventType[]) => {
    console.log(newList)
    setSequenceList(newList)
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
        <MacroviewTypeArea
          selectedMacroType={selectedMacroType}
          onMacroTypeButtonPress={onMacroTypeButtonPress}
        />
        {/** Trigger Area */}
        <MacroviewTriggerArea
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
        <MacroviewSequenceElementArea
          sequenceList={sequenceList}
          onSequenceChange={onSequenceChange}
        />
        {/** Center Panel */}
        <MacroviewSequencingArea
          sequenceList={sequenceList}
          onSequenceChange={onSequenceChange}
        />
        {/** Right Panel */}
        <MacroviewEditElementArea
          sequenceList={sequenceList}
          onSequenceChange={onSequenceChange}
        />
      </HStack>
    </VStack>
  )
}

export default EditMacroView
