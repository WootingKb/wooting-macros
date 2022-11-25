import { VStack, HStack, useColorModeValue } from '@chakra-ui/react'
import EditArea from '../components/macroview/EditArea'
import MacroviewHeader from '../components/macroview/Header'
import MacroTypeArea from '../components/macroview/MacroTypeArea'
import SelectElementArea from '../components/macroview/SelectElementArea'
import SequencingArea from '../components/macroview/SequencingArea'
import TriggerArea from '../components/macroview/TriggerArea'

type Props = {
  isEditing: boolean
}

const Macroview = ({ isEditing }: Props) => {
  const dividerColour = useColorModeValue('gray.400', 'gray.600')

  return (
    <VStack h="100%" spacing="0px" overflow="hidden">
      <MacroviewHeader
        isEditing={isEditing}
      />
      <HStack w="100%" h={130} spacing="8px" p="8px">
        <MacroTypeArea />
        <TriggerArea />
      </HStack>
      <HStack
        w="100%"
        h="calc(100% - 190px)"
        borderTop="1px"
        borderColor={dividerColour}
        spacing="0"
      >
        {/** Bottom Panels */}
        <SelectElementArea />
        <SequencingArea />
        <EditArea />
      </HStack>
    </VStack>
  )
}

export default Macroview
