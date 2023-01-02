import { SimpleGrid } from '@chakra-ui/react'
import { MouseInput, MouseInputInfo } from '../../../maps/MouseMap'
import SequenceElementButton from '../SequenceElementButton'

type Props = {
    searchValue: string
}

export default function MouseButtonsGrid({ searchValue }: Props) {
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
      {MouseInput.all
        .filter((element) =>
          element.displayString
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        )
        .map((info: MouseInputInfo) => (
          <SequenceElementButton
            key={info.webButtonVal}
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
        ))}
    </SimpleGrid>
  )
}