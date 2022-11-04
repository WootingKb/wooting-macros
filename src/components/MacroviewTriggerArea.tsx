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
    <HStack w="50%" h="full" p="4" bg="gray.400">
        <VStack alignItems="normal" w="full" h="full">
            {recording && 
                <Alert status='info' rounded="md" h="32px">
                    <AlertIcon />
                    Input recording in progress.
                </Alert>
            }
            <Text fontWeight="semibold" fontSize="xl">Trigger Key(s)</Text>
            <HStack spacing="4px">
                {triggerKeys.map((key:Keypress, index:number) => 
                    <Kbd key={index}>{HIDLookup.get(key.keypress)?.displayString}</Kbd>
                    )}
            </HStack>
        </VStack>
        <VStack maxWidth="50%" alignItems="normal">
            <Button leftIcon={<EditIcon />} onClick={onRecordButtonPress} colorScheme={recording ? 'red' : 'gray'}>Record</Button>
        </VStack>
    </HStack>
  )
}

export default MacroviewTriggerArea