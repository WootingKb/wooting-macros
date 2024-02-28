import { HStack } from '@chakra-ui/react'
import LeftPanel from '../components/overview/LeftPanel'
import CollectionPanel from '../components/overview/CollectionPanel'
import { useState } from 'react'

type Props = {
  onOpenSettingsModal: () => void
}

export default function Overview({ onOpenSettingsModal }: Props) {
  const [searchValue, changeSearchValue] = useState('')
  return (
    <HStack minH="100vh" spacing="0" overflow="hidden">
      <LeftPanel
        onOpenSettingsModal={onOpenSettingsModal}
        changeSearchValue={changeSearchValue}
        searchValue={searchValue}
      />
      <CollectionPanel searchValue={searchValue} />
    </HStack>
  )
}
