import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Collection, Keypress } from "../types";
import { webCodeHIDLookup, HIDLookup } from '../HIDmap';
import { HStack, VStack, Divider } from '@chakra-ui/react'
import { updateBackendConfig } from '../utils';
import { MacroType } from '../enums';
import MacroviewHeader from '../components/MacroviewHeader';
import MacroviewTypeArea from '../components/MacroviewTypeArea';
import MacroviewTriggerArea from '../components/MacroviewTriggerArea';
import MacroviewSequenceElementArea from '../components/MacroviewSequenceElementArea';
import MacroviewSequencingArea from '../components/MacroviewSequencingArea';
import MacroviewEditElementArea from '../components/MacroviewEditElementArea';

type Props = {
  collections: Collection[]
}

const AddMacroView = ({collections}: Props) => {
    const [match, params] = useRoute("/macroview/:cid");
    const [recording, setRecording] = useState(false)
    const [macroName, setMacroName] = useState("Macro Name")
    const [triggerKeys, setTriggerKeys] = useState<Keypress[]>([])
    const [location, setLocation] = useLocation();
    const [selectedMacroType, setSelectedMacroType] = useState(0)

    const addTriggerKey = (event:KeyboardEvent) => {
        event.preventDefault()
        
        let HIDcode = webCodeHIDLookup.get(event.code)?.HIDcode
        if (HIDcode == undefined) { return }

        let keypress:Keypress = { keypress:HIDcode, press_duration:0 }

        setTriggerKeys(triggerKeys => [...triggerKeys, keypress])
        if (triggerKeys.length == 3) { setRecording(false) }
    }

    useEffect(() => {
        if (!recording) { return }
        // Does not get mouse input for trigger        
        window.addEventListener("keydown", addTriggerKey, false)
        // TODO: stop backend trigger listening
        return () => {
            window.removeEventListener("keydown", addTriggerKey, false)
            // TODO: start backend trigger listening
        }
    }, [addTriggerKey])

    const onRecordButtonPress = () => {
        if (!recording) { setTriggerKeys([]) }
        setRecording(!recording)
    }

    const onMacroTypeButtonPress = (index:number) => {
        setSelectedMacroType(index)
    }

    const onMacroNameChange = (event:BaseSyntheticEvent) => {
        setMacroName(event.target.value)
    }

    const onSaveButtonPress = () => {
        if (match) {
            collections[parseInt(params.cid)].macros.push({name: macroName, active: true, macro_type: MacroType[selectedMacroType], trigger:{ type: "KeyPressEvent", data: triggerKeys }, sequence: []})
        }
        // update backend here
        updateBackendConfig(collections)
        setLocation("/")
    }

    return (
        <VStack minH="100vh">
            {/** Header */}
            <MacroviewHeader triggerKeys={triggerKeys} macroName={""} isEditing={false} onMacroNameChange={onMacroNameChange} onSaveButtonPress={onSaveButtonPress}/>
            <HStack w="100%" spacing="0px">
                {/** Macro Type Area */}
                <MacroviewTypeArea selectedMacroType={selectedMacroType} onMacroTypeButtonPress={onMacroTypeButtonPress}/>
                {/** Trigger Area */}
                <MacroviewTriggerArea recording={recording} triggerKeys={triggerKeys} onRecordButtonPress={onRecordButtonPress}/>
            </HStack>
            <Divider />
            <HStack w="100%" h="full">
                {/** Left Panel */}
                <MacroviewSequenceElementArea />
                {/** Center Panel */}
                <MacroviewSequencingArea />
                {/** Right Panel */}
                <MacroviewEditElementArea />
            </HStack>
        </VStack>
    )
}

export default AddMacroView