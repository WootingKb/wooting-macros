import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  InputGroup,
  InputRightElement,
  Textarea,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'
import useMainBgColour from '../../../hooks/useMainBgColour'
import React, { ChangeEvent, useState } from 'react'
import useScrollbarStyles from '../../../hooks/useScrollbarStyles'
import MacroStateControls, { MacroDataInterface } from './MacroStateButtons'
import { Macro } from '../../../types'

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

function MacroTestTypeArea() {
  const [typedInput, setTypedInput] = useState('')
  const handleClick = () => setTypedInput('')
  const handleInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTypedInput(event.target.value)
  }

  return (
    <InputGroup size="md">
      <Textarea
        size="lg"
        h="250px"
        resize="none"
        pr="4.5rem"
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
  return (
    <>
      <Drawer placement={'bottom'} onClose={onClose} isOpen={isOpen} size="xl">
        <DrawerOverlay />
        <DrawerContent maxH="75%">
          <DrawerHeader borderBottomWidth="1px">
            <MacroStateControls macro_data={data} />
          </DrawerHeader>
          <DrawerBody sx={useScrollbarStyles()}>
            <MacroTestTypeArea />
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
