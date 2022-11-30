import { EditIcon } from '@chakra-ui/icons'
import {
  HStack,
  VStack,
  Alert,
  AlertIcon,
  Kbd,
  Button,
  Text,
  Divider,
  useColorModeValue
} from '@chakra-ui/react'
import { useEffect } from 'react'
import { useMacroContext } from '../../contexts/macroContext'
import { RecordingType } from '../../enums'
import useRecording from '../../hooks/useRecording'
import { HIDLookup } from '../../maps/HIDmap'
import { Keypress } from '../../types'

export default function TriggerArea() {
  const { recording, startRecording, stopRecording, items } = useRecording(
    RecordingType.Trigger
  )
  const { macro, updateTriggerKeys } = useMacroContext()
  const dividerColour = useColorModeValue('gray.400', 'gray.600')

  useEffect(() => {
    // remove the filter when backend updates trigger to allow mouse press
    updateTriggerKeys(
      items.filter((element): element is Keypress => 'keypress' in element)
    )
  }, [items, updateTriggerKeys])

  return (
    <VStack
      w="50%"
      h="full"
      py="4px"
      px="16px"
      border="1px"
      borderColor={dividerColour}
      rounded="md"
      justifyContent="center"
    >
      <HStack w="100%" justifyContent="space-between" minH="28px">
        <Text fontWeight="semibold" fontSize={['sm', 'md']}>
          Trigger Key(s)
        </Text>
        {recording && (
          <Alert
            status="info"
            colorScheme="yellow"
            rounded="md"
            h="28px"
            w="55%"
          >
            <AlertIcon />
            <Text fontSize={['2xs', 'xs', 'sm', 'md']}>
              Input recording in progress.
            </Text>
          </Alert>
        )}
      </HStack>
      <Divider borderColor={dividerColour} />
      <HStack w="100%" justifyContent="space-between">
        <VStack alignItems="normal" w="full" h="full">
          <HStack spacing="4px" h="full">
            {macro.trigger.data.map((key: Keypress) => (
              <Kbd key={key.keypress}>
                {HIDLookup.get(key.keypress)?.displayString}
              </Kbd>
            ))}
          </HStack>
        </VStack>
        <VStack alignItems="normal">
          <Button
            leftIcon={<EditIcon />}
            onClick={recording ? stopRecording : startRecording}
            colorScheme={recording ? 'red' : 'gray'}
          >
            {recording ? 'Stop' : 'Record'}
          </Button>
        </VStack>
      </HStack>
    </VStack>
  )
}
