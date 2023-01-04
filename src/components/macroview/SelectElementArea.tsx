import { Text, VStack, Input, useColorModeValue } from '@chakra-ui/react'
import { useState } from 'react'
import AllElementsGrid from './elementGrids/AllElementsGrid'

export default function SelectElementArea() {
  const [searchValue, setSearchValue] = useState('')
  const bg = useColorModeValue('bg-light', 'primary-dark.900')
  const borderColour = useColorModeValue(
    'primary-light.500',
    'primary-dark.500'
  )
  const cancelSearchButtonColour = useColorModeValue('#A0AEC0', '#52525b')

  return (
    <VStack w="33%" h="100%" bg={bg}>
      <VStack w="full" px={[2, 4, 6]} py={2}>
        <Text w="full" fontWeight="semibold" fontSize={['sm', 'md']}>
          Elements
        </Text>
        <Input
          type="search"
          maxW={['full', 'full', '55%']}
          maxH="32px"
          variant="brand"
          placeholder="Search"
          _placeholder={{ opacity: 1, color: borderColour }}
          onChange={(event) => setSearchValue(event.target.value)}
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
        />
      </VStack>
      <AllElementsGrid searchValue={searchValue} />
    </VStack>
  )
}
