import { ArrowBackIcon } from '@chakra-ui/icons'
import {
  VStack,
  HStack,
  useColorModeValue,
  useDisclosure,
  Button,
  Flex,
  Text,
  Input,
  IconButton,
  Tooltip,
  Box
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import EditArea from '../components/macroview/EditArea'
import SelectElementArea from '../components/macroview/SelectElementArea'
import SequencingArea from '../components/macroview/SequencingArea'
import TriggerArea from '../components/macroview/TriggerArea'
import TriggerModal from '../components/macroview/TriggerModal'
import { useApplicationContext } from '../contexts/applicationContext'
import { useMacroContext } from '../contexts/macroContext'
import EmojiModal from '../components/macroview/EmojiModal'
import { maxNameLength } from '../utils'

export default function Macroview() {
  const { collections, changeSelectedMacroIndex } = useApplicationContext()
  const [oldMacroName, setOldMacroName] = useState('')
  const { macro, sequence, isUpdatingMacro, updateMacroName, updateMacro } =
    useMacroContext()
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
  const [isNameUsable, setIsNameUsable] = useState(false)

  useEffect(() => {
    if (isUpdatingMacro) {
      setOldMacroName(macro.name)
      setIsNameUsable(true)
    }
  }, [isUpdatingMacro, macro.name])

  const getSaveButtonTooltipText = useCallback((): string => {
    if (
      (macro.trigger.type === 'KeyPressEvent' &&
        macro.trigger.data.length === 0) ||
      (macro.trigger.type === 'MouseEvent' && macro.trigger.data === undefined)
    ) {
      return 'Please set your trigger keys!'
    } else if (sequence.length === 0) {
      return 'Please add something to the sequence!'
    } else if (macro.name === '') {
      return 'Please name your macro!'
    } else if (!isNameUsable) {
      return 'Please give your macro a unique name!'
    } else {
      return ''
    }
  }, [
    isNameUsable,
    macro.name,
    macro.trigger.data,
    macro.trigger.type,
    sequence.length
  ])

  const onMacroNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newName: string = event.target.value
      if (newName === '') {
        updateMacroName(newName)
        setIsNameUsable(false)
        return
      } else if (newName.length > maxNameLength) {
        setIsNameUsable(false)
        return
      }

      if (isUpdatingMacro) {
        console.log("Can't change name of existing macro!")
        if (newName.toUpperCase() === oldMacroName.toUpperCase()) {
          updateMacroName(newName)
          setIsNameUsable(true)
        }
        return
      }

      let matchFound = false

      collections.forEach((collection) => {
        for (let i = 0; i < collection.macros.length; i++) {
          const macro = collection.macros[i]
          if (macro.name.toUpperCase() === newName.trim().toUpperCase()) {
            console.log('Name already exists!')
            updateMacroName(newName)
            matchFound = true
            setIsNameUsable(false)
            return
          }
        }
      })

      if (!matchFound) {
        updateMacroName(newName)
        setIsNameUsable(true)
      }

      console.log(matchFound)
    },
    [collections, isUpdatingMacro, oldMacroName, updateMacroName]
  )

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
          <VStack spacing={0}>
            <Input
              variant="brand"
              placeholder="Macro Name"
              _placeholder={{ opacity: 1, color: borderColour }}
              isInvalid={!isNameUsable}
              onChange={onMacroNameChange}
              value={macro.name}
              isRequired
            />
            {macro.name.length === 25 && (
              <Text w="100%" fontSize="2xs" fontWeight="semibold">
                Max length is 25 characters
              </Text>
            )}
          </VStack>
        </Flex>
        {/* <MacroTypeArea /> */}
        <TriggerArea onOpen={onOpen} />
        <Tooltip
          variant="brand"
          label={getSaveButtonTooltipText()}
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
              sequence.length === 0 ||
              !isNameUsable
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
