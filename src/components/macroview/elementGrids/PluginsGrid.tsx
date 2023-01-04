import { SimpleGrid } from '@chakra-ui/react'

type Props = {
  searchValue: string
}

export default function PluginsGrid({ searchValue }: Props) {
  return (
    <SimpleGrid
      h="fit"
      columns={[2, 2, 3]}
      px={4}
      spacing={2}
    ></SimpleGrid>
  )
}
