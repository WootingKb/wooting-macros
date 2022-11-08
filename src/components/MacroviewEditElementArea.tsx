import { VStack } from '@chakra-ui/react'
import { ActionEventType } from '../types'

type Props = {
  sequenceList: ActionEventType[]
  onSequenceChange: (newList: ActionEventType[]) => void
}

const MacroviewEditElementArea = ({sequenceList, onSequenceChange}: Props) => {
  return (
    <VStack w="25%" h="full" borderLeft='1px' borderColor='gray.200'>
    </VStack>
  )
}

export default MacroviewEditElementArea