import { Box } from '@chakra-ui/react'
import { useDraggable } from '@dnd-kit/core'
import { ReactNode } from 'react'
import { HidInfo } from '../../../constants/HIDmap'
import { MouseInputInfo } from '../../../constants/MouseMap'
import { SystemEventInfo } from '../../../constants/SystemEventMap'

interface Props {
  id: number | string
  info: HidInfo | SystemEventInfo | MouseInputInfo
  children: ReactNode
}

export default function DraggableWrapper({ id, info, children }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: {
        info: info
    }
  })
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
      }
    : undefined

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {children}
    </Box>
  )
}
