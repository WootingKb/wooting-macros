import { EditIcon } from '@chakra-ui/icons'
import {
  HStack,
  Kbd,
  Button,
  Text,
  useColorModeValue,
  StackDivider
} from '@chakra-ui/react'
import { useMacroContext } from '../../contexts/macroContext'
import { HIDLookup } from '../../maps/HIDmap'
import { mouseEnumLookup } from '../../maps/MouseMap'

type Props = {
  onOpen: () => void
}

export default function TriggerArea({ onOpen }: Props) {
  const { macro } = useMacroContext()
  const secondBg = useColorModeValue('blue.50', 'primary-dark.800')
  const shadowColour = useColorModeValue('sm', 'white-sm')

  return (
    <HStack
      w="fit"
      minW="40%"
      h="fit"
      py={2}
      px={4}
      spacing={0}
      gap={2}
      divider={<StackDivider />}
      shadow={shadowColour}
      rounded="md"
      justifyContent="space-between"
    >
      <Text fontWeight="semibold" fontSize={['xs', 'sm']} whiteSpace="nowrap">
        Trigger Keys
      </Text>
      <HStack
        gap={2}
        w="full"
        h="27px"
        justifyContent="center"
        bg={secondBg}
        rounded="md"
        py="1"
        px="2"
        shadow="inner"
      >
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
      <Button
        variant="brandAccent"
        size="sm"
        px={6}
        leftIcon={<EditIcon />}
        onClick={onOpen}
      >
        Edit
      </Button>
    </HStack>
  )
}
