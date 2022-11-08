import { EditIcon } from '@chakra-ui/icons'
import { HStack, VStack, Alert, AlertIcon, Kbd, Button, Text, Divider } from '@chakra-ui/react'
import { HIDLookup } from '../HIDmap'
import { Keypress } from '../types'

type Props = {
    recording: boolean,
    triggerKeys: Keypress[],
    onRecordButtonPress: () => void,
}

const MacroviewTriggerArea = ({recording, triggerKeys, onRecordButtonPress}: Props) => {
  return (
    <VStack w="50%" h="full" py="4px" px="16px" border='1px' borderColor='gray.200' rounded="md" spacing="16px" justifyContent="center">
        <HStack w="100%" justifyContent="space-between">
            <Text fontWeight="semibold" fontSize={['sm', 'md']}>Trigger Key(s)</Text>
            {recording && 
                <Alert status='info' colorScheme="yellow" rounded="md" h="28px" w="55%">
                    <AlertIcon />
                    Input recording in progress.
                </Alert>
            }
        </HStack>
        <Divider />
        <HStack w="100%" justifyContent="space-between">
            <VStack alignItems="normal" w="full" h="full">
                <HStack spacing="4px" h="full">
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