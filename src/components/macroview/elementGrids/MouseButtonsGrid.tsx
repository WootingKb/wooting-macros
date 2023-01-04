import { AspectRatio, SimpleGrid } from '@chakra-ui/react'
import { MouseInput, MouseInputInfo } from '../../../maps/MouseMap'
import SequenceElementButton from '../SequenceElementButton'

type Props = {
  searchValue: string
}

export default function MouseButtonsGrid({ searchValue }: Props) {
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
      {MouseInput.all
        .filter((element) =>
          element.displayString
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        )
        .map((info: MouseInputInfo) => (
          <AspectRatio ratio={1} key={info.webButtonVal}>
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
