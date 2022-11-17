import { EditIcon } from '@chakra-ui/icons'
import {
  HStack,
  VStack,
  IconButton,
  Text,
  Divider,
  useColorModeValue
} from '@chakra-ui/react'
import { MacroType, MacroTypeDefinitions } from '../../enums'
import { checkIfStringIsNonNumeric } from '../../utils'

type Props = {
  selectedMacroType: MacroType
  onMacroTypeButtonPress: (index: number) => void
}

const MacroTypeArea = ({
  selectedMacroType,
  onMacroTypeButtonPress
}: Props) => {
  const dividerColour = useColorModeValue('gray.400', 'gray.600')

  return (
    <HStack
      w="50%"
      h="full"
      py="4px"
      px="16px"
      border="1px"
      borderColor={dividerColour}
      rounded="md"
      spacing="16px"
    >
      <VStack w="fit-content" alignItems="normal">
        <Text fontWeight="semibold" fontSize={['sm', 'md']}>
          Macro Type
        </Text>
        <HStack>
          {(Object.keys(MacroType) as Array<keyof typeof MacroType>)
            .filter(checkIfStringIsNonNumeric)
            .map((value: string, index: number) => (
              <IconButton
                icon={<EditIcon />}
                aria-label="macro type button"
                size="lg"
                colorScheme={
                  MacroType[selectedMacroType] === value ? 'yellow' : 'gray'
                }
                onClick={() => onMacroTypeButtonPress(index)}
                key={index}
              ></IconButton>
            ))}
        </HStack>
      </VStack>
      <Divider orientation="vertical" borderColor={dividerColour} />
      <VStack w="full" h="full" alignItems="normal" justifyContent="center">
        <Text fontWeight="semibold" fontSize={['md', 'lg', 'xl']}>
          {MacroType[selectedMacroType]}
        </Text>
        <Text fontSize={['xs', 'sm', 'md', 'lg', 'xl']}>
          {MacroTypeDefinitions[selectedMacroType]}
        </Text>
      </VStack>
    </HStack>
  )
}

export default MacroTypeArea
