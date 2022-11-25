import { Button } from '@chakra-ui/react'
import { useMacroContext } from '../../contexts/macroContext'
import { ActionEventType } from '../../types'

type Props = {
  properties: ActionEventType
  displayText: string
}

const SequenceElementButton = ({ properties, displayText }: Props) => {
  const { onElementAdd } = useMacroContext()

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
