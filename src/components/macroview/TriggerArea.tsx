import { EditIcon } from '@chakra-ui/icons'
import {
  HStack,
  VStack,
  Kbd,
  Button,
  Text,
  Divider,
  useColorModeValue,
  useDisclosure,
  Box
} from '@chakra-ui/react'
import { useMacroContext } from '../../contexts/macroContext'
import { HIDLookup } from '../../maps/HIDmap'
import { mouseEnumLookup } from '../../maps/MouseMap'
import { Keypress } from '../../types'
import TriggerModal from './TriggerModal'

export default function TriggerArea() {
  const { macro } = useMacroContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const borderColour = useColorModeValue('gray.400', 'gray.600')

  return (
    <VStack
      w="50%"
      h="full"
      py="4px"
      px="16px"
      border="1px"
      borderColor={borderColour}
      rounded="md"
      justifyContent="center"
    >
      <HStack w="100%" justifyContent="space-between" minH="28px">
        <Text fontWeight="semibold" fontSize={['sm', 'md']}>
          Trigger Key(s)
        </Text>
      </HStack>
      <Divider />
      <HStack w="100%" justifyContent="space-between">
        <VStack alignItems="normal" w="full" h="full">
          <HStack spacing="4px" h="full">
            {macro.trigger.type === "KeyPressEvent" && macro.trigger.data.map((key: Keypress) => (
              <Kbd key={key.keypress}>
                {HIDLookup.get(key.keypress)?.displayString}
              </Kbd>
            ))}
            {macro.trigger.type === "MouseEvent" &&
              <Box>
                {mouseEnumLookup.get(macro.trigger.data)?.displayString}
              </Box>}
          </HStack>
        </VStack>
        <VStack alignItems="normal">
          <Button leftIcon={<EditIcon />} onClick={onOpen}>
            Edit
          </Button>
        </VStack>
      </HStack>
      <TriggerModal isOpen={isOpen} onClose={onClose} />
    </VStack>
  )
}
