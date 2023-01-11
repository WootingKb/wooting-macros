import {
  AccordionItem,
  AccordionButton,
  Flex,
  AccordionIcon,
  AccordionPanel,
  Grid,
  GridItem,
  AspectRatio
} from '@chakra-ui/react'
import { HIDCategory, KeyType } from '../../../../constants/enums'
import { HidInfo } from '../../../../constants/HIDmap'
import { KeyboardIcon } from '../../../icons'
import SelectElementButton from '../SelectElementButton'

interface Props {
  keyboardKeyElements: (categoryName: string) => HidInfo[]
}

export default function KeyboardKeysSection({ keyboardKeyElements }: Props) {
  return (
    <>
      {Object.keys(HIDCategory)
        .filter((key) => isNaN(Number(key)))
        .map(
          (categoryName: string) =>
            keyboardKeyElements(categoryName).length > 0 && (
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
                    <AccordionIcon boxSize={6} />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <Grid
                    w="full"
                    h="fit"
                    px={4}
                    templateColumns={{
                      base: 'repeat(6, 1fr)',
                      md: 'repeat(8, 1fr)',
                      xl: 'repeat(10, 1fr)'
                    }}
                    gap={2}
                  >
                    {keyboardKeyElements(categoryName).map(
                      (HIDinfo: HidInfo) => (
                        <GridItem
                          colSpan={
                            HIDinfo.colSpan !== undefined ? HIDinfo.colSpan : 1
                          }
                          key={HIDinfo.HIDcode}
                        >
                          <AspectRatio
                            h="full"
                            ratio={
                              HIDinfo.colSpan !== undefined
                                ? HIDinfo.colSpan / 1
                                : 1
                            }
                          >
                            <SelectElementButton
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
                        </GridItem>
                      )
                    )}
                  </Grid>
                </AccordionPanel>
              </AccordionItem>
            )
        )}
    </>
  )
}
