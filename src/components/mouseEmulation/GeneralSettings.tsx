import {
  VStack,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  useColorModeValue,
  Flex
} from '@chakra-ui/react'
import { MouseEmulationConfig } from '../../types/mouseEmulation'

interface Props {
  config: MouseEmulationConfig
  onConfigUpdate: (key: keyof MouseEmulationConfig, value: number) => void
}

export default function GeneralSettings({ config, onConfigUpdate }: Props) {
  const labelColor = useColorModeValue('gray.700', 'gray.300')
  const sliderTrackBg = useColorModeValue('gray.300', 'gray.600')

  const settings = [
    {
      key: 'sensitivity_movement' as const,
      label: 'Mouse Sensitivity',
      value: config.sensitivity_movement,
      min: 0.1,
      max: 20,
      step: 0.1
    },
    {
      key: 'y_sensitivity_adjustment' as const,
      label: 'Vertical Sensitivity Reduction',
      value: config.y_sensitivity_adjustment,
      min: 0,
      max: 1,
      step: 0.05
    },
    {
      key: 'sensitivity_scroll' as const,
      label: 'Scroll Sensitivity',
      value: config.sensitivity_scroll,
      min: 0.1,
      max: 10,
      step: 0.1
    },
    {
      key: 'curve_factor' as const,
      label: 'Curve Factor',
      value: config.curve_factor,
      min: 0.5,
      max: 3,
      step: 0.1
    },
    {
      key: 'activation_point' as const,
      label: 'Activation Point',
      value: config.activation_point,
      min: 0.01,
      max: 0.5,
      step: 0.01
    },
    {
      key: 'maximum_actuation' as const,
      label: 'Maximum Actuation',
      value: config.maximum_actuation,
      min: 0.5,
      max: 1.0,
      step: 0.05
    }
  ]

  return (
    <VStack w="full" spacing={6} align="stretch">
      {settings.map(({ key, label, value, min, max, step }) => (
        <VStack key={key} spacing={2} align="stretch">
          <Flex justify="space-between" align="center">
            <Text fontWeight="semibold" color={labelColor}>
              {label}
            </Text>
            <Tooltip label={value.toFixed(2)} hasArrow>
              <Text fontSize="sm" fontWeight="bold" color="primary-accent.500">
                {value.toFixed(2)}
              </Text>
            </Tooltip>
          </Flex>
          <Slider
            value={value}
            onChange={(val: number) => onConfigUpdate(key, val)}
            min={min}
            max={max}
            step={step}
            colorScheme="primary-accent"
          >
            <SliderTrack bg={sliderTrackBg}>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={5} />
          </Slider>
        </VStack>
      ))}
    </VStack>
  )
}
