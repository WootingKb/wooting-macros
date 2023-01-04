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
  HStack,
  VStack,
  Kbd,
  Switch,
  Stack,
  Flex,
  Spacer,
  useColorModeValue
} from '@chakra-ui/react'
import { useCallback, useMemo, useState } from 'react'
import { useMacroContext } from '../../contexts/macroContext'
import useRecordingTrigger from '../../hooks/useRecordingTrigger'
import { HIDLookup } from '../../maps/HIDmap'
import { mouseEnumLookup } from '../../maps/MouseMap'
import { isMouseButtonArray } from '../../constants/utils'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function TriggerModal({ isOpen, onClose }: Props) {
  const { macro, updateTrigger, updateAllowWhileOtherKeys } = useMacroContext()
  const { recording, startRecording, stopRecording, items, resetItems } =
    useRecordingTrigger(
      macro.trigger.type === 'KeyPressEvent'
        ? macro.trigger.data
        : [macro.trigger.data]
    )
  const isTriggerMousepress = useMemo(() => {
    if (items.length === 0) {
      return true
    }
    return isMouseButtonArray(items)
  }, [items])
  const [isAllowed, setIsAllowed] = useState(false)
  const secondBg = useColorModeValue('blue.50', 'primary-dark.800')

  const getTriggerCanSave = useMemo((): boolean => {
    if (items.length === 0) {
      return false
    } else {
      if (isTriggerMousepress) {
        return true
      } else {
        return items.some((element) => {
          if (element < 224) {
            return true
          } else {
            return false
          }
        })
      }
    }
  }, [isTriggerMousepress, items])

  const onModalSuccessClose = useCallback(() => {
    if (isMouseButtonArray(items)) {
      updateTrigger({
        type: 'MouseEvent',
        data: items[0]
      })
    } else {
      updateAllowWhileOtherKeys(isAllowed)
      updateTrigger({
        type: 'KeyPressEvent',
        data: items,
        allow_while_other_keys: isAllowed
      })
    }
    onClose()
  }, [isAllowed, items, onClose, updateAllowWhileOtherKeys, updateTrigger])

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

  return (
    <Modal
      isOpen={isOpen}
      size={['md', 'xl', '3xl', '3xl']}
      variant="brand"
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Trigger Keys</ModalHeader>
        <ModalBody>
          <Stack
            direction="column"
            justifyContent="space-between"
            mb={['4', '8']}
          >
            <Text fontSize={['xs', 'sm', 'md']}>
              You can skip this and set it later.
            </Text>
            <Divider w="full" alignSelf="center" />
            <VStack alignItems="start" spacing="0">
              <Text fontSize={['xs', 'sm', 'md']}>
                Set any up to 4 keys (1 non-modifer, up to 3 modifiers) or set a
                single mouse button to use as the trigger.
              </Text>
            </VStack>
            <Flex justifyContent="center" alignItems="center" gap={4}>
              <HStack
                w="full"
                h="40px"
                justifyContent="center"
                gap="4px"
                bg={secondBg}
                rounded="md"
                p={2}
                shadow="inner"
              >
                {items.map((element) => (
                  <Kbd variant="brand" key={element}>
                    {getDisplayString(element, isMouseButtonArray(items))}
                  </Kbd>
                ))}
              </HStack>
              <Spacer />
              <Button
                variant="brandRecord"
                size="sm"
                px={4}
                leftIcon={<EditIcon />}
                onClick={recording ? stopRecording : startRecording}
                isActive={recording}
              >
                {recording ? 'Stop' : 'Record'}
              </Button>
            </Flex>
          </Stack>
          <Divider w="full" alignSelf="center" my={['4', '8']} />
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
            <Text fontSize={['xs', 'sm', 'md']}>
              When enabled, the macro will activate when only the trigger keys
              are being pressed. When disabled, the macro will activate even if
              the trigger keys are pressed with other keys. (Only matters if the
              trigger is a keypress / keypresses)
            </Text>
          </VStack>
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
