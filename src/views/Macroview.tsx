import { ArrowBackIcon } from '@chakra-ui/icons'
import {
  VStack,
  HStack,
  useColorModeValue,
  useDisclosure,
  Button,
  Flex,
  Text,
  Image,
  Input,
  IconButton,
  Tooltip,
  Box,
  Circle,
} from '@chakra-ui/react'
import { useCallback } from 'react'
import EditArea from '../components/macroview/EditArea'
import SelectElementArea from '../components/macroview/SelectElementArea'
import SequencingArea from '../components/macroview/SequencingArea'
import TriggerArea from '../components/macroview/TriggerArea'
import TriggerModal from '../components/macroview/TriggerModal'
import { useApplicationContext } from '../contexts/applicationContext'
import { useMacroContext } from '../contexts/macroContext'
import { open } from '@tauri-apps/api/dialog'
import { readBinaryFile } from '@tauri-apps/api/fs'
import { Buffer } from 'buffer'

export default function Macroview() {
  const { changeSelectedMacroIndex } = useApplicationContext()
  const { macro, sequence, updateMacroName, updateMacroIcon, updateMacro } =
    useMacroContext()
  const borderColour = useColorModeValue('gray.400', 'gray.600')
  const { isOpen, onOpen, onClose } = useDisclosure()

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
    } else {
      return ''
    }
  }, [macro.name, macro.trigger.data, macro.trigger.type, sequence.length])

  const onIconPress = useCallback(async () => {
    const path = await open({
      multiple: false,
      title: 'Select an image to use as an icon',
      filters: [
        {
          name: 'Image',
          extensions: ['png', 'jpeg']
        }
      ]
    })
    if (path === null || Array.isArray(path)) {
      return
    }
    let base64string = ''
    await readBinaryFile(path).then((res) => {
      base64string = Buffer.from(res).toString('base64')
    })
    if (base64string !== '') {
      updateMacroIcon("data:image/png;base64," + base64string)
    }
  }, [updateMacroIcon])

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
        <Flex
          w="33%"
          justifyContent="space-between"
          alignItems="center"
          gap="4"
        >
          <IconButton
            aria-label="Back Button"
            icon={<ArrowBackIcon />}
            size="sm"
            onClick={() => {
              // remove any event listeners from macroview, if the user closes the macro view while the sequence recording button is still going (same needs to be done in the save button below)
              changeSelectedMacroIndex(undefined)
            }}
          />
          <Circle position="relative" role="group" onClick={onIconPress}>
            <Image
              borderRadius="full"
              border="1px"
              borderColor={borderColour}
              src={macro.icon}
              fallbackSrc="https://via.placeholder.com/125"
              alt="Macro Icon"
              boxSize="50px"
              objectFit="cover"
            />
            <Box
              position="absolute"
              bg="gray.700"
              opacity="0%"
              rounded="full"
              w="100%"
              h="100%"
              _groupHover={{ opacity: '50%', cursor: 'pointer' }}
            ></Box>
            <Text
              position="absolute"
              fontWeight="bold"
              fontSize="3xs"
              textColor="white"
              opacity="0%"
              _groupHover={{ opacity: '100%', cursor: 'pointer' }}
            >
              Change Icon
            </Text>
          </Circle>
          <Input
            variant="flushed"
            w="full"
            placeholder="Macro Name"
            isInvalid={macro.name === ''}
            isRequired
            onChange={(event) => {
              updateMacroName(event.target.value)
            }}
            value={macro.name}
          />
        </Flex>
        {/* <MacroTypeArea /> */}
        <TriggerArea onOpen={onOpen} />
        <Tooltip
          label={getSaveButtonTooltipText()}
          aria-label="Save Button Tooltip"
          hasArrow
          placement="auto-end"
          rounded="sm"
        >
          <Button
            size="sm"
            colorScheme="yellow"
            isDisabled={
              (macro.trigger.type === 'KeyPressEvent' &&
                macro.trigger.data.length === 0) ||
              (macro.trigger.type === 'MouseEvent' &&
                macro.trigger.data === undefined) ||
              sequence.length === 0 ||
              macro.name === ''
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
