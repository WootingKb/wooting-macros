import { AspectRatio, SimpleGrid } from '@chakra-ui/react'
import { MouseInputInfo } from '../../../constants/MouseMap'
import SequenceElementButton from '../SequenceElementButton'

type Props = {
  elementsToRender: MouseInputInfo[]
}

export default function MouseButtonsGrid({ elementsToRender }: Props) {
  return (
    <SimpleGrid
      h="fit"
      columns={{
        base: 2,
        md: 4,
        xl: 6
      }}
      px={4}
      spacing={2}
    >
      {elementsToRender.map((info: MouseInputInfo) => (
        <AspectRatio ratio={2 / 1} key={info.webButtonVal}>
          <SequenceElementButton
            displayText={info.displayString}
            properties={{
              type: 'MouseEventAction',
              data: {
                type: 'Press',
                data: {
                  type: 'DownUp',
                  button: info.enumVal,
                  duration: 20
                }
              }
            }}
          />
        </AspectRatio>
      ))}
    </SimpleGrid>
  )
}
