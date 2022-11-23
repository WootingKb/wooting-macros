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
import { HIDLookup } from '../../maps/HIDmap'
import { Keypress } from '../../types'

type Props = {
  recording: boolean
  triggerKeys: Keypress[]
  onRecordButtonPress: () => void
}

const TriggerArea = ({
  recording,
  triggerKeys,
  onRecordButtonPress
}: Props) => {
  const dividerColour = useColorModeValue('gray.400', 'gray.600')

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
            {triggerKeys.map((key: Keypress, index: number) => (
              <Kbd key={index}>
                {HIDLookup.get(key.keypress)?.displayString}
              </Kbd>
            ))}
          </HStack>
        </VStack>
        <VStack alignItems="normal">
          <Button
            leftIcon={<EditIcon />}
            onClick={onRecordButtonPress}
            colorScheme={recording ? 'red' : 'gray'}
          >
            {recording ? 'Stop' : 'Record'}
          </Button>
        </VStack>
      </HStack>
    </VStack>
  )
}

export default TriggerArea
