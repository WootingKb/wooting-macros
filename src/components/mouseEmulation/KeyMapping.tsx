import {
  VStack,
  HStack,
  Text,
  Box,
  Button,
  Badge,
  useColorModeValue,
  Tooltip,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure
} from '@chakra-ui/react'
import { MouseEmulationConfig, keyMappingDirections } from '../../types/mouseEmulation'
import { HIDLookup } from '../../constants/HIDmap'
import { useCallback, useState, useMemo } from 'react'

interface Props {
  config: MouseEmulationConfig
  onKeyMapUpdate: (direction: keyof MouseEmulationConfig['key_mapping'], hidCode: number | null) => void
}

// Comprehensive list of available keys including F13-F24
const AVAILABLE_KEYS = [
  // Letters
  { code: 0x04, name: 'A' },
  { code: 0x05, name: 'B' },
  { code: 0x06, name: 'C' },
  { code: 0x07, name: 'D' },
  { code: 0x08, name: 'E' },
  { code: 0x09, name: 'F' },
  { code: 0x0a, name: 'G' },
  { code: 0x0b, name: 'H' },
  { code: 0x0c, name: 'I' },
  { code: 0x0d, name: 'J' },
  { code: 0x0e, name: 'K' },
  { code: 0x0f, name: 'L' },
  { code: 0x10, name: 'M' },
  { code: 0x11, name: 'N' },
  { code: 0x12, name: 'O' },
  { code: 0x13, name: 'P' },
  { code: 0x14, name: 'Q' },
  { code: 0x15, name: 'R' },
  { code: 0x16, name: 'S' },
  { code: 0x17, name: 'T' },
  { code: 0x18, name: 'U' },
  { code: 0x19, name: 'V' },
  { code: 0x1a, name: 'W' },
  { code: 0x1b, name: 'X' },
  { code: 0x1c, name: 'Y' },
  { code: 0x1d, name: 'Z' },
  // Numbers
  { code: 0x1e, name: '1' },
  { code: 0x1f, name: '2' },
  { code: 0x20, name: '3' },
  { code: 0x21, name: '4' },
  { code: 0x22, name: '5' },
  { code: 0x23, name: '6' },
  { code: 0x24, name: '7' },
  { code: 0x25, name: '8' },
  { code: 0x26, name: '9' },
  { code: 0x27, name: '0' },
  // Function Keys (F1-F12)
  { code: 0x3a, name: 'F1' },
  { code: 0x3b, name: 'F2' },
  { code: 0x3c, name: 'F3' },
  { code: 0x3d, name: 'F4' },
  { code: 0x3e, name: 'F5' },
  { code: 0x3f, name: 'F6' },
  { code: 0x40, name: 'F7' },
  { code: 0x41, name: 'F8' },
  { code: 0x42, name: 'F9' },
  { code: 0x43, name: 'F10' },
  { code: 0x44, name: 'F11' },
  { code: 0x45, name: 'F12' },
  // Function Keys (F13-F24) - Wooting function layer
  { code: 0x68, name: 'F13' },
  { code: 0x69, name: 'F14' },
  { code: 0x6a, name: 'F15' },
  { code: 0x6b, name: 'F16' },
  { code: 0x6c, name: 'F17' },
  { code: 0x6d, name: 'F18' },
  { code: 0x6e, name: 'F19' },
  { code: 0x6f, name: 'F20' },
  { code: 0x70, name: 'F21' },
  { code: 0x71, name: 'F22' },
  { code: 0x72, name: 'F23' },
  { code: 0x73, name: 'F24' },
  // Navigation
  { code: 0x50, name: 'Left' },
  { code: 0x4f, name: 'Right' },
  { code: 0x52, name: 'Up' },
  { code: 0x51, name: 'Down' },
  { code: 0x4a, name: 'Home' },
  { code: 0x4d, name: 'End' },
  { code: 0x4b, name: 'PageUp' },
  { code: 0x4e, name: 'PageDown' },
  // Special Keys
  { code: 0x2c, name: 'Space' },
  { code: 0x28, name: 'Enter' },
  { code: 0x2a, name: 'Backspace' },
  { code: 0x2b, name: 'Tab' },
  { code: 0x29, name: 'Escape' },
]

export default function KeyMapping({ config, onKeyMapUpdate }: Props) {
  const labelColor = useColorModeValue('gray.700', 'gray.300')
  const unmappedBg = useColorModeValue('gray.200', 'gray.600')
  const mappedBg = useColorModeValue('primary-accent.100', 'primary-accent.900')
  const mappedBorder = useColorModeValue('primary-accent.500', 'primary-accent.400')
  const buttonBg = useColorModeValue('gray.100', 'gray.700')
  const buttonHoverBg = useColorModeValue('gray.200', 'gray.600')
  const buttonActiveBg = useColorModeValue('primary-accent.200', 'primary-accent.800')
  
  const [selectingDirection, setSelectingDirection] = useState<keyof MouseEmulationConfig['key_mapping'] | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const isMapped = (direction: keyof MouseEmulationConfig['key_mapping']): boolean => {
    return config.key_mapping[direction] !== null
  }

  const getMappedKeyName = (direction: keyof MouseEmulationConfig['key_mapping']): string => {
    const code = config.key_mapping[direction]
    if (code === null) return 'Not Mapped'
    const key = AVAILABLE_KEYS.find(k => k.code === code)
    return key?.name || HIDLookup.get(code)?.displayString || 'Unknown Key'
  }

  const handleClearMapping = useCallback(
    (direction: keyof MouseEmulationConfig['key_mapping']) => {
      onKeyMapUpdate(direction, null)
    },
    [onKeyMapUpdate]
  )

  const handleSelectKey = useCallback(
    (hidCode: number) => {
      if (selectingDirection) {
        onKeyMapUpdate(selectingDirection, hidCode)
        setSelectingDirection(null)
        onClose()
      }
    },
    [selectingDirection, onKeyMapUpdate, onClose]
  )

  const handleOpenSelector = useCallback(
    (direction: keyof MouseEmulationConfig['key_mapping']) => {
      setSelectingDirection(direction)
      onOpen()
    },
    [onOpen]
  )

  // Organize keys by category
  const keysByCategory = useMemo(() => {
    return {
      'Letters': AVAILABLE_KEYS.filter(k => k.code >= 0x04 && k.code <= 0x1d),
      'Numbers': AVAILABLE_KEYS.filter(k => k.code >= 0x1e && k.code <= 0x27),
      'F1-F12': AVAILABLE_KEYS.filter(k => k.code >= 0x3a && k.code <= 0x45),
      'F13-F24': AVAILABLE_KEYS.filter(k => k.code >= 0x68 && k.code <= 0x73),
      'Navigation': AVAILABLE_KEYS.filter(k => [0x50, 0x4f, 0x52, 0x51, 0x4a, 0x4d, 0x4b, 0x4e].includes(k.code)),
      'Special': AVAILABLE_KEYS.filter(k => [0x2c, 0x28, 0x2a, 0x2b, 0x29].includes(k.code))
    }
  }, [])

  return (
    <VStack w="full" spacing={6} align="stretch">
      <VStack spacing={3} align="stretch">
        <Text fontWeight="semibold" color={labelColor}>
          Key Mapping
        </Text>
        <Text fontSize="sm" color={labelColor} opacity={0.8}>
          Select keyboard keys to control mouse movement and scrolling
        </Text>
      </VStack>

      {/* Movement Keys (2x2 Grid) */}
      <VStack spacing={2} align="stretch">
        <Text fontSize="sm" fontWeight="semibold" color={labelColor} ml={2}>
          Movement
        </Text>
        <Grid templateColumns="repeat(2, 1fr)" gap={3}>
          {keyMappingDirections.slice(0, 4).map((direction: any) => (
            <GridItem key={direction.id}>
              <Box
                p={3}
                rounded="md"
                bg={isMapped(direction.id as any) ? mappedBg : unmappedBg}
                border="2px"
                borderColor={isMapped(direction.id as any) ? mappedBorder : 'transparent'}
                transition="all 150ms"
              >
                <VStack spacing={2} align="stretch">
                  <HStack justify="space-between">
                    <HStack spacing={1}>
                      <Text fontSize="xl">{direction.icon}</Text>
                      <Text fontWeight="semibold" fontSize="sm">
                        {direction.label}
                      </Text>
                    </HStack>
                    {isMapped(direction.id as any) && (
                      <Badge colorScheme="green" fontSize="xs">
                        ✓
                      </Badge>
                    )}
                  </HStack>
                  <HStack spacing={1} w="full">
                    <Tooltip 
                      label={getMappedKeyName(direction.id as any)} 
                      hasArrow
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        w="full"
                        fontSize="sm"
                        noOfLines={1}
                        colorScheme={isMapped(direction.id as any) ? 'primary-accent' : 'gray'}
                        onClick={() => handleOpenSelector(direction.id as any)}
                      >
                        {getMappedKeyName(direction.id as any)}
                      </Button>
                    </Tooltip>
                    {isMapped(direction.id as any) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleClearMapping(direction.id as any)}
                      >
                        ✕
                      </Button>
                    )}
                  </HStack>
                </VStack>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </VStack>

      {/* Scroll Keys (2x2 Grid) */}
      <VStack spacing={2} align="stretch">
        <Text fontSize="sm" fontWeight="semibold" color={labelColor} ml={2}>
          Scroll
        </Text>
        <Grid templateColumns="repeat(2, 1fr)" gap={3}>
          {keyMappingDirections.slice(4, 8).map((direction: any) => (
            <GridItem key={direction.id}>
              <Box
                p={3}
                rounded="md"
                bg={isMapped(direction.id as any) ? mappedBg : unmappedBg}
                border="2px"
                borderColor={isMapped(direction.id as any) ? mappedBorder : 'transparent'}
                transition="all 150ms"
              >
                <VStack spacing={2} align="stretch">
                  <HStack justify="space-between">
                    <HStack spacing={1}>
                      <Text fontSize="xl">{direction.icon}</Text>
                      <Text fontWeight="semibold" fontSize="sm">
                        {direction.label}
                      </Text>
                    </HStack>
                    {isMapped(direction.id as any) && (
                      <Badge colorScheme="green" fontSize="xs">
                        ✓
                      </Badge>
                    )}
                  </HStack>
                  <HStack spacing={1} w="full">
                    <Tooltip 
                      label={getMappedKeyName(direction.id as any)} 
                      hasArrow
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        w="full"
                        fontSize="sm"
                        noOfLines={1}
                        colorScheme={isMapped(direction.id as any) ? 'primary-accent' : 'gray'}
                        onClick={() => handleOpenSelector(direction.id as any)}
                      >
                        {getMappedKeyName(direction.id as any)}
                      </Button>
                    </Tooltip>
                    {isMapped(direction.id as any) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleClearMapping(direction.id as any)}
                      >
                        ✕
                      </Button>
                    )}
                  </HStack>
                </VStack>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </VStack>

      {/* Key Selector Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Select Key for {selectingDirection && keyMappingDirections.find(d => d.id === selectingDirection)?.label}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6} align="stretch" maxH="60vh" overflowY="auto">
              {Object.entries(keysByCategory).map(([category, keys]) => (
                <Box key={category}>
                  <Text fontSize="xs" fontWeight="semibold" color={labelColor} mb={2} textTransform="uppercase" opacity={0.7}>
                    {category}
                  </Text>
                  <Grid templateColumns="repeat(auto-fill, minmax(50px, 1fr))" gap={2}>
                    {keys.map(key => (
                      <Button
                        key={key.code}
                        size="sm"
                        variant="outline"
                        bg={buttonBg}
                        _hover={{ bg: buttonHoverBg }}
                        _active={{ bg: buttonActiveBg }}
                        onClick={() => handleSelectKey(key.code)}
                        fontSize="xs"
                        fontWeight="semibold"
                      >
                        {key.name}
                      </Button>
                    ))}
                  </Grid>
                </Box>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Info Text */}
      <Box
        p={3}
        bg={useColorModeValue('blue.50', 'blue.900')}
        rounded="md"
        border="1px"
        borderColor={useColorModeValue('blue.200', 'blue.700')}
      >
        <Text fontSize="sm" color={labelColor}>
          💡 <strong>Tip:</strong> Click on a direction button to open the key selector. All keys including F13-F24 (Wooting function layer) are supported.
        </Text>
      </Box>
    </VStack>
  )
}
