import { ReactNode } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { Box } from '@chakra-ui/react'

interface Props {
  id: string
  children: ReactNode
}

export default function DroppableWrapper({ id, children }: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: id
  })
  const style = {
    backgroundColor: isOver ? '#80808055' : 'transparent',
    transition: 'background-color 300ms ease-out'
  }

  return (
    <Box
      w="full"
      h={{
        base: 'calc(100% - 84px)',
        sm: 'calc(100% - 100px)',
        md: 'calc(100% - 108px)'
      }}
      ref={setNodeRef}
      style={style}
    >
      {children}
    </Box>
  )
}
