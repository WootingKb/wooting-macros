import { Button } from '@chakra-ui/react'

type Props = {
  displayText: string
  onClick: (text:string) => void
}

const SequenceElementButton = ({displayText, onClick}: Props) => {
  // when a user presses a sequence element button, it adds a sequence element to the sequence (list)
  // info required:
  // type, e.g. KeypressEvent, ActionEvent
  //
  return (
    <Button colorScheme="yellow" size={["sm"]} onClick={() => onClick(displayText)}>
      {displayText}
    </Button>
  )
}

export default SequenceElementButton