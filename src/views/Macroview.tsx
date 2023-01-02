import { ArrowBackIcon } from '@chakra-ui/icons'
import {
  VStack,
  HStack,
  useColorModeValue,
  useDisclosure,
  Button,
  Flex,
  Input,
  IconButton,
  Tooltip,
  Box
} from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import EditArea from '../components/macroview/EditArea'
import SelectElementArea from '../components/macroview/SelectElementArea'
import SequencingArea from '../components/macroview/SequencingArea'
import TriggerArea from '../components/macroview/TriggerArea'
import TriggerModal from '../components/macroview/TriggerModal'
import { useApplicationContext } from '../contexts/applicationContext'
import { useMacroContext } from '../contexts/macroContext'
import EmojiModal from '../components/macroview/EmojiModal'

type Props = {
  isEditing: boolean
}

export default function Macroview({ isEditing }: Props) {
  const { changeSelectedMacroIndex } = useApplicationContext()
  const {
    macro,
    sequence,
    changeIsUpdatingMacro,
    updateMacroName,
    updateMacro
  } = useMacroContext()
  const borderColour = useColorModeValue(
    'primary-light.500',
    'primary-dark.500'
  )
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isOpenEmoji,
    onOpen: onOpenEmoji,
    onClose: onCloseEmoji
  } = useDisclosure()
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (isEditing) {
      setInputValue(macro.name)
    }
    changeIsUpdatingMacro(isEditing)
  }, [isEditing, changeIsUpdatingMacro, macro.name])

  const saveButtonTooltipText = useMemo((): string => {
    if (
      (macro.trigger.type === 'KeyPressEvent' &&
        macro.trigger.data.length === 0) ||
      (macro.trigger.type === 'MouseEvent' && macro.trigger.data === undefined)
    ) {
      return 'Please set your trigger keys!'
    } else if (sequence.length === 0) {
      return 'Please add something to the sequence!'
    } else {
      return ''
    }
  }, [macro.trigger.data, macro.trigger.type, sequence.length])

  return (
    <VStack h="100%" spacing="0px" overflow="hidden">
      {/** Top Header */}
      <HStack
        w="100%"
        h="80px"
        p="2"
        spacing="16px"
        justifyContent="space-between"
      >
        <Flex w="30%" alignItems="center" gap="4">
          <IconButton
            aria-label="Back Button"
            variant="brand"
            icon={<ArrowBackIcon />}
            size="sm"
            onClick={() => {
              changeSelectedMacroIndex(undefined)
            }}
          />
          <Box
            _hover={{ transform: 'scale(110%)' }}
            maxHeight="32px"
            transition="ease-out 150ms"
            onClick={onOpenEmoji}
            id="emoji-button-2"
          >
            <em-emoji shortcodes={macro.icon} size="32px" />
          </Box>
          <EmojiModal isOpen={isOpenEmoji} onClose={onCloseEmoji} />
          <VStack spacing={1}>
            <Input
              variant="brand"
              placeholder="Macro Name"
              _placeholder={{ opacity: 1, color: borderColour }}
              onChange={(event) => setInputValue(event.target.value)}
              onBlur={(event) => updateMacroName(event.target.value)}
              value={inputValue}
            />
          </VStack>
        </Flex>
        {/* <MacroTypeArea /> */}
        <TriggerArea onOpen={onOpen} />
        <Tooltip
          variant="brand"
          label={saveButtonTooltipText}
          aria-label="Save Button Tooltip"
          hasArrow
          rounded="sm"
        >
          <Button
            size="sm"
            variant="yellowGradient"
            isDisabled={
              (macro.trigger.type === 'KeyPressEvent' &&
                macro.trigger.data.length === 0) ||
              (macro.trigger.type === 'MouseEvent' &&
                macro.trigger.data === undefined) ||
              sequence.length === 0
            }
            onClick={updateMacro}
          >
            Save Macro
          </Button>
        </Tooltip>
      </HStack>
      <TriggerModal isOpen={isOpen} onClose={onClose} />
      <HStack
        w="100%"
        h="calc(100% - 80px)"
        borderTop="1px"
        borderColor={borderColour}
        spacing="0"
      >
        {/** Bottom Panels */}
        <SelectElementArea />
        <SequencingArea />
        <EditArea />
      </HStack>
    </VStack>
  )
}
