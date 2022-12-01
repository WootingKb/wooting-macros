import { EditIcon } from '@chakra-ui/icons'
import {
  HStack,
  VStack,
  Kbd,
  Button,
  Text,
  Divider,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'
import { useMacroContext } from '../../contexts/macroContext'
import { HIDLookup } from '../../maps/HIDmap'
import { Keypress } from '../../types'
import TriggerModal from './TriggerModal'

export default function TriggerArea() {
  const { macro } = useMacroContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
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
            onClick={onOpen}
          >
            Edit
          </Button>
        </VStack>
      </HStack>
      <TriggerModal isOpen={isOpen} onClose={onClose}/>
    </VStack>
  )
}
