import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Flex,
  IconButton,
  Tooltip,
  Container,
  Divider
} from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { useApplicationContext } from '../contexts/applicationContext'
import { ViewState } from '../constants/enums'
import { MouseEmulationConfig, CurveType, defaultMouseEmulationConfig } from '../types/mouseEmulation'
import { useState, useCallback } from 'react'
import useBorderColour from '../hooks/useBorderColour'
import useMainBgColour from '../hooks/useMainBgColour'
import useScrollbarStyles from '../hooks/useScrollbarStyles'
import GeneralSettings from '../components/mouseEmulation/GeneralSettings'
import KeyMapping from '../components/mouseEmulation/KeyMapping'
import CurveVisualization from '../components/mouseEmulation/CurveVisualization'

export default function MouseEmulationView() {
  const { changeViewState, selection, onCollectionUpdate } = useApplicationContext()
  const { collections } = useApplicationContext()
  
  // Find if we're editing an existing mouse emulation macro
  const currentCollection = collections[selection.collectionIndex]
  const existingMouseEmulationMacro = currentCollection.macros.find(
    (m) => m.mouse_emulation_enabled
  )
  
  // Convert loaded config from array format to object format
  const convertConfigFromArray = (loadedConfig: any): MouseEmulationConfig => {
    if (!loadedConfig) return defaultMouseEmulationConfig
    
    // If key_mapping is already an object, return as-is
    if (typeof loadedConfig.key_mapping === 'object' && !Array.isArray(loadedConfig.key_mapping)) {
      return loadedConfig
    }
    
    // If key_mapping is an array, convert to object
    if (Array.isArray(loadedConfig.key_mapping)) {
      return {
        ...loadedConfig,
        key_mapping: {
          up: loadedConfig.key_mapping[0] || null,
          down: loadedConfig.key_mapping[1] || null,
          left: loadedConfig.key_mapping[2] || null,
          right: loadedConfig.key_mapping[3] || null,
          scroll_up: loadedConfig.key_mapping[4] || null,
          scroll_down: loadedConfig.key_mapping[5] || null,
          scroll_left: loadedConfig.key_mapping[6] || null,
          scroll_right: loadedConfig.key_mapping[7] || null
        }
      }
    }
    
    return defaultMouseEmulationConfig
  }
  
  const [config, setConfig] = useState<MouseEmulationConfig>(
    convertConfigFromArray(existingMouseEmulationMacro?.mouse_emulation_config)
  )
  const [tabIndex, setTabIndex] = useState(0)
  const isEditing = !!existingMouseEmulationMacro

  const headerBg = useColorModeValue('white', 'gray.800')
  const panelBg = useMainBgColour()

  // Handle config updates
  const handleConfigUpdate = useCallback(
    (key: string | number | symbol, value: number) => {
      setConfig((prev: MouseEmulationConfig) => ({
        ...prev,
        [key]: value
      }))
    },
    []
  )

  // Handle key mapping updates
  const handleKeyMapUpdate = useCallback(
    (direction: string | number | symbol, hidCode: number | null) => {
      setConfig((prev: MouseEmulationConfig) => ({
        ...prev,
        key_mapping: {
          ...prev.key_mapping,
          [direction]: hidCode
        }
      }))
    },
    []
  )

  // Handle curve type change
  const handleCurveTypeChange = useCallback((curveType: CurveType) => {
    setConfig((prev: MouseEmulationConfig) => ({
      ...prev,
      curve_type: curveType
    }))
  }, [])

  // Handle save - create or update mouse emulation macro
  const handleSave = useCallback(() => {
    // Convert key_mapping object to array format for backend
    const keyMappingArray = [
      config.key_mapping.up ?? 0,
      config.key_mapping.down ?? 0,
      config.key_mapping.left ?? 0,
      config.key_mapping.right ?? 0,
      config.key_mapping.scroll_up ?? 0,
      config.key_mapping.scroll_down ?? 0,
      config.key_mapping.scroll_left ?? 0,
      config.key_mapping.scroll_right ?? 0
    ]

    const configForBackend = {
      ...config,
      key_mapping: keyMappingArray,
      activation_key: config.activation_key ?? 0
    }

    const updatedCollection = {
      ...currentCollection,
      macros: currentCollection.macros.map((macro) => {
        if (macro.mouse_emulation_enabled) {
          // Update existing mouse emulation macro
          return {
            ...macro,
            mouse_emulation_config: configForBackend,
            mouse_emulation_enabled: true
          }
        }
        return macro
      })
    }

    // If no existing macro, add new one
    if (!existingMouseEmulationMacro) {
      updatedCollection.macros.push({
        name: 'Mouse Emulation',
        icon: ':mouse:',
        active: true,
        macro_type: 'Single',
        trigger: { type: 'KeyPressEvent' as const, data: [], allow_while_other_keys: false },
        sequence: [],
        mouse_emulation_config: configForBackend,
        mouse_emulation_enabled: true
      })
    }

    onCollectionUpdate(updatedCollection, selection.collectionIndex)
    changeViewState(ViewState.Overview)
  }, [config, currentCollection, existingMouseEmulationMacro, selection, onCollectionUpdate, changeViewState])

  // Handle cancel
  const handleCancel = useCallback(() => {
    changeViewState(ViewState.Overview)
  }, [changeViewState])

  return (
    <Flex h="100vh" w="full" bg={panelBg}>
      <VStack w="full" h="full" spacing={0} align="stretch">
        {/* Header */}
        <HStack
          w="full"
          h="80px"
          px={6}
          py={4}
          bg={headerBg}
          borderBottom="1px"
          borderColor={useBorderColour()}
          justify="space-between"
          align="center"
        >
          <VStack spacing={0} align="flex-start">
            <Text fontSize="2xl" fontWeight="bold">
              Mouse Emulation {isEditing ? 'Settings' : 'Configuration'}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {isEditing ? 'Update your mouse emulation settings' : 'Configure mouse movement and scroll settings'}
            </Text>
          </VStack>
          <Tooltip label="Close" hasArrow>
            <IconButton
              aria-label="close"
              icon={<CloseIcon />}
              variant="ghost"
              colorScheme="red"
              onClick={handleCancel}
            />
          </Tooltip>
        </HStack>

        {/* Content */}
        <Box
          w="full"
          h="calc(100vh - 80px - 80px)"
          overflow="hidden"
          overflowY="auto"
          sx={useScrollbarStyles()}
        >
          <Container maxW="1000px" py={6}>
            <Tabs
              index={tabIndex}
              onChange={setTabIndex}
              variant="soft-rounded"
              colorScheme="primary-accent"
            >
              <TabList mb="1em" gap={2} flexWrap="wrap">
                <Tab fontSize={['sm', 'md']}>General</Tab>
                <Tab fontSize={['sm', 'md']}>Key Mapping</Tab>
                <Tab fontSize={['sm', 'md']}>Curve</Tab>
                <Tab fontSize={['sm', 'md']}>
                  Manual
                </Tab>
              </TabList>

              <TabPanels>
                {/* General Settings */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <VStack spacing={2} align="stretch">
                      <Text fontSize="lg" fontWeight="bold">
                        General Settings
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Adjust sensitivity, activation points, and actuation limits
                      </Text>
                    </VStack>
                    <Divider />
                    <GeneralSettings
                      config={config}
                      onConfigUpdate={handleConfigUpdate}
                    />
                  </VStack>
                </TabPanel>

                {/* Key Mapping */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <VStack spacing={2} align="stretch">
                      <Text fontSize="lg" fontWeight="bold">
                        Key Mapping
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Map your Wooting keyboard keys to movement directions
                      </Text>
                    </VStack>
                    <Divider />
                    <KeyMapping
                      config={config}
                      onKeyMapUpdate={handleKeyMapUpdate}
                    />
                  </VStack>
                </TabPanel>

                {/* Curve Visualization */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <VStack spacing={2} align="stretch">
                      <Text fontSize="lg" fontWeight="bold">
                        Curve Visualization
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        See how analog input is converted to output
                      </Text>
                    </VStack>
                    <Divider />
                    <CurveVisualization
                      config={config}
                      onCurveTypeChange={handleCurveTypeChange}
                    />
                  </VStack>
                </TabPanel>

                {/* Manual - Wiki */}
                <TabPanel>
                  <VStack spacing={8} align="stretch">
                    {/* How It Works */}
                    <VStack spacing={3} align="stretch">
                      <Text fontSize="lg" fontWeight="bold">
                        🎮 How It Works
                      </Text>
                      <Text fontSize="sm" lineHeight="1.6">
                        Mouse Emulation converts analog key presses on your Wooting keyboard into mouse movement. 
                        Instead of recording a sequence of actions, you map specific keys to movement directions. 
                        When you press those keys partially or fully, the emulator generates proportional mouse movement.
                      </Text>
                      <Box bg={useColorModeValue('blue.50', 'blue.900')} p={3} rounded="md" fontSize="sm">
                        <Text><strong>Example:</strong> Map the arrow keys to mouse movement. Press left arrow halfway → mouse moves left at half speed. Press it fully → mouse moves at full speed.</Text>
                      </Box>
                    </VStack>

                    <Divider />

                    {/* Getting Started */}
                    <VStack spacing={3} align="stretch">
                      <Text fontSize="lg" fontWeight="bold">
                        🚀 Getting Started
                      </Text>
                      <VStack spacing={2} align="stretch" fontSize="sm">
                        <Box>
                          <Text fontWeight="bold">1. Create a Macro</Text>
                          <Text color="gray.500">Go to Overview and click "Create Mouse Emulation"</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">2. Map Your Keys</Text>
                          <Text color="gray.500">In the "Key Mapping" tab, select which keys control which directions (up/down/left/right and scroll)</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">3. Adjust Settings</Text>
                          <Text color="gray.500">Fine-tune sensitivity and response curve in the "General" tab</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">4. Enable & Test</Text>
                          <Text color="gray.500">Toggle the macro on and test your key mappings</Text>
                        </Box>
                      </VStack>
                    </VStack>

                    <Divider />

                    {/* Key Mapping */}
                    <VStack spacing={3} align="stretch">
                      <Text fontSize="lg" fontWeight="bold">
                        🔑 Key Mapping
                      </Text>
                      <Text fontSize="sm" lineHeight="1.6">
                        Map your Wooting keyboard keys to control mouse movement. You can use:
                      </Text>
                      <VStack spacing={2} align="stretch" fontSize="sm" ml={4}>
                        <Text>• <strong>Standard keys:</strong> A-Z, 0-9, arrow keys</Text>
                        <Text>• <strong>Function keys:</strong> F1-F12 (standard keyboard)</Text>
                        <Text>• <strong>Wooting function layer:</strong> F13-F24 (exclusive to Wooting keyboards!)</Text>
                        <Text>• <strong>Special keys:</strong> Space, Enter, Tab, Escape, etc.</Text>
                      </VStack>
                    </VStack>

                    <Divider />

                    {/* Understanding Settings */}
                    <VStack spacing={3} align="stretch">
                      <Text fontSize="lg" fontWeight="bold">
                        ⚙️ Understanding Settings
                      </Text>
                      <VStack spacing={3} align="stretch" fontSize="sm">
                        <Box>
                          <Text fontWeight="bold" color="primary-accent.500">Mouse Sensitivity</Text>
                          <Text color="gray.500">Controls how fast the mouse moves. Higher = faster movement (1-20)</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold" color="primary-accent.500">Vertical Sensitivity Reduction</Text>
                          <Text color="gray.500">Reduces vertical movement relative to horizontal (0-1). Use 0 for equal movement in all directions.</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold" color="primary-accent.500">Scroll Sensitivity</Text>
                          <Text color="gray.500">Controls scrolling speed when using scroll directions (1-10)</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold" color="primary-accent.500">Activation Point</Text>
                          <Text color="gray.500">Minimum key press needed to start movement (0.01-0.5). Higher = need to press key more to activate. Prevents accidental movement.</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold" color="primary-accent.500">Maximum Actuation</Text>
                          <Text color="gray.500">The highest output value (0.5-1.0). Useful for capping maximum movement speed.</Text>
                        </Box>
                      </VStack>
                    </VStack>

                    <Divider />

                    {/* Understanding Curves */}
                    <VStack spacing={3} align="stretch">
                      <Text fontSize="lg" fontWeight="bold">
                        📈 Understanding Curves
                      </Text>
                      <Text fontSize="sm" lineHeight="1.6">
                        The curve determines how key press intensity maps to mouse movement output. Check the Curve tab for a visual representation.
                      </Text>
                      <VStack spacing={2} align="stretch" fontSize="sm" ml={4}>
                        <Box>
                          <Text fontWeight="bold">Power Curve</Text>
                          <Text color="gray.500">Adjustable curve using an exponent (Curve Factor). Low factor = linear, high factor = slower at start then rapid increase. Best for precision control.</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">Logarithmic Curve</Text>
                          <Text color="gray.500">Logarithmic response - sensitive at low inputs, less sensitive at high inputs. Good for fine-tuned control.</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">S-Curve</Text>
                          <Text color="gray.500">Smooth curve that starts slow, accelerates in the middle, then levels off. Balances control and responsiveness.</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">Linear Curve</Text>
                          <Text color="gray.500">Direct 1:1 mapping - 50% press = 50% movement. Simple and predictable.</Text>
                        </Box>
                      </VStack>
                    </VStack>

                    <Divider />

                    {/* Tips */}
                    <VStack spacing={3} align="stretch">
                      <Text fontSize="lg" fontWeight="bold">
                        💡 Pro Tips
                      </Text>
                      <VStack spacing={2} align="stretch" fontSize="sm" ml={4}>
                        <Text>• Use the Curve Visualization tab to see real-time changes as you adjust settings</Text>
                        <Text>• Start with default settings and adjust only what you need</Text>
                        <Text>• The Wooting function layer (F13-F24) doesn't interfere with normal keyboard input</Text>
                        <Text>• Experiment with different curves to find what feels best for your gaming style</Text>
                        <Text>• Lower activation point = more sensitive (easier to trigger movement)</Text>
                        <Text>• Higher curve factor = more aggressive response at high inputs</Text>
                      </VStack>
                    </VStack>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Container>
        </Box>

        {/* Footer */}
        <HStack
          w="full"
          h="80px"
          px={6}
          py={4}
          bg={headerBg}
          borderTop="1px"
          borderColor={useBorderColour()}
          justify="flex-end"
          gap={3}
        >
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="yellowGradient"
            onClick={handleSave}
          >
            Save
          </Button>
        </HStack>
      </VStack>
    </Flex>
  )
}
