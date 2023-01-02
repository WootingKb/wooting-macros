import { SimpleGrid, Text } from '@chakra-ui/react'

type Props = {
    searchValue: string
}

export default function PluginsGrid({ searchValue }: Props) {
  return (
    <SimpleGrid
      h="fit"
      columns={[2, 2, 3]}
      spacing={2}
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}
    >
      <Text fontWeight={'semibold'}>Coming Soon</Text>
    </SimpleGrid>
  )
}