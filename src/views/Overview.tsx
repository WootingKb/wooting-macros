import { HStack, useDisclosure } from '@chakra-ui/react'
import CollectionModal from '../components/overview/CollectionModal'
import LeftPanel from '../components/overview/LeftPanel'
import CollectionPanel from '../components/overview/CollectionPanel'

function Overview() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <HStack minH="100vh" spacing="0" overflow="hidden">
      <LeftPanel onOpen={onOpen} />
      <CollectionPanel onOpen={onOpen} />
      <CollectionModal
        isOpen={isOpen}
        onClose={onClose}
      />
    </HStack>
  )
}

export default Overview
