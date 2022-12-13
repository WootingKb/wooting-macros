import { EditIcon } from '@chakra-ui/icons'
import {
  HStack,
  Kbd,
  Button,
  Text,
  useColorModeValue,
  StackDivider,
} from '@chakra-ui/react'
import { useMacroContext } from '../../contexts/macroContext'
import { HIDLookup } from '../../maps/HIDmap'
import { mouseEnumLookup } from '../../maps/MouseMap'

type Props = {
  onOpen: () => void
}

export default function TriggerArea({ onOpen }: Props) {
  const { macro } = useMacroContext()
  const borderColour = useColorModeValue('stone.500', 'zinc.500')

  return (
    <HStack
      w="50%"
      h="fit"
      p="2"
      divider={<StackDivider />}
      border="1px"
      borderColor={borderColour}
      rounded="md"
      justifyContent="space-between"
    >
      <Text fontWeight="semibold" fontSize={['xs', 'sm']}>
        Trigger
      </Text>
      <HStack spacing="4px" w="full" h="full" justifyContent="center">
        {macro.trigger.type === 'KeyPressEvent' &&
          macro.trigger.data.map((HIDcode) => (
            <Kbd variant="brand" key={HIDcode}>
              {HIDLookup.get(HIDcode)?.displayString}
            </Kbd>
          ))}
        {macro.trigger.type === 'MouseEvent' && (
          <Kbd>{mouseEnumLookup.get(macro.trigger.data)?.displayString}</Kbd>
        )}
      </HStack>
      <Button variant="brand" size="xs" px="5" leftIcon={<EditIcon />} onClick={onOpen}>
        Edit
      </Button>
    </HStack>
  )
}
