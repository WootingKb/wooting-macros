import { Tooltip, IconButton } from '@chakra-ui/react'
import { invoke } from '@tauri-apps/api'
import { useState } from 'react'

export default function ToggleGrabbingButton() {
  const [isInputGrabbingEnabled, setIsInputGrabbingEnabled] = useState(true)
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="yellow"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width={20}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="gray"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width={20}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.412 15.655L9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 10.5h8.25l-4.707 5.043M8.457 8.457L3 3m5.457 5.457l7.086 7.086m0 0L21 21"
              />
            </svg>
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
