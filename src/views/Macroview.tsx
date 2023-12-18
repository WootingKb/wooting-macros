import { HStack, VStack } from '@chakra-ui/react'
import EditArea from '../components/macroview/rightPanel/EditArea'
import SelectElementArea from '../components/macroview/leftPanel/SelectElementArea'
import SequencingArea from '../components/macroview/centerPanel/SequencingArea'
import Header from '../components/macroview/topArea/Header'
import { useMacroContext } from '../contexts/macroContext'
import { useEffect } from 'react'

type Props = {
  isEditing: boolean
  onOpenMacroSettingsModal: () => void
}

export default function Macroview({
  isEditing,
  onOpenMacroSettingsModal
}: Props) {
  const { changeIsUpdatingMacro } = useMacroContext()

  useEffect(() => {
    changeIsUpdatingMacro(isEditing)
  }, [changeIsUpdatingMacro, isEditing])
  return (
    <VStack h="full" spacing="0px" overflow="hidden">
      {/** Top Header */}
      <Header isEditing={isEditing} />
      <HStack
        w="full"
        h={{
          base: 'calc(100% - 80px)',
          md: 'calc(100% - 100px)',
          xl: 'calc(100% - 120px)'
        }}
        spacing="0"
      >
        {/** Bottom Panels */}
        <SelectElementArea />
        <SequencingArea onOpenMacroSettingsModal={onOpenMacroSettingsModal} />
        <EditArea />
      </HStack>
    </VStack>
  )
}
