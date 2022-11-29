import { Button, Text } from '@chakra-ui/react'
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
    if ((sequence.at(-1)?.type !== "DelayEventAction") && (sequence.length > 0)) {
      onElementAdd({
        type: 'DelayEventAction',
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
      <Text fontSize={['xs', 'sm', 'md']}>{displayText}</Text>
    </Button>
  )
}

export default SequenceElementButton
