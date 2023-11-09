import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AspectRatio,
  Flex,
  SimpleGrid
} from '@chakra-ui/react'
import { MouseInputInfo } from '../../../../constants/MouseMap'
import { MouseIcon } from '../../../icons'
import DraggableWrapper from '../DraggableWrapper'
import SelectElementButton from '../SelectElementButton'

interface Props {
  elementsToRender: MouseInputInfo[]
}

export default function MouseButtonsSection({ elementsToRender }: Props) {
  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Flex
            flex="1"
            textAlign="left"
            fontWeight={'semibold'}
            alignItems="center"
            gap={2}
          >
            <MouseIcon />
            Mouse Buttons
          </Flex>
          <AccordionIcon boxSize={6} />
        </AccordionButton>
      </h2>
      <AccordionPanel>
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
            <DraggableWrapper
              id={info.enumVal}
              info={info}
              key={info.enumVal}
            >
              <AspectRatio ratio={2 / 0.75} key={info.enumVal}>
                <SelectElementButton
                  nameText={info.displayString}
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
            </DraggableWrapper>
          ))}
        </SimpleGrid>
      </AccordionPanel>
    </AccordionItem>
  )
}
