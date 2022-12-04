import {
  HStack,
  VStack,
  IconButton,
  Text,
  Divider,
  useColorModeValue
} from '@chakra-ui/react'
import { useMacroContext } from '../../contexts/macroContext'
import { MacroType, MacroTypeDefinitions } from '../../enums'
import { checkIfStringIsNonNumeric } from '../../utils'

export default function MacroTypeArea() {
  const { macro, updateMacroType } = useMacroContext()
  const borderColour = useColorModeValue('gray.400', 'gray.600')
  const typeIcons = [
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={32}
      height={32}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
      />
    </svg>,
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={32}
      height={32}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
      />
    </svg>,
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={32}
      height={32}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
  ]

  return (
    <HStack
      w="50%"
      h="full"
      py="4px"
      px="16px"
      border="1px"
      borderColor={borderColour}
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
                icon={typeIcons[index]}
                aria-label="macro type button"
                size="lg"
                colorScheme={macro.macro_type === value ? 'yellow' : 'gray'}
                onClick={() => updateMacroType(index)}
                key={value}
              ></IconButton>
            ))}
        </HStack>
      </VStack>
      <Divider orientation="vertical" />
      <VStack w="full" h="full" alignItems="normal" justifyContent="center">
        <Text fontWeight="semibold" fontSize={['md', 'lg', 'xl']}>
          {macro.macro_type}
        </Text>
        <Text fontSize={['xs', 'sm', 'md', 'lg', 'xl']}>
          {
            MacroTypeDefinitions[
              MacroType[macro.macro_type as keyof typeof MacroType]
            ]
          }
        </Text>
      </VStack>
    </HStack>
  )
}
