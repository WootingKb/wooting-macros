import {
  Flex,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  SimpleGrid,
  AspectRatio
} from '@chakra-ui/react'
import { HIDCategory, KeyType } from '../../../enums'
import { Hid, HidInfo } from '../../../maps/HIDmap'
import SequenceElementButton from '../SequenceElementButton'

type Props = {
  searchValue: string
}

export default function KeyboardKeysGrid({ searchValue }: Props) {
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
      <Accordion allowMultiple>
        {Object.keys(HIDCategory)
          .filter((key) => isNaN(Number(key)))
          .map((categoryName: string) => (
            <AccordionItem key={categoryName}>
              <h2>
                <AccordionButton>
                  <Box
                    as="span"
                    flex="1"
                    textAlign="left"
                    fontWeight={'semibold'}
                  >
                    {categoryName}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <SimpleGrid
                  w="100%"
                  h="fit"
                  columns={
                    categoryName === 'Alphanumeric' ||
                    categoryName === 'Function'
                      ? [4, 5]
                      : [4, 4, 5]
                  } // needs adjustment
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
      </Accordion>
    </Flex>
  )
}
