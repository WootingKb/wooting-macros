import { Button } from '@chakra-ui/react'
import { useMacroContext } from '../../contexts/macroContext'
import { ActionEventType } from '../../types'

type Props = {
  properties: ActionEventType
  displayText: string
}

const SequenceElementButton = ({ properties, displayText }: Props) => {
  const { sequence, onElementAdd } = useMacroContext()

  function handleAddElement() {
    // check if last element in the sequence is a delay element
    // if not, add a delay
    if ((sequence.at(-1)?.type !== "Delay") && (sequence.length > 0)) {
      onElementAdd({
        type: 'Delay',
        data: 50
      })
    }
    // add element
    onElementAdd(properties)
  }

  return (
    <Button
      colorScheme="yellow"
      size={['sm']}
      onClick={handleAddElement}
    >
      {displayText}
    </Button>
  )
}

export default SequenceElementButton
