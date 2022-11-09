import { Button } from '@chakra-ui/react'
import { ActionEventType } from '../../types'

type Props = {
  properties: ActionEventType
  displayText: string
  onClick: (text: string, type: ActionEventType) => void
}

const SequenceElementButton = ({
  properties: type,
  displayText,
  onClick
}: Props) => {
  // when a user presses a sequence element button, it adds a sequence element to the sequence (list)
  // info required:
  // type, e.g. KeypressEvent, ActionEvent
  //
  return (
    <Button
      colorScheme="yellow"
      size={['sm']}
      onClick={() => onClick(displayText, type)}
    >
      {displayText}
    </Button>
  )
}

export default SequenceElementButton
