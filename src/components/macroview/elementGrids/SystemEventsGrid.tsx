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
      columns={[1, 2]}
      px={4}
      spacing={2}
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
