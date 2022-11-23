import { Button } from '@chakra-ui/react'
import { useSequenceContext } from '../../contexts/sequenceContext'
import { ActionEventType } from '../../types'

type Props = {
  properties: ActionEventType
  displayText: string
}

const SequenceElementButton = ({ properties, displayText }: Props) => {
  const { onElementAdd } = useSequenceContext()

  return (
    <Button
      colorScheme="yellow"
      size={['sm']}
      onClick={() => onElementAdd(properties)}
    >
      {displayText}
    </Button>
  )
}

export default SequenceElementButton
