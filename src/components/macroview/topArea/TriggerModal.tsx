import {
  Button,
  Divider,
  Flex,
  HStack,
  Kbd,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'
import { useCallback, useMemo, useState } from 'react'
import { useMacroContext } from '../../../contexts/macroContext'
import useRecordingTrigger from '../../../hooks/useRecordingTrigger'
import { HIDLookup } from '../../../constants/HIDmap'
import { mouseEnumLookup } from '../../../constants/MouseMap'
import {
  checkIfModifierKey,
  checkIfMouseButtonArray
} from '../../../constants/utils'
import { RecordIcon, StopIcon } from '../../icons'
import { borderRadiusStandard } from "../../../theme/config";

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function TriggerModal({ isOpen, onClose }: Props) {
  const { macro, updateTrigger } = useMacroContext()
  const { recording, startRecording, stopRecording, items, resetItems } =
    useRecordingTrigger(macro.trigger.data)
  const isTriggerMousepress = useMemo(() => {
    if (items.length === 0) {
      return true
    }
    return checkIfMouseButtonArray(items)
  }, [items])
  const [isAllowed, setIsAllowed] = useState(false) // Currently not used
  const secondBg = useColorModeValue('blue.50', 'gray.800')

  const getTriggerCanSave = useMemo((): boolean => {
    if (items.length === 0) {
      return false
    } else {
      if (isTriggerMousepress) {
        return true
      } else {
        return items.some((element) => {
          if (checkIfModifierKey(element)) {
            return false
          } else {
            return true
          }
        })
      }
    }
  }, [isTriggerMousepress, items])

  const onModalSuccessClose = useCallback(() => {
    if (checkIfMouseButtonArray(items)) {
      updateTrigger({
        type: 'MouseEvent',
        data: items[0]
      })
    } else {
      if (macro.trigger.type === 'KeyPressEvent') {
        updateTrigger({ ...macro.trigger, data: items })
      } else {
        updateTrigger({
          ...macro.trigger,
          type: 'KeyPressEvent',
          data: items,
          allow_while_other_keys: false
        })
      }
    }
    onClose()
  }, [items, macro.trigger, onClose, updateTrigger])

  const getDisplayString = useCallback(
    (element: number, isMouseButton: boolean): string => {
      if (isMouseButton) {
        const displayString = mouseEnumLookup.get(element)?.displayString
        if (displayString === undefined) {
          return 'error'
        }
        return displayString
      } else {
        const displayString = HIDLookup.get(element)?.displayString
        if (displayString === undefined) {
          return 'error'
        }
        return displayString
      }
    },
    []
  )

  const displayNames = useMemo((): string[] => {
    if (items.length === 0) return []
    const names: string[] = []
    if (checkIfMouseButtonArray(items)) {
      items.forEach((element) => {
        names.push(getDisplayString(element, true))
      })
    } else {
      items.forEach((element) => {
        names.push(getDisplayString(element, false))
      })
    }
    return names
  }, [getDisplayString, items])

  return (
    <Modal
      isOpen={isOpen}
      size={['md', 'xl', '3xl', '3xl']}
      variant="brand"
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent p={2}>
        <ModalHeader fontWeight="bold" alignSelf="center">
          Trigger Keys
        </ModalHeader>
        <Divider w="90%" alignSelf="center" />
        <ModalBody>
          <VStack w="full" justifyContent="space-between">
            <VStack w="full">
              <Flex
                w="full"
                gap="4px"
                minH="42px"
                bg={secondBg}
                justifyContent="center"
                rounded={borderRadiusStandard}
                p="9px"
                shadow="inner"
              >
                {items.length === 0 && (
                  <Text textAlign="center">
                    {'Set up to 4 keys or a mouse button to use as the trigger'}
                  </Text>
                )}
                {items.map((element, index) => (
                  <Kbd
                    fontSize="md"
                    variant="brand"
                    h="fit-content"
                    key={element}
                  >
                    {displayNames[index]}
                  </Kbd>
                ))}
              </Flex>
              <HStack w="full" justifyContent="space-between">
                <VStack alignItems="left">
                  <Text fontSize="xs">{`1x non-modifier, up to 3x modifiers in any order.`}</Text>
                  <Text fontSize="xs">{`non-modifier has to be last.`}</Text>
                </VStack>
                <Button
                  variant="brandRecord"
                  size="sm"
                  px={4}
                  leftIcon={recording ? <StopIcon /> : <RecordIcon />}
                  onClick={recording ? stopRecording : startRecording}
                  isActive={recording}
                >
                  {recording ? 'Stop' : 'Record'}
                </Button>
              </HStack>
            </VStack>
          </VStack>
          {/* <Divider w="full" alignSelf="center" my={['4', '8']} />
          <VStack alignItems="start">
            <HStack w="full" justifyContent="space-between" gap={4}>
              <Text fontWeight="semibold" fontSize={['xs', 'sm', 'md']}>
                Strict Mode
              </Text>
              <Switch
                variant="brand"
                defaultChecked={isAllowed}
                isChecked={isAllowed}
                isDisabled={isTriggerMousepress}
                onChange={() => setIsAllowed(!isAllowed)}
              />
            </HStack>
            <VStack w="full" spacing={0}>
              <Text w="full" fontSize={['xs', 'sm', 'md']}>
                If enabled, the macro will activate when ONLY the trigger keys
                are pressed.
              </Text>
              <Text w="full" fontSize={['xs', 'sm', 'md']}>
                (Only matters if the trigger is a keypress(es))
              </Text>
            </VStack>
          </VStack> */}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="brand"
            mr={3}
            onClick={() => {
              resetItems()
              stopRecording()
              onClose()
            }}
          >
            Close
          </Button>
          <Button
            variant="yellowGradient"
            onClick={onModalSuccessClose}
            isDisabled={!getTriggerCanSave}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
