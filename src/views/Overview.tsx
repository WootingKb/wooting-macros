import { HStack, Input, useColorModeValue } from '@chakra-ui/react'
import LeftPanel from '../components/overview/LeftPanel'
import CollectionPanel from '../components/overview/CollectionPanel'
import { useState } from 'react'

export function SearchBar({
  changeSearchValue
}: {
  changeSearchValue: (newValue: string) => void
}) {
  const cancelSearchButtonColour = useColorModeValue('#A0AEC0', '#52525b')
  const borderColour = useColorModeValue(
    'primary-light.500',
    'primary-dark.500'
  )

  return (
    <Input
      type="search"
      maxW="full"
      maxH="32px"
      variant="brand"
      placeholder="Search for a macro..."
      _placeholder={{ opacity: 1, color: borderColour }}
      sx={{
        '&::-webkit-search-cancel-button': {
          WebkitAppearance: 'none',
          display: 'inline-block',
          width: '16px',
          height: '16px',
          background: `linear-gradient(45deg, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 43%,${cancelSearchButtonColour} 45%,${cancelSearchButtonColour} 55%,rgba(0,0,0,0) 57%,rgba(0,0,0,0) 100%), linear-gradient(135deg, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 43%,${cancelSearchButtonColour} 45%,${cancelSearchButtonColour} 55%,rgba(0,0,0,0) 57%,rgba(0,0,0,0) 100%)`,
          cursor: 'pointer'
        }
      }}
      onChange={(event) => changeSearchValue(event.target.value)}
    />
  )
}

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
