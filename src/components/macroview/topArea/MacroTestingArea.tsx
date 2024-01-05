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
  placement: string
  setPlacement: React.Dispatch<React.SetStateAction<string>>
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
      <MacroTestingAreaDrawer
        isOpen={isOpen}
        onClose={onClose}
        placement={placement}
        setPlacement={setPlacement}
      />
    </HStack>
  )
}

function MacroTestingAreaDrawer({
  isOpen,
  onClose,
  placement,
  setPlacement
}: DrawerProps) {
  return (
    <>
      <Drawer placement={placement} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Basic Drawer</DrawerHeader>
          <DrawerBody>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
