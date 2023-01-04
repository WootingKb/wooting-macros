import { HStack } from '@chakra-ui/react'
import LeftPanel from '../components/overview/LeftPanel'
import CollectionPanel from '../components/overview/CollectionPanel'

type Props = {
  onOpenSettingsModal: () => void
}

export default function Overview({ onOpenSettingsModal }: Props) {

  return (
    <HStack minH="100vh" spacing="0" overflow="hidden">
      <LeftPanel
        onOpenSettingsModal={onOpenSettingsModal}
      />
      <CollectionPanel />
    </HStack>
  )
}
