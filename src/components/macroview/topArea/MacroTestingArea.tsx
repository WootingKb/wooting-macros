import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'
import useMainBgColour from '../../../hooks/useMainBgColour'
import React from 'react'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function MacroTestingAreaButton() {
  const borderColour = useColorModeValue('gray.400', 'gray.600')
  const primaryBg = useMainBgColour()
  // const secondBg = useColorModeValue('blue.50', 'gray.900')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [placement, setPlacement] = React.useState('bottom')
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
      <MacroTestingAreaDrawer isOpen={isOpen} onClose={onClose} />
    </HStack>
  )
}

function MacroTestingAreaDrawer({ isOpen, onClose }: DrawerProps) {
  return (
    <>
      <Drawer placement={'bottom'} onClose={onClose} isOpen={isOpen} size="xl">
        <DrawerOverlay />
        <DrawerContent maxH="75%">
          <DrawerHeader borderBottomWidth="1px">Basic Drawer</DrawerHeader>
          <DrawerBody>
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
