import {
  Text,
  VStack,
  Input,
  useColorModeValue,
  HStack
} from '@chakra-ui/react'
import { useState } from 'react'
import useMainBgColour from '../../../hooks/useMainBgColour'
import SelectAreaAccordion from './AccordionComponents/SelectAreaAccordion'

export default function SelectElementArea() {
  const [searchValue, setSearchValue] = useState('')
  const borderColour = useColorModeValue(
    'primary-light.500',
    'primary-dark.500'
  )
  const cancelSearchButtonColour = useColorModeValue('#A0AEC0', '#52525b')

  return (
    <VStack w="33%" h="full" bg={useMainBgColour()} spacing={0}>
      <HStack w="full" px={[2, 4, 6]} py={[2, 4]} alignItems="center">
        <Text textAlign="left" p={1} fontWeight="semibold" fontSize={['md', 'lg']}>
          Elements
        </Text>
        <Input
          type="search"
          maxW="full"
          maxH="32px"
          variant="brand"
          placeholder="Search for element..."
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
      </HStack>
      <SelectAreaAccordion searchValue={searchValue.toLowerCase()} />
    </VStack>
  )
}
