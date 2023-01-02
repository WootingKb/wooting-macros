import { SimpleGrid } from '@chakra-ui/react'
import { SystemEvent, SystemEventInfo } from '../../../maps/SystemEventMap'
import SequenceElementButton from '../SequenceElementButton'

type Props = {
    searchValue: string
}

export default function SystemEventsGrid({ searchValue }: Props) {
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
      {SystemEvent.all
        .filter((element) =>
          element.displayString
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        )
        .map((info: SystemEventInfo) => (
          <SequenceElementButton
            key={info.displayString}
            displayText={info.displayString}
            properties={{
              type: 'SystemEventAction',
              data: info.defaultData
            }}
          />
        ))}
    </SimpleGrid>
  )
}