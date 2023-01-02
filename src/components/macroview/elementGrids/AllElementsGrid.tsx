import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Flex,
  AccordionIcon,
  AccordionPanel,
  SimpleGrid,
  AspectRatio
} from '@chakra-ui/react'
import { HIDCategory, KeyType } from '../../../enums'
import { Hid, HidInfo } from '../../../maps/HIDmap'
import { SystemIcon, KeyboardIcon, MouseIcon } from '../../icons'
import SequenceElementButton from '../SequenceElementButton'
import MouseButtonsGrid from './MouseButtonsGrid'
import SystemEventsGrid from './SystemEventsGrid'

type Props = {
  searchValue: string
}

export default function AllElementsGrid({ searchValue }: Props) {
  return (
    <Flex
      direction={'column'}
      h="fit"
      gap={1}
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}
    >
      <Accordion allowMultiple p={0}>
        {/** System Events */}
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
                <SystemIcon />
                System Events
              </Flex>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} px={0}>
            <SystemEventsGrid searchValue={searchValue} />
          </AccordionPanel>
        </AccordionItem>
        {/** Keyboard Keys */}
        {Object.keys(HIDCategory)
          .filter((key) => isNaN(Number(key)))
          .map((categoryName: string) => (
            <AccordionItem key={categoryName}>
              <h2>
                <AccordionButton>
                  <Flex
                    as="span"
                    flex="1"
                    textAlign="left"
                    fontWeight={'semibold'}
                    alignItems="center"
                    gap={2}
                  >
                    <KeyboardIcon />
                    {categoryName}
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} px={0}>
                <SimpleGrid
                  w="100%"
                  h="fit"
                  columns={
                    categoryName === 'Alphanumeric' ||
                    categoryName === 'Function'
                      ? 5
                      : [4, 4, 5]
                  }
                  spacing={2}
                  overflowY="auto"
                  css={{
                    '&::-webkit-scrollbar': {
                      display: 'none'
                    }
                  }}
                >
                  {Hid.all
                    .filter(
                      (element) =>
                        element.displayString
                          .toLowerCase()
                          .includes(searchValue.toLowerCase()) &&
                        HIDCategory[element.category] === categoryName
                    )
                    .map((HIDinfo: HidInfo) => (
                      <AspectRatio ratio={1} key={HIDinfo.HIDcode}>
                        <SequenceElementButton
                          displayText={HIDinfo.displayString}
                          properties={{
                            type: 'KeyPressEventAction',
                            data: {
                              keypress: HIDinfo.HIDcode,
                              press_duration: 1,
                              keytype: KeyType[KeyType.DownUp]
                            }
                          }}
                        />
                      </AspectRatio>
                    ))}
                </SimpleGrid>
              </AccordionPanel>
            </AccordionItem>
          ))}
        {/** Mouse Buttons */}
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
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} px={0}>
            <MouseButtonsGrid searchValue={searchValue} />
          </AccordionPanel>
        </AccordionItem>
        {/** Plugins */}
        {/* <AccordionItem></AccordionItem> */}
      </Accordion>
    </Flex>
  )
}
