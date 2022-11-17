import { useEffect, useState } from 'react'
import {
  HStack,
  useDisclosure,
} from '@chakra-ui/react'
import { useApplicationContext } from '../contexts/applicationContext'
import CollectionModal from '../components/overview/CollectionModal'
import LeftPanel from '../components/overview/LeftPanel'
import CollectionPanel from '../components/overview/CollectionPanel'

function Overview() {
  const {
    changeSelectedMacroIndex,
  } = useApplicationContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isRenamingCollection, setIsRenamingCollection] = useState(false)

  useEffect(() => {
    changeSelectedMacroIndex(-1) // none selected
  }, [])

  return (
    <HStack minH="100vh" spacing="0" overflow="hidden">
      <LeftPanel onOpen={onOpen} />
      <CollectionPanel onOpen={onOpen} setIsRenamingCollection={setIsRenamingCollection}/>
      <CollectionModal
        isRenaming={isRenamingCollection}
        isOpen={isOpen}
        onClose={onClose}
      />
    </HStack>
  )
}

export default Overview
