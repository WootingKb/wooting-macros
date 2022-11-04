import { EditIcon } from '@chakra-ui/icons'
import { HStack, VStack, Alert, AlertIcon, Kbd, Button, Text } from '@chakra-ui/react'
import { HIDLookup } from '../HIDmap'
import { Keypress } from '../types'

type Props = {
    recording: boolean,
    triggerKeys: Keypress[],
    onRecordButtonPress: () => void,
}

const MacroviewTriggerArea = ({recording, triggerKeys, onRecordButtonPress}: Props) => {
  return (
    <VStack w="50%" h="full" p="4" bg="gray.400" spacing="16px">
        <HStack w="100%" justifyContent="space-between">
            <Text fontWeight="semibold" fontSize="xl">Trigger Key(s)</Text>
            {recording && 
                <Alert status='info' rounded="md" h="28px" w="55%">
                    <AlertIcon />
                    Input recording in progress.
                </Alert>
            }
        </HStack>
        <HStack w="100%" justifyContent="space-between">
            <VStack alignItems="normal" w="full" h="full">
                <HStack spacing="4px">
                    {triggerKeys.map((key:Keypress, index:number) => 
                        <Kbd key={index}>{HIDLookup.get(key.keypress)?.displayString}</Kbd>
                        )}
                </HStack>
            </VStack>
            <VStack alignItems="normal">
                <Button leftIcon={<EditIcon />} onClick={onRecordButtonPress} colorScheme={recording ? 'red' : 'gray'}>Record</Button>
            </VStack>
        </HStack>
    </VStack>
  )
}

export default MacroviewTriggerArea