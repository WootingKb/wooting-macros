import { Button } from '@chakra-ui/react'
import { ActionEventType } from '../../types'

type Props = {
  properties: ActionEventType
  displayText: string
  onClick: (type: ActionEventType) => void
}

const SequenceElementButton = ({ properties, displayText, onClick }: Props) => {
  return (
    <Button
      colorScheme="yellow"
      size={['sm']}
      onClick={() => onClick(properties)}
    >
      {displayText}
    </Button>
  )
}

export default SequenceElementButton
