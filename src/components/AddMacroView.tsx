import { Input, Button, Flex, HStack, useColorMode, VStack, Text, IconButton, Alert, AlertIcon, AlertTitle, AlertDescription, Kbd } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { Link, useLocation, useRoute } from 'wouter';
import { useEffect, useState } from 'react';
import { Collection, Keypress } from "../types";
import { webCodeHIDLookup, HIDLookup } from '../HIDmap';

type Props = {
  collections: Collection[]
}

const AddMacroView = ({collections}: Props) => {
    const [match, params] = useRoute("/macroview/:cid");
    const [recording, setRecording] = useState(false)
    const [macroName, setMacroName] = useState("Macro Name")
    const [triggerKeys, setTriggerKeys] = useState<Keypress[]>([])
    const [location, setLocation] = useLocation();

    const addTriggerKey = (event:any) => {
        event.preventDefault()
        console.log(event)
        let HIDcode = webCodeHIDLookup.get(event.code)?.HIDcode
        if (HIDcode == undefined) { return }

        let keypress:Keypress = { keypress:HIDcode, press_duration:0}

        setTriggerKeys(triggerKeys => [...triggerKeys, keypress])
        if (triggerKeys.length == 3) { setRecording(false) }
    }

    useEffect(() => {
        if (!recording) { return }
        // Does not get mouse input for trigger        
        window.addEventListener("keydown", addTriggerKey, false)
        return () => {
            window.removeEventListener("keydown", addTriggerKey, false)
        }
    }, [addTriggerKey])

    const onRecordButtonPress = () => {
        if (!recording) {
            setTriggerKeys([])
        }
        
        setRecording(!recording)
    }

    const onSaveButtonPress = () => {
        if (match) {
            collections[parseInt(params.cid)].macros.push({name: macroName, active: true, trigger:{ type: "KeyPressEvent", data: triggerKeys }, sequence: ""})
        }
        setLocation("/")
    }

    const onMacroNameChange = (event:any) => {
        setMacroName(event.target.value)
    }

    return (
        <VStack minH="100vh" spacing="16px">
            <HStack w="100%" p="4" borderBottom="1px">
                <Link href='/'>
                    <Button>
                        Back
                    </Button>
                </Link>
                <Flex w="100%" justifyContent="space-between">
                    <Flex w="100%" gap="8px">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="24px">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                        </svg>
                        <Input variant='unstyled' placeholder='Macro Name' isRequired onChange={onMacroNameChange}/>
                    </Flex>
                </Flex>
                <Button colorScheme="yellow" isDisabled={!(triggerKeys.length > 0)} onClick={onSaveButtonPress}>Save Macro</Button>
            </HStack>
            {/** Trigger Area */}
            <VStack spacing="16px">
                <Text fontWeight="semibold" fontSize="xl">Trigger Key(s)</Text>
                <Button leftIcon={<EditIcon />} onClick={onRecordButtonPress} colorScheme={recording ? 'red' : 'gray'}>Record</Button>
                {recording &&   <Alert status='info' rounded="md">
                                    <AlertIcon />
                                    Input recording in progress.
                                </Alert>
                }
            </VStack>
            <HStack spacing="4px">
                {triggerKeys.map((key:Keypress, index:number) => 
                    <Kbd key={index}>{HIDLookup.get(key.keypress)?.displayString}</Kbd>
                )}
            </HStack>
        </VStack>
    )
}

export default AddMacroView