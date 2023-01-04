import { AspectRatio, SimpleGrid } from '@chakra-ui/react'
import { SystemEvent, SystemEventInfo } from '../../../maps/SystemEventMap'
import SequenceElementButton from '../SequenceElementButton'

type Props = {
  searchValue: string
}

export default function SystemEventsGrid({ searchValue }: Props) {
  return (
    <SimpleGrid
      h="fit"
      columns={[3, 4]}
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
          <AspectRatio ratio={1} key={info.displayString}>
            <SequenceElementButton
              displayText={info.displayString}
              properties={{
                type: 'SystemEventAction',
                data: info.defaultData
              }}
            />
          </AspectRatio>
        ))}
    </SimpleGrid>
  )
}
