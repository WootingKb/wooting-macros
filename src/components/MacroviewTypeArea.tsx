import { EditIcon } from '@chakra-ui/icons'
import { HStack, VStack, IconButton, Text } from '@chakra-ui/react'
import { MacroType } from '../enums'
import { checkIfStringIsNonNumeric } from '../utils'

type Props = {
    selectedMacroType: MacroType,
    onMacroTypeButtonPress: (index:number) => void,
}

const MacroviewTypeArea = ({selectedMacroType, onMacroTypeButtonPress}: Props) => {
  return (
    <HStack w="50%" h="full" p="4" justifyContent="space-between" bg="gray.300">
        <VStack spacing="16px" alignItems="normal" h="full">
            <Text fontWeight="semibold" fontSize="xl">Macro Type</Text>
            <HStack>
                {(Object.keys(MacroType) as Array<keyof typeof MacroType>).filter(checkIfStringIsNonNumeric).map((value:string, index:number) => 
                    <IconButton icon={<EditIcon />} aria-label="macro type button" bg={MacroType[selectedMacroType] === value ? "yellow.200" : "gray.100"} onClick={() => onMacroTypeButtonPress(index)} key={index}></IconButton>
                )}
            </HStack>
        </VStack>
        <VStack spacing="16px" alignItems="normal" h="full">
            <Text fontWeight="semibold" fontSize="xl">{MacroType[selectedMacroType]}</Text>
            <Text fontSize={['sm', 'md', 'lg', 'xl']}>The macro will loop itself after it finishes until the trigger key(s) is pressed again.</Text>
        </VStack>
    </HStack>
  )
}

export default MacroviewTypeArea