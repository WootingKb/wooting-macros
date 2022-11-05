import { VStack } from '@chakra-ui/react'
import { ActionEventType } from '../types'

type Props = {
  sequenceList: ActionEventType[]
  onSequenceChange: () => void
}

const MacroviewEditElementArea = ({sequenceList, onSequenceChange}: Props) => {
  return (
    <VStack bg="gray.200" w="25%" h="full">
    </VStack>
  )
}

export default MacroviewEditElementArea