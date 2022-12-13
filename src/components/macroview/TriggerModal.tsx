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
  Spacer
} from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMacroContext } from '../../contexts/macroContext'
import useRecordingTrigger from '../../hooks/useRecordingTrigger'
import { HIDLookup } from '../../maps/HIDmap'
import { mouseEnumLookup } from '../../maps/MouseMap'
import { isMouseButtonArray } from '../../utils'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function TriggerModal({ isOpen, onClose }: Props) {
  const { macro, updateTrigger, updateAllowWhileOtherKeys } = useMacroContext()
  const {
    recording,
    startRecording,
    stopRecording,
    items,
    resetItems,
    initItems
  } = useRecordingTrigger()
  const [isAllowed, setIsAllowed] = useState(false)
  const [isTriggerMousepress, setIsTriggerMousepress] = useState(false)

  useEffect(() => {
    // ask about this useeffect and it's dependencies, need to fix?
    if (macro.trigger.type === 'KeyPressEvent') {
      initItems(macro.trigger.data)
      setIsAllowed(macro.trigger.allow_while_other_keys)
      setIsTriggerMousepress(false)
    } else {
      initItems([macro.trigger.data])
      setIsTriggerMousepress(true)
    }
  }, [initItems, macro])

  useEffect(() => {
    if (items.length === 0) {
      setIsTriggerMousepress(true)
      return
    }
    setIsTriggerMousepress(isMouseButtonArray(items))
  }, [items])

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
        <Divider w="90%" alignSelf="center" />
        <ModalBody>
          <Stack
            direction={['column']}
            justifyContent="space-between"
            mb={['4', '8']}
          >
            <VStack alignItems="start" spacing="0">
              <Text fontSize={['2xs', 'xs', 'sm']}>
                Set any up to 4 keys (1 non-modifer, up to 3 modifiers) or set a
                single mouse button to use as the trigger.
              </Text>
            </VStack>
            <Flex justifyContent="end">
              <HStack>
                {items.map((element) => (
                  <Kbd variant="brand" key={element}>
                    {getDisplayString(element, isMouseButtonArray(items))}
                  </Kbd>
                ))}
              </HStack>
              <Spacer />
              <Button
                variant="brand"
                leftIcon={<EditIcon />}
                onClick={recording ? stopRecording : startRecording}
                colorScheme={recording ? 'red' : 'gray'}
              >
                {recording ? 'Stop' : 'Record'}
              </Button>
            </Flex>
          </Stack>
          <Divider w="100%" alignSelf="center" my={['4', '8']} />
          <HStack justifyContent="space-between">
            <VStack alignItems="start" maxWidth={['85%']}>
              <Text fontWeight="semibold" fontSize={['xs', 'sm', 'md']}>
                Strict Mode
              </Text>
              <Text fontSize={['2xs', 'xs', 'sm']}>
                When enabled, the macro will activate when only the trigger keys
                are being pressed. When disabled, the macro will activate even
                if the trigger keys are pressed with other keys. (Only if
                trigger is not a mouse button)
              </Text>
            </VStack>
            <Switch
              size="sm"
              variant="brand"
              defaultChecked={isAllowed}
              isChecked={isAllowed}
              isDisabled={isTriggerMousepress}
              onChange={() => setIsAllowed(!isAllowed)}
            />
          </HStack>
        </ModalBody>
        <ModalFooter>
          <Button
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
            colorScheme="yellow"
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
