import { Input, Button, Flex, HStack } from '@chakra-ui/react'
import { useApplicationContext } from '../../contexts/applicationContext'
import { useMacroContext } from '../../contexts/macroContext'

type Props = {
  isEditing: boolean
}

export default function MacroviewHeader({ isEditing }: Props) {
  const { changeSelectedMacroIndex } = useApplicationContext()
  const { macro, sequence, updateMacroName, updateMacro } = useMacroContext()

  return (
    <HStack w="100%" h="60px" px="2" spacing="16px">
      <Button
        onClick={() => {
          changeSelectedMacroIndex(undefined)
        }}
      >
        Back
      </Button>
      <Flex w="100%" justifyContent="space-between">
        <Flex w="100%" gap="8px">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            width="24px"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
            />
          </svg>
          {isEditing && (
            <Input
              variant="flushed"
              w="35%"
              placeholder="Macro Name"
              isRequired
              onChange={(event) => {
                updateMacroName(event.target.value)
              }}
              value={macro.name}
            />
          )}
          {!isEditing && (
            <Input
              variant="flushed"
              w="35%"
              placeholder="Macro Name"
              isRequired
              onChange={(event) => {
                updateMacroName(event.target.value)
              }}
            />
          )}
        </Flex>
      </Flex>
      <Button
        colorScheme="yellow"
        isDisabled={
          macro.trigger.data.length === 0 ||
          sequence.length === 0 ||
          macro.name === ''
        }
        onClick={updateMacro}
      >
        Save Macro
      </Button>
    </HStack>
  )
}
