import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Flex,
  AccordionIcon,
  AccordionPanel,
  AspectRatio,
  useColorMode,
  useColorModeValue,
  Grid,
  GridItem,
  Text,
  Divider
} from '@chakra-ui/react'
import { useCallback, useMemo } from 'react'
import {
  scrollbarsStylesDark,
  scrollbarStylesLight
} from '../../../constants/utils'
import { HIDCategory, KeyType } from '../../../constants/enums'
import { Hid, HidInfo } from '../../../constants/HIDmap'
import { SystemEvent } from '../../../constants/SystemEventMap'
import { SystemIcon, KeyboardIcon, MouseIcon } from '../../icons'
import SelectElementButton from '../SelectElementButton'
import MouseButtonsGrid from './MouseButtonsGrid'
import SystemEventsGrid from './SystemEventsGrid'
import { MouseInput } from '../../../constants/MouseMap'

type Props = {
  searchValue: string
}

export default function AllElementsGrid({ searchValue }: Props) {
  const { colorMode } = useColorMode()
  const accordionBg = useColorModeValue('primary-light.50', 'primary-dark.800')

  const systemEventElements = useMemo(() => {
    if (searchValue.trim() === '') {
      return SystemEvent.all
    }
    return SystemEvent.all.filter((element) =>
      element.displayString.toLowerCase().includes(searchValue)
    )
  }, [searchValue])

  const keyboardKeyElements = useCallback(
    (categoryName: string) => {
      if (searchValue.trim() === '') {
        return Hid.all.filter(
          (element) => HIDCategory[element.category] === categoryName
        )
      }
      return Hid.all.filter(
        (element) =>
          HIDCategory[element.category] === categoryName &&
          element.displayString.toLowerCase().includes(searchValue)
      )
    },
    [searchValue]
  )

  const mouseElements = useMemo(() => {
    if (searchValue.trim() === '') {
      return MouseInput.all
    }
    return MouseInput.all.filter((element) =>
      element.displayString.toLowerCase().includes(searchValue)
    )
  }, [searchValue])

  const indices = useMemo(() => {
    if (searchValue.trim() === '') {
      return undefined
    }

    let count = 0

    if (systemEventElements.length > 0) {
      count++
    }

    const keyboardKeyCategories = Object.keys(HIDCategory).filter((key) =>
      isNaN(Number(key))
    )

    for (let i = 0; i < keyboardKeyCategories.length; i++) {
      const categoryName = keyboardKeyCategories[i]
      if (keyboardKeyElements(categoryName).length > 0) {
        count++
      }
    }
    if (mouseElements.length > 0) {
      count++
    }
    return [...Array(count).keys()]
  }, [
    keyboardKeyElements,
    mouseElements.length,
    searchValue,
    systemEventElements.length
  ])

  return (
    <Flex
      direction="column"
      w="full"
      h="fit"
      overflowY="auto"
      alignItems={
        indices !== undefined && indices.length === 0 ? 'center' : 'flex-start'
      }
      sx={colorMode === 'light' ? scrollbarStylesLight : scrollbarsStylesDark}
    >
      {indices !== undefined && indices.length === 0 && searchValue !== '' && (
        <>
          <Divider />
          <Text mt={4} fontWeight="semibold">
            Nothing found, try another query.
          </Text>
        </>
      )}
      <Accordion w="full" allowMultiple p={0} index={indices}>
        {/** System Events */}
        {systemEventElements.length > 0 && (
          <AccordionItem>
            <h2>
              <AccordionButton px={6}>
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
                <AccordionIcon boxSize={6} />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} px={0} bg={accordionBg} shadow="inner">
              <SystemEventsGrid elementsToRender={systemEventElements} />
            </AccordionPanel>
          </AccordionItem>
        )}
        {/** Keyboard Keys */}
        {Object.keys(HIDCategory)
          .filter((key) => isNaN(Number(key)))
          .map(
            (categoryName: string) =>
              keyboardKeyElements(categoryName).length > 0 && (
                <AccordionItem key={categoryName}>
                  <h2>
                    <AccordionButton px={6}>
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
                  <AccordionPanel pb={4} px={0} bg={accordionBg} shadow="inner">
                    <Grid
                      w="full"
                      h="fit"
                      px={4}
                      templateColumns={{
                        base: 'repeat(4, 1fr)',
                        md: 'repeat(6, 1fr)',
                        xl: 'repeat(8, 1fr)'
                      }}
                      gap={2}
                    >
                      {keyboardKeyElements(categoryName).map(
                        (HIDinfo: HidInfo) => (
                          <GridItem
                            colSpan={HIDinfo.requiresLongDisplay ? 2 : 1}
                            key={HIDinfo.HIDcode}
                          >
                            <AspectRatio
                              h="full"
                              ratio={HIDinfo.requiresLongDisplay ? 2 / 1 : 1}
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
        {/** Mouse Buttons */}
        {mouseElements.length > 0 && (
          <AccordionItem>
            <h2>
              <AccordionButton px={6}>
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
            <AccordionPanel pb={4} px={0} bg={accordionBg} shadow="inner">
              <MouseButtonsGrid elementsToRender={mouseElements} />
            </AccordionPanel>
          </AccordionItem>
        )}
        {/** Plugins */}
        {/* <AccordionItem></AccordionItem> */}
      </Accordion>
    </Flex>
  )
}
