import { BaseSyntheticEvent, useEffect, useState } from 'react'
import { ActionEventType, Collection, Keypress } from '../types'
import { webCodeHIDLookup } from '../HIDmap'
import { HStack, VStack } from '@chakra-ui/react'
import { updateBackendConfig } from '../utils'
import { KeyType, MacroType, ViewState } from '../enums'
import MacroviewHeader from '../components/macroview/Header'
import MacroTypeArea from '../components/macroview/MacroTypeArea'
import TriggerArea from '../components/macroview/TriggerArea'
import SelectElementArea from '../components/macroview/SelectElementArea'
import SequencingArea from '../components/macroview/SequencingArea'
import EditArea from '../components/macroview/EditArea'
import { useApplicationContext } from '../contexts/applicationContext'
import { useSelectedCollection } from '../contexts/selectors'

const AddMacroView = () => {
  const { collections, changeViewState } = useApplicationContext()

  const currentCollection: Collection = useSelectedCollection()

  const [recording, setRecording] = useState(false)
  const [temp, setTemp] = useState(false)
  const [macroName, setMacroName] = useState('Macro Name')
  const [triggerKeys, setTriggerKeys] = useState<Keypress[]>([])
  const [sequenceList, setSequenceList] = useState<ActionEventType[]>([])
  const [selectedMacroType, setSelectedMacroType] = useState(0)

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
    currentCollection.macros.push({
      name: macroName,
      active: true,
      macro_type: MacroType[selectedMacroType],
      trigger: { type: 'KeyPressEvent', data: triggerKeys },
      sequence: sequenceList
    })
    changeViewState(ViewState.Overview)
    updateBackendConfig(collections)
  }

  const onSequenceChange = () => {
    setTemp(!temp)
  }

  return (
    <VStack h="100%" spacing="0px" overflow="hidden">
      {/** Header */}
      <MacroviewHeader
        triggerKeys={triggerKeys}
        macroName={''}
        isEditing={false}
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
      <HStack
        w="100%"
        h="calc(100% - 190px)"
        borderTop="1px"
        borderColor="gray.200"
      >
        {/** Left Panel */}
        <SelectElementArea
          sequenceList={sequenceList}
          onSequenceChange={onSequenceChange}
        />
        {/** Center Panel */}
        <SequencingArea
          sequenceList={sequenceList}
          onSequenceChange={onSequenceChange}
        />
        {/** Right Panel */}
        <EditArea
          sequenceList={sequenceList}
          onSequenceChange={onSequenceChange}
        />
      </HStack>
    </VStack>
  )
}

export default AddMacroView
