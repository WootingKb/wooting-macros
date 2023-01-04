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
  const bg = useColorModeValue('bg-light', 'primary-dark.900')
  const placeholderTextColour = useColorModeValue(
    'primary-light.300',
    'primary-dark.600'
  )
  const shadowColour = useColorModeValue('xs', 'white-xs')
  const {
    isOpen: isTriggerModalOpen,
    onOpen: onTriggerModalOpen,
    onClose: onTriggerModalClose
  } = useDisclosure()
  const {
    isOpen: isEmojiPickerOpen,
    onOpen: onEmojiPickerOpen,
    onClose: onEmojiPickerClose
  } = useDisclosure()
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    changeIsUpdatingMacro(isEditing)
    if (isEditing) {
      setInputValue(macro.name)
      return
    }
    onTriggerModalOpen()
  }, [isEditing, changeIsUpdatingMacro, macro.name, onTriggerModalOpen])

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
    <VStack h="full" spacing="0px" overflow="hidden">
      {/** Top Header */}
      <HStack
        zIndex={1}
        bg={bg}
        w="full"
        h={{ base: '80px', md: '100px', xl: '120px' }}
        p="2"
        gap={4}
        shadow={shadowColour}
        justifyContent="space-between"
      >
        <Flex w="50%" h="full" alignItems="center" gap="4">
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
            onClick={onEmojiPickerOpen}
            id="emoji-button-2"
          >
            <em-emoji shortcodes={macro.icon} size="32px" />
          </Box>
          <EmojiModal isOpen={isEmojiPickerOpen} onClose={onEmojiPickerClose} />
          <Input
            w="full"
            variant="flushed"
            placeholder="Macro Name"
            size="xl"
            textStyle="name"
            _placeholder={{ opacity: 1, color: placeholderTextColour }}
            onChange={(event) => setInputValue(event.target.value)}
            onBlur={(event) => updateMacroName(event.target.value)}
            value={inputValue}
            _focusVisible={{ borderColor: 'primary-accent.500' }}
          />
        </Flex>
        {/* <MacroTypeArea /> */}
        <TriggerArea onOpen={onTriggerModalOpen} />
        <Tooltip
          variant="brand"
          label={saveButtonTooltipText}
          aria-label="Save Button Tooltip"
          hasArrow
          rounded="sm"
        >
          <Button
            size={{ base: 'md', lg: 'lg' }}
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
      <TriggerModal isOpen={isTriggerModalOpen} onClose={onTriggerModalClose} />
      <HStack
        w="full"
        h={{
          base: 'calc(100% - 80px)',
          md: 'calc(100% - 100px)',
          xl: 'calc(100% - 120px)'
        }}
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
