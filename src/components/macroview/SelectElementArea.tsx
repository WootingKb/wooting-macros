import {
  Text,
  VStack,
  Input,
  SimpleGrid,
  Divider,
  useColorModeValue,
  HStack,
  IconButton,
  Stack,
  Tooltip,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Grid,
  Flex,
  GridItem
} from '@chakra-ui/react'
import { IntegrationIcon, KeyboardIcon, MouseIcon, SystemIcon } from '../icons'
import { TfiLayoutGrid3Alt } from 'react-icons/Tfi'
import SequenceElementButton from './SequenceElementButton'
import { HIDCategory, KeyType } from '../../enums'
import { Hid, HidInfo } from '../../maps/HIDmap'
import { MouseInput, MouseInputInfo } from '../../maps/MouseMap'
import { SystemEvent, SystemEventInfo } from '../../maps/SystemEventMap'
import { useMemo, useState } from 'react'

export default function SelectElementArea() {
  const [tabIndex, setTabIndex] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const iconColour = useColorModeValue('bg-dark', 'bg-light')
  const borderColour = useColorModeValue(
    'primary-light.500',
    'primary-dark.500'
  )

  const ElementsToShow = useMemo(() => {
    switch (tabIndex) {
      case 0:
        return (
          <Grid
            h="fit"
            templateColumns={[
              'repeat(2, 1fr)',
              'repeat(2, 1fr)',
              'repeat(3, 1fr)'
            ]}
            gap={1}
            overflowY="auto"
            css={{
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
          >
            <GridItem colSpan={[2, 2, 3]}>
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
                    <SimpleGrid
                      w="100%"
                      h="fit"
                      columns={[2, 2, 3]}
                      spacing="1"
                      overflowY="auto"
                      css={{
                        '&::-webkit-scrollbar': {
                          display: 'none'
                        }
                      }}
                    >
                      {SystemEvent.all
                        .filter((element) =>
                          element.displayString
                            .toLowerCase()
                            .includes(searchValue.toLowerCase())
                        )
                        .map((info: SystemEventInfo) => (
                          <SequenceElementButton
                            key={info.displayString}
                            displayText={info.displayString}
                            properties={{
                              type: 'SystemEventAction',
                              data: info.defaultData
                            }}
                          />
                        ))}
                    </SimpleGrid>
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
                          columns={[2, 2, 3]}
                          spacing="1"
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
                              <SequenceElementButton
                                key={HIDinfo.HIDcode}
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
                    <SimpleGrid
                      w="100%"
                      h="fit"
                      columns={[2, 2, 3]}
                      spacing="1"
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
                  </AccordionPanel>
                </AccordionItem>
                {/** Plugins */}
                {/* <AccordionItem></AccordionItem> */}
              </Accordion>
            </GridItem>
          </Grid>
        )
      case 1:
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
                        columns={[2, 2, 3]}
                        spacing="1"
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
                            <SequenceElementButton
                              key={HIDinfo.HIDcode}
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
                          ))}
                      </SimpleGrid>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
            </Accordion>
          </Flex>
        )
      case 2:
        return (
          <SimpleGrid
            h="fit"
            columns={[2, 2, 3]}
            spacing={1}
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
      case 3:
        return (
          <SimpleGrid
            h="fit"
            columns={[2, 2, 3]}
            spacing={1}
            overflowY="auto"
            css={{
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
          >
            {SystemEvent.all
              .filter((element) =>
                element.displayString
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
              )
              .map((info: SystemEventInfo) => (
                <SequenceElementButton
                  key={info.displayString}
                  displayText={info.displayString}
                  properties={{
                    type: 'SystemEventAction',
                    data: info.defaultData
                  }}
                />
              ))}
          </SimpleGrid>
        )
      case 4:
        return (
          <SimpleGrid
            h="fit"
            columns={[2, 2, 3]}
            spacing={1}
            overflowY="auto"
            css={{
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
          >
            <Text fontWeight={'semibold'}>Coming Soon</Text>
          </SimpleGrid>
        )
      default:
        return <></>
    }
  }, [tabIndex, searchValue])

  return (
    <VStack
      w="33%"
      h="100%"
      p="3"
      alignItems="normal"
      borderRight="1px"
      borderColor={borderColour}
    >
      <Text fontWeight="semibold" fontSize={['sm', 'md']}>
        ELEMENTS
      </Text>
      <Stack
        direction={['column', 'column', 'row']}
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack>
          <Tooltip
            variant="brand"
            label="All Elements"
            aria-label="All elements category button"
            hasArrow
          >
            <IconButton
              variant={tabIndex === 0 ? 'brandSelected' : 'brandGhost'}
              aria-label="All Elements Tab"
              icon={
                <Icon
                  as={TfiLayoutGrid3Alt}
                  boxSize={5}
                  color={tabIndex === 0 ? 'bg-dark' : iconColour}
                />
              }
              onClick={() => setTabIndex(0)}
            />
          </Tooltip>
          <Tooltip
            variant="brand"
            label="Keyboard Keys"
            aria-label="Keyboard Keys category button"
            hasArrow
          >
            <IconButton
              variant={tabIndex === 1 ? 'brandSelected' : 'brandGhost'}
              aria-label="Keyboard Key Elements"
              icon={
                <KeyboardIcon color={tabIndex === 1 ? 'bg-dark' : iconColour} />
              }
              onClick={() => setTabIndex(1)}
            />
          </Tooltip>
          <Tooltip
            variant="brand"
            label="Mouse Buttons"
            aria-label="Mouse buttons category button"
            hasArrow
          >
            <IconButton
              variant={tabIndex === 2 ? 'brandSelected' : 'brandGhost'}
              aria-label="Mouse Button Elements"
              icon={
                <MouseIcon color={tabIndex === 2 ? 'bg-dark' : iconColour} />
              }
              onClick={() => setTabIndex(2)}
            />
          </Tooltip>
          <Tooltip
            variant="brand"
            label="System Events"
            aria-label="System events category button"
            hasArrow
          >
            <IconButton
              variant={tabIndex === 3 ? 'brandSelected' : 'brandGhost'}
              aria-label="System Event Elements"
              icon={
                <SystemIcon color={tabIndex === 3 ? 'bg-dark' : iconColour} />
              }
              onClick={() => setTabIndex(3)}
            />
          </Tooltip>
          <Tooltip
            variant="brand"
            label="Integrations"
            aria-label="Integrations category button"
            hasArrow
          >
            <IconButton
              variant={tabIndex === 4 ? 'brandSelected' : 'brandGhost'}
              aria-label="Integration Elements"
              icon={
                <IntegrationIcon color={tabIndex === 4 ? 'bg-dark' : iconColour} />
              }
              onClick={() => setTabIndex(4)}
            />
          </Tooltip>
        </HStack>
        <Input
          maxW={['100%', '100%', '55%']}
          maxH="32px"
          variant="brand"
          placeholder="Search"
          _placeholder={{ opacity: 1, color: borderColour }}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </Stack>
      <Divider />
      {ElementsToShow}
    </VStack>
  )
}
