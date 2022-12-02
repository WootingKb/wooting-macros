import { EditIcon } from '@chakra-ui/icons'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  ModalFooter,
  Button,
  Divider,
  useColorModeValue,
  HStack,
  VStack,
  Kbd,
  Switch,
  Stack
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useMacroContext } from '../../contexts/macroContext'
import { RecordingType } from '../../enums'
import useRecording from '../../hooks/useRecording'
import { HIDLookup } from '../../maps/HIDmap'
import { mouseEnumLookup } from '../../maps/MouseMap'
import { Keypress, MousePressAction } from '../../types'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function TriggerModal({ isOpen, onClose }: Props) {
  const { macro, updateTriggerKeys, updateAllowWhileOtherKeys } =
    useMacroContext()
  const {
    recording: isRecordingMain,
    startRecording: startRecordingMain,
    stopRecording: stopRecordingMain,
    items: mainTriggerKey,
    resetItems: resetItemsMain,
    initItems: initItemsMain
  } = useRecording(RecordingType.MainTrigger)
  const {
    recording: isRecordingOptional,
    startRecording: startRecordingOptional,
    stopRecording: stopRecordingOptional,
    items: optionalTriggerKeys,
    resetItems: resetItemsOptional,
    initItems: initItemsOptional
  } = useRecording(RecordingType.OptionalTrigger)
  const [isAllowed, setIsAllowed] = useState(false)
  const dividerColour = useColorModeValue('gray.400', 'gray.600')

  useEffect(() => {
    // ask about this useeffect and it's dependencies, how to fix
    initItemsMain(
      macro.trigger.data.filter((_, i) => i === macro.trigger.data.length - 1)
    )
    initItemsOptional(
      macro.trigger.data.filter((_, i) => i !== macro.trigger.data.length - 1)
    )
  }, [macro])

  function onModalSuccessClose() {
    updateAllowWhileOtherKeys(isAllowed)
    // updateTriggerKeys([...optionalTriggerKeys, mainTriggerKey])  // use instead when trigger keys can take in mouse input
    updateTriggerKeys(
      optionalTriggerKeys
        .filter((element): element is Keypress => 'keypress' in element)
        .concat(
          mainTriggerKey.filter(
            (element): element is Keypress => 'keypress' in element
          )
        )
    )
    onClose()
  }

  function getDisplayString(element: Keypress | MousePressAction): string {
    if (element === undefined) {
      return 'err'
    }
    if ('keypress' in element) {
      const displayString = HIDLookup.get(element.keypress)?.displayString
      if (displayString === undefined) {
        return 'error'
      }
      return displayString
    } else {
      const displayString = mouseEnumLookup.get(element.button)?.displayString
      if (displayString === undefined) {
        return 'error'
      }
      return displayString
    }
  }

  return (
    <Modal isOpen={isOpen} size={['md', 'xl', '3xl', '3xl']} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Trigger Keys</ModalHeader>
        <Divider w="90%" alignSelf="center" borderColor={dividerColour} />
        <ModalBody>
          <Stack
            direction={['column']}
            justifyContent="space-between"
            mb={['4', '8']}
          >
            <VStack alignItems="start" spacing="0">
              <Text fontWeight="semibold" fontSize={['xs', 'sm', 'md']}>
                Main Trigger Key
              </Text>
              <Text fontSize={['2xs', 'xs', 'sm']}>
                Set any non-modifer key to use to trigger the macro.
              </Text>
            </VStack>
            <HStack justifyContent="end" spacing={['32', '48', '56', '64']}>
              {mainTriggerKey.map((element, index) => (
                <Kbd key={index}>{getDisplayString(element)}</Kbd>
              ))}
              <Button
                leftIcon={<EditIcon />}
                onClick={
                  isRecordingMain ? stopRecordingMain : startRecordingMain
                }
                colorScheme={isRecordingMain ? 'red' : 'gray'}
              >
                {isRecordingMain ? 'Stop' : 'Record'}
              </Button>
            </HStack>
          </Stack>
          <Stack direction={['column']} justifyContent="space-between">
            <VStack alignItems="start" spacing="0">
              <Text fontWeight="semibold" fontSize={['xs', 'sm', 'md']}>
                Optional Trigger Keys
              </Text>
              <Text fontSize={['2xs', 'xs', 'sm']}>
                Set up to 3 modifier keys (e.g. CTRL) to use in the trigger.
              </Text>
            </VStack>
            <HStack justifyContent="end" spacing={['16', '28', '32', '40']}>
              <HStack>
                {optionalTriggerKeys.map((element, index) => (
                  <Kbd key={index}>{getDisplayString(element)}</Kbd> // ask about the keys here
                ))}
              </HStack>
              <Button
                leftIcon={<EditIcon />}
                onClick={
                  isRecordingOptional
                    ? stopRecordingOptional
                    : startRecordingOptional
                }
                colorScheme={isRecordingOptional ? 'red' : 'gray'}
              >
                {isRecordingOptional ? 'Stop' : 'Record'}
              </Button>
            </HStack>
          </Stack>
          <Divider
            w="100%"
            alignSelf="center"
            borderColor={dividerColour}
            my={['4', '8']}
          />
          <HStack justifyContent="space-between">
            <VStack alignItems="start" maxWidth={['75%']}>
              <Text fontWeight="semibold" fontSize={['xs', 'sm', 'md']}>
                Strict Mode
              </Text>
              <Text fontSize={['2xs', 'xs', 'sm']}>
                When enabled, the macro will activate when only the trigger keys
                are being pressed. When disabled, the macro will activate even
                if the trigger keys are pressed with other keys.
              </Text>
            </VStack>
            <Switch
              size="sm"
              colorScheme="yellow"
              defaultChecked={isAllowed}
              isChecked={isAllowed}
              onChange={() => setIsAllowed(!isAllowed)}
            />
          </HStack>
        </ModalBody>
        <ModalFooter>
          <Button
            mr={3}
            onClick={() => {
              onClose()
              resetItemsMain()
              resetItemsOptional()
            }}
          >
            Close
          </Button>
          <Button
            colorScheme="yellow"
            onClick={onModalSuccessClose}
            isDisabled={mainTriggerKey.length !== 1}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
