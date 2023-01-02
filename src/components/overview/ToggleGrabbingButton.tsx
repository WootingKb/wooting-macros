import { Tooltip, IconButton, useColorModeValue } from '@chakra-ui/react'
import { invoke } from '@tauri-apps/api'
import { useState } from 'react'
import { LightningIcon, LightningSlashedIcon } from '../icons'

export default function ToggleGrabbingButton() {
  const [isInputGrabbingEnabled, setIsInputGrabbingEnabled] = useState(true)
  const strokeColour = useColorModeValue(
    'primary-light.800',
    'primary-dark.800'
  )
  const fillColour = useColorModeValue(
    'primary-accent.400',
    'primary-accent.300'
  )
  const disabledStrokeColour = useColorModeValue(
    'primary-light.800',
    'primary-dark.400'
  )
  const disabledFillColour = useColorModeValue(
    'primary-light.800',
    'primary-dark.800'
  )

  return (
    <Tooltip
      hasArrow
      label={
        isInputGrabbingEnabled
          ? 'Disable Input Grabbing'
          : 'Enable Input Grabbing'
      }
      closeOnClick={false}
      aria-label="Toggle Input Grabbing button tooltip"
      rounded="sm"
      variant="brand"
    >
      <IconButton
        aria-label="toggle app on/off button"
        size="xs"
        variant="brand"
        icon={
          isInputGrabbingEnabled ? (
            <LightningIcon fill={fillColour} stroke={strokeColour} />
          ) : (
            <LightningSlashedIcon
              fill={disabledFillColour}
              stroke={disabledStrokeColour}
            />
          )
        }
        onClick={() => {
          setIsInputGrabbingEnabled((value) => {
            invoke<void>('control_grabbing', {
              frontendBool: !value
            }).catch((e) => {
              console.error(e)
            })
            return !value
          })
        }}
      />
    </Tooltip>
  )
}
