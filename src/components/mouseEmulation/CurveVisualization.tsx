import {
  VStack,
  HStack,
  Text,
  Select,
  useColorModeValue,
  Box
} from '@chakra-ui/react'
import { CurveType, MouseEmulationConfig } from '../../types/mouseEmulation'
import { useMemo } from 'react'

interface Props {
  config: MouseEmulationConfig
  onCurveTypeChange: (curveType: CurveType) => void
}

export default function CurveVisualization({ config, onCurveTypeChange }: Props) {
  const labelColor = useColorModeValue('gray.700', 'gray.300')
  const graphBg = useColorModeValue('white', 'gray.800')
  const gridColor = useColorModeValue('gray.300', 'gray.600')
  const curveColor = useColorModeValue('primary-accent.500', 'primary-accent.400')
  const axisColor = useColorModeValue('gray.500', 'gray.400')

  // Calculate curve points for visualization
  const curvePoints = useMemo(() => {
    const points: [number, number][] = []
    const steps = 150
    const factor = config.curve_factor
    const activation = config.activation_point
    const maxActuation = config.maximum_actuation

    for (let i = 0; i <= steps; i++) {
      const normalized = i / steps // 0 to 1

      // Apply activation point threshold
      if (normalized < activation) {
        points.push([normalized, 0])
        continue
      }

      let value = 0
      const adjusted = (normalized - activation) / (1 - activation) // Adjust for activation point

      switch (config.curve_type) {
        case CurveType.Power:
          value = Math.pow(adjusted, factor)
          break
        case CurveType.Log:
          value = Math.log(1 + adjusted * (Math.E - 1)) / Math.log(Math.E)
          break
        case CurveType.SCurve:
          // S-curve: applies sigmoid-like behavior
          value = adjusted < 0.5
            ? 2 * adjusted * adjusted
            : 1 - Math.pow(-2 * adjusted + 2, 2) / 2
          break
        case CurveType.Linear:
          value = adjusted
          break
      }

      points.push([normalized, Math.min(value, maxActuation)])
    }
    return points
  }, [config.curve_type, config.curve_factor, config.activation_point, config.maximum_actuation])

  // SVG dimensions
  const SVG_WIDTH = 550
  const SVG_HEIGHT = 350
  const PADDING_LEFT = 60
  const PADDING_RIGHT = 30
  const PADDING_TOP = 20
  const PADDING_BOTTOM = 50

  const graphWidth = SVG_WIDTH - PADDING_LEFT - PADDING_RIGHT
  const graphHeight = SVG_HEIGHT - PADDING_TOP - PADDING_BOTTOM

  // Convert data coordinates to SVG coordinates
  const toSvgX = (value: number) => PADDING_LEFT + value * graphWidth
  const toSvgY = (value: number) => PADDING_TOP + graphHeight - value * graphHeight

  // Generate path string for SVG
  const pathData = useMemo(() => {
    if (curvePoints.length === 0) return ''
    let path = `M ${toSvgX(curvePoints[0][0])} ${toSvgY(curvePoints[0][1])}`
    for (let i = 1; i < curvePoints.length; i++) {
      path += ` L ${toSvgX(curvePoints[i][0])} ${toSvgY(curvePoints[i][1])}`
    }
    return path
  }, [curvePoints])

  return (
    <VStack w="full" spacing={6} align="stretch">
      <HStack justify="space-between">
        <Text fontWeight="semibold" color={labelColor}>
          Curve Type
        </Text>
        <Select
          value={config.curve_type}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onCurveTypeChange(e.target.value as CurveType)}
          w="150px"
          colorScheme="primary-accent"
        >
          <option value={CurveType.Power as string}>Power</option>
          <option value={CurveType.Log as string}>Logarithmic</option>
          <option value={CurveType.SCurve as string}>S-Curve</option>
          <option value={CurveType.Linear as string}>Linear</option>
        </Select>
      </HStack>

      <Box w="full" overflowX="auto" display="flex" justifyContent="center">
        <svg
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          style={{ background: graphBg, borderRadius: '8px', border: `2px solid ${gridColor}`, flexShrink: 0 }}
        >
          {/* Grid lines - horizontal */}
          {[0, 0.25, 0.5, 0.75, 1].map((gridValue) => (
            <line
              key={`h-grid-${gridValue}`}
              x1={PADDING_LEFT}
              y1={toSvgY(gridValue)}
              x2={SVG_WIDTH - PADDING_RIGHT}
              y2={toSvgY(gridValue)}
              stroke={gridColor}
              strokeDasharray="4"
              opacity={0.4}
              strokeWidth="1"
            />
          ))}

          {/* Grid lines - vertical */}
          {[0, 0.25, 0.5, 0.75, 1].map((gridValue) => (
            <line
              key={`v-grid-${gridValue}`}
              x1={toSvgX(gridValue)}
              y1={PADDING_TOP}
              x2={toSvgX(gridValue)}
              y2={SVG_HEIGHT - PADDING_BOTTOM}
              stroke={gridColor}
              strokeDasharray="4"
              opacity={0.4}
              strokeWidth="1"
            />
          ))}

          {/* Y Axis */}
          <line
            x1={PADDING_LEFT}
            y1={PADDING_TOP}
            x2={PADDING_LEFT}
            y2={SVG_HEIGHT - PADDING_BOTTOM}
            stroke={axisColor}
            strokeWidth="2"
          />

          {/* X Axis */}
          <line
            x1={PADDING_LEFT}
            y1={SVG_HEIGHT - PADDING_BOTTOM}
            x2={SVG_WIDTH - PADDING_RIGHT}
            y2={SVG_HEIGHT - PADDING_BOTTOM}
            stroke={axisColor}
            strokeWidth="2"
          />

          {/* Activation point indicator */}
          {config.activation_point > 0 && (
            <line
              x1={toSvgX(config.activation_point)}
              y1={PADDING_TOP}
              x2={toSvgX(config.activation_point)}
              y2={SVG_HEIGHT - PADDING_BOTTOM}
              stroke="orange"
              strokeWidth="2"
              opacity="0.6"
              strokeDasharray="6"
            />
          )}

          {/* Curve path using path element */}
          <path
            d={pathData}
            fill="none"
            stroke={curveColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Draw dots along the curve for visibility */}
          {curvePoints.map((point, index) => {
            // Only draw every 5th point to avoid clutter
            if (index % 5 !== 0) return null
            return (
              <circle
                key={`curve-point-${index}`}
                cx={toSvgX(point[0])}
                cy={toSvgY(point[1])}
                r="3"
                fill={curveColor}
                opacity="0.8"
              />
            )
          })}

          {/* Y-axis labels */}
          <text x={PADDING_LEFT - 10} y={toSvgY(1) + 4} fontSize="14" fontWeight="bold" fill={labelColor} textAnchor="end">
            1.0
          </text>
          <text x={PADDING_LEFT - 10} y={toSvgY(0.5) + 4} fontSize="12" fill={labelColor} textAnchor="end">
            0.5
          </text>
          <text x={PADDING_LEFT - 10} y={toSvgY(0) + 4} fontSize="14" fontWeight="bold" fill={labelColor} textAnchor="end">
            0
          </text>

          {/* X-axis labels */}
          <text x={toSvgX(0)} y={SVG_HEIGHT - 25} fontSize="14" fontWeight="bold" fill={labelColor} textAnchor="middle">
            0
          </text>
          <text x={toSvgX(0.5)} y={SVG_HEIGHT - 25} fontSize="12" fill={labelColor} textAnchor="middle">
            0.5
          </text>
          <text x={toSvgX(1)} y={SVG_HEIGHT - 25} fontSize="14" fontWeight="bold" fill={labelColor} textAnchor="middle">
            1.0
          </text>

          {/* Axis labels */}
          <text x={15} y={PADDING_TOP + 20} fontSize="12" fill={labelColor}>
            Output
          </text>
          <text x={SVG_WIDTH - 40} y={SVG_HEIGHT - 10} fontSize="12" fill={labelColor}>
            Input
          </text>
        </svg>
      </Box>

      <HStack spacing={4} fontSize="sm" color={labelColor} wrap="wrap">
        <Text><strong>Curve:</strong> {config.curve_type}</Text>
        <Text><strong>Factor:</strong> {config.curve_factor.toFixed(2)}</Text>
        <Text><strong>Activation:</strong> {config.activation_point.toFixed(2)}</Text>
        <Text><strong>Max:</strong> {config.maximum_actuation.toFixed(2)}</Text>
      </HStack>

      <Text fontSize="sm" color={labelColor} textAlign="center" fontStyle="italic">
        Adjust settings above to see the curve change in real-time
      </Text>
    </VStack>
  )
}
