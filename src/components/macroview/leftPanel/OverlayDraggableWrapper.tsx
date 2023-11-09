import { Box } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { HidInfo } from '../../../constants/HIDmap'
import { MouseInputInfo } from '../../../constants/MouseMap'
import { SystemEventInfo } from '../../../constants/SystemEventMap'

interface Props {
  id: number | string
  info: HidInfo | SystemEventInfo | MouseInputInfo
  children: ReactNode
}

export default function OverlayDraggableWrapper({ id, info, children }: Props) {
  return <Box>{children}</Box>
}
