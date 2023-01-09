import { AspectRatio, SimpleGrid } from '@chakra-ui/react'
import { SystemEventInfo } from '../../../constants/SystemEventMap'
import SelectElementButton from '../SelectElementButton'

interface Props {
  elementsToRender: SystemEventInfo[]
}

export default function SystemEventsGrid({ elementsToRender }: Props) {
  return (
    <SimpleGrid
      h="fit"
      columns={{
        base: 2,
        md: 3,
        xl: 4
      }}
      px={4}
      spacing={2}
    >
      {elementsToRender.map((info: SystemEventInfo) => (
        <AspectRatio ratio={2 / 1} key={info.displayString}>
          <SelectElementButton
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
