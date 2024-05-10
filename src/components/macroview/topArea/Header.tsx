import { ArrowBackIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Tooltip,
  VStack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useApplicationContext } from '../../../contexts/applicationContext'
import { useMacroContext } from '../../../contexts/macroContext'
import { useSelectedMacro } from '../../../contexts/selectors'
import EmojiPopover from '../../EmojiPopover'
import TriggerArea from './TriggerArea'
import TriggerModal from './TriggerModal'
import UnsavedChangesModal from '../UnsavedChangesModal'
import useMainBgColour from '../../../hooks/useMainBgColour'
import MacroTypeArea from './MacroTypeArea'
import MacroStateControls from './MacroStateButtons'

interface Props {
  isEditing: boolean
}

export default function Header({ isEditing }: Props) {
  const { changeSelectedMacroIndex } = useApplicationContext()
  const {
    macro,
    sequence,
    canSaveMacro,
    updateMacroName,
    updateMacro,
    updateMacroIcon
  } = useMacroContext()
  const currentMacro = useSelectedMacro()
  const [hasUserChangedIcon, setHasUserChangedIcon] = useState(false)
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
    isOpen: isEmojiPopoverOpen,
    onOpen: onEmojiPopoverOpen,
    onClose: onEmojiPopoverClose
  } = useDisclosure()
  const {
    isOpen: isUnsavedChangesModalOpen,
    onOpen: onUnsavedChangesModalOpen,
    onClose: onUnsavedChangesModalClose
  } = useDisclosure()
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (isEditing) {
      setInputValue(macro.name)
    }
  }, [isEditing, macro.name])

  useEffect(() => {
    if (!isEditing) {
      onTriggerModalOpen()
    }
  }, [isEditing, onTriggerModalOpen])

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

  const onEmojiSelect = useCallback(
    (emoji: { shortcodes: string }) => {
      updateMacroIcon(emoji.shortcodes)
      setHasUserChangedIcon(true)
      onEmojiPopoverClose()
    },
    [onEmojiPopoverClose, updateMacroIcon]
  )

  const onBackButtonPress = useCallback(() => {
    if (currentMacro !== undefined) {
      if (
        currentMacro.trigger === macro.trigger &&
        sequence === macro.sequence &&
        currentMacro.name === macro.name &&
        currentMacro.icon === macro.icon
      ) {
        changeSelectedMacroIndex(undefined)
        return
      }
      onUnsavedChangesModalOpen()
    } else {
      if (
        sequence.length > 0 ||
        (macro.trigger.type === 'KeyPressEvent' &&
          macro.trigger.data.length > 0) ||
        (macro.trigger.type === 'MouseEvent' &&
          macro.trigger.data !== undefined) ||
        macro.name !== '' ||
        hasUserChangedIcon
      ) {
        onUnsavedChangesModalOpen()
      } else {
        changeSelectedMacroIndex(undefined)
      }
    }
  }, [
    changeSelectedMacroIndex,
    currentMacro,
    hasUserChangedIcon,
    macro.icon,
    macro.name,
    macro.macro_type,
    macro.sequence,
    macro.trigger,
    onUnsavedChangesModalOpen,
    sequence
  ])

  return (
    <>
      <VStack
        zIndex={1}
        bg={useMainBgColour()}
        w="full"
        py={2}
        px={{ base: 2, md: 4, xl: 6 }}
        spacing={4}
        shadow={shadowColour}
        justifyContent="space-between"
        justifyItems="center"
      >
        <HStack justifyContent="space-between" w="full">
          <Flex h="full" alignItems="center" gap="4" w="full">
            <IconButton
              aria-label="Back"
              variant="brand"
              icon={<ArrowBackIcon />}
              size="sm"
              onClick={onBackButtonPress}
            />
            <EmojiPopover
              shortcodeToShow={macro.icon}
              isEmojiPopoverOpen={isEmojiPopoverOpen}
              onEmojiPopoverClose={onEmojiPopoverClose}
              onEmojiPopoverOpen={onEmojiPopoverOpen}
              onEmojiSelect={onEmojiSelect}
            />
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
          <Flex gap={4} alignItems="center">
            <Tooltip
              variant="brand"
              label={saveButtonTooltipText}
              placement="bottom-start"
              hasArrow
            >
              <Box>
                <Button
                  size={{ base: 'md', lg: 'lg' }}
                  variant="yellowGradient"
                  isDisabled={!canSaveMacro}
                  onClick={updateMacro}
                  aria-label="Save"
                >
                  Save Macro
                </Button>
              </Box>
            </Tooltip>
          </Flex>
        </HStack>
        <HStack justifyContent="center" w="full">
          <MacroTypeArea />
          <TriggerArea onOpen={onTriggerModalOpen} />
          <MacroStateControls macro_data={macro} />
        </HStack>
      </VStack>
      <UnsavedChangesModal
        isOpen={isUnsavedChangesModalOpen}
        onClose={onUnsavedChangesModalClose}
      />
      <TriggerModal isOpen={isTriggerModalOpen} onClose={onTriggerModalClose} />
    </>
  )
}
