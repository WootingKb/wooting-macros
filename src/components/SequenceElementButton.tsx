import { Button } from '@chakra-ui/react'

type Props = {
  displayText: string
}

const SequenceElementButton = ({displayText}: Props) => {
  // when a user presses a sequence element button, it adds a sequence element to the sequence (list)
  // info required:
  // type, e.g. KeypressEvent, ActionEvent
  //
  return (
    <Button colorScheme="yellow" size={["sm"]}>
      {displayText}
    </Button>
  )
}

export default SequenceElementButton