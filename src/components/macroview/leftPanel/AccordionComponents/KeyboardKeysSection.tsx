import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AspectRatio,
  Flex,
  Grid,
  GridItem
} from '@chakra-ui/react'
import { KeyType } from '../../../../constants/enums'
import { HidInfo } from '../../../../constants/HIDmap'
import { KeyboardKeyCategory } from '../../../../types'
import { KeyboardIcon } from '../../../icons'
import SelectElementButton from '../SelectElementButton'
import { DefaultMacroDelay } from '../../../../constants'

interface Props {
  keyboardKeyCategories: KeyboardKeyCategory[]
}

export default function KeyboardKeysSection({ keyboardKeyCategories }: Props) {
  return (
    <>
      {keyboardKeyCategories.map((category: KeyboardKeyCategory) => (
        <AccordionItem key={category.name}>
          <h2>
            <AccordionButton>
              <Flex
                as="span"
                flex="1"
                textAlign="left"
                fontWeight="semibold"
                alignItems="center"
                gap={2}
              >
                <KeyboardIcon />
                {category.name}
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
              {category.elements.map((HIDinfo: HidInfo) => (
                <GridItem colSpan={HIDinfo.colSpan ?? 1} key={HIDinfo.HIDcode}>
                  <AspectRatio
                    h="full"
                    ratio={HIDinfo.colSpan !== undefined ? HIDinfo.colSpan : 1}
                  >
                    <SelectElementButton
                      nameText={HIDinfo.displayString}
                      properties={{
                        type: 'KeyPressEventAction',
                        data: {
                          keypress: HIDinfo.HIDcode,
                          press_duration: DefaultMacroDelay,
                          keytype: KeyType[KeyType.DownUp]
                        }
                      }}
                    />
                  </AspectRatio>
                </GridItem>
              ))}
            </Grid>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </>
  )
}
