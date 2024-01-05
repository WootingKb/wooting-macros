import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  InputGroup,
  InputRightElement,
  ModalCloseButton,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  VStack
} from '@chakra-ui/react'
import useMainBgColour from '../../../hooks/useMainBgColour'
import React, { ChangeEvent, useState } from 'react'
import useScrollbarStyles from '../../../hooks/useScrollbarStyles'
import MacroStateControls, { MacroDataInterface } from './MacroStateButtons'
import { Macro } from '../../../types'
import { borderRadiusStandard } from '../../../theme/config'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  data: Macro
}

export default function MacroTestingAreaButton({
  macro_data
}: MacroDataInterface) {
  const borderColour = useColorModeValue('gray.400', 'gray.600')
  const primaryBg = useMainBgColour()
  // const secondBg = useColorModeValue('blue.50', 'gray.900')
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <HStack
      border="1px"
      borderColor={borderColour}
      rounded="md"
      spacing="16px"
      p="3"
      position="relative" // Add relative position
    >
      <Button
        w="100px"
        size={{ base: 'md', lg: 'lg' }}
        variant="yellowGradient"
        aria-label="Test"
        onClick={onOpen}
      >
        Test area
      </Button>
      <Box
        position="absolute"
        transform="translate(50%, -140%)"
        fontSize="md"
        zIndex="1"
        bgColor={primaryBg}
      >
        {'Testing'}
      </Box>
      <MacroTestingAreaDrawer
        isOpen={isOpen}
        onClose={onClose}
        data={macro_data}
      />
    </HStack>
  )
}

function MacroTestResponseArea() {
  const bg = useColorModeValue('primary-light.50', 'primary-dark.700')
  const kebabColour = useColorModeValue('primary-light.500', 'primary-dark.500')

  return (
    <>
      <Divider p={2} w="full" />
      <HStack p={0}>
        <VStack>
          <Text>Currently pressed keys</Text>
          <Box
            h="32px"
            w="fit-content"
            bg={bg}
            border="1px solid"
            py={1}
            px={3}
            borderColor={kebabColour}
            rounded={borderRadiusStandard}
          >
            <Text
              fontSize={['sm', 'md', 'md']}
              w="fit-content"
              whiteSpace="nowrap"
              fontWeight="bold"
            >
              {'Clipboard'}
            </Text>
          </Box>
        </VStack>
      </HStack>
    </>
  )
}

function MacroTestTypeArea() {
  const [typedInput, setTypedInput] = useState('')
  const handleClick = () => setTypedInput('')
  const handleInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTypedInput(event.target.value)
  }

  //TODO: Autofocus this field when start is clicked
  return (
    <InputGroup size="md">
      <Textarea
        size="lg"
        h="200px"
        resize="none"
        value={typedInput}
        onChange={handleInput}
        placeholder="Test your macro here"
        sx={useScrollbarStyles()}
      />
      <InputRightElement width="80px">
        <Button
          variant="brandWarning"
          marginRight="15px"
          h="30px"
          size="md"
          onClick={handleClick}
        >
          {'Clear all'}
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}

function MacroTestingAreaDrawer({ isOpen, onClose, data }: DrawerProps) {
  const primaryBg = useMainBgColour()
  return (
    <>
      <Drawer placement={'bottom'} onClose={onClose} isOpen={isOpen} size="xl">
        <DrawerOverlay />
        <DrawerContent bg={primaryBg} maxH="75%">
          <DrawerHeader borderBottomWidth="1px" p={5}>
            <HStack>
              <Text fontWeight="bold" size="20px">
                Macro Testing Area
              </Text>
              <ModalCloseButton />
            </HStack>
          </DrawerHeader>
          <DrawerBody overflow="hidden">
            <VStack alignItems="start">
              <MacroStateControls macro_data={data} />
              <MacroTestTypeArea />
              <MacroTestResponseArea />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
