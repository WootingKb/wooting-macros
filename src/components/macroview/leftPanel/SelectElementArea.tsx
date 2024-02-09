import {
  HStack,
  Input,
  Text,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'
import useMainBgColour from '../../../hooks/useMainBgColour'
import SelectAreaAccordion from './AccordionComponents/SelectAreaAccordion'

interface Props {
  searchValue: string
  changeSearchValue: (newValue: string) => void
}

export default function SelectElementArea({
  searchValue,
  changeSearchValue
}: Props) {
  const borderColour = useColorModeValue(
    'primary-light.500',
    'primary-dark.500'
  )
  const cancelSearchButtonColour = useColorModeValue('#A0AEC0', '#52525b')

  return (
    <VStack w="33%" h="full" bg={useMainBgColour()} spacing={0}>
      <HStack w="full" px={[2, 4, 6]} py={[2, 4]} alignItems="center">
        <Text
          textAlign="left"
          p={1}
          fontWeight="semibold"
          fontSize={['md', 'lg']}
        >
          Elements
        </Text>
        <Input
          type="search"
          maxW="full"
          maxH="32px"
          variant="brand"
          placeholder="Search for an element..."
          _placeholder={{ opacity: 1, color: borderColour }}
          onChange={(event) => changeSearchValue(event.target.value)}
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
      <SelectAreaAccordion searchValue={searchValue} />
    </VStack>
  )
}
