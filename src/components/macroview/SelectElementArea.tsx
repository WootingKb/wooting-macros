import {
  Text,
  VStack,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Flex,
  Divider,
  useColorModeValue
} from '@chakra-ui/react'
import { ActionEventType } from '../../types'
import { AddIcon } from '@chakra-ui/icons'
import { Hid, HidInfo } from '../../maps/HIDmap'
import SequenceElementButton from './SequenceElementButton'
import { KeyType } from '../../enums'
import { useSequenceContext } from '../../contexts/sequenceContext'

const SelectElementArea = () => {
  const { addToSequence } = useSequenceContext()
  const dividerColour = useColorModeValue('gray.400', 'gray.600')

  const onSequenceElementButtonPress = (properties: ActionEventType) => {
    addToSequence(properties)
  }

  return (
    <VStack
      w="33%"
      h="100%"
      p="3"
      alignItems="normal"
      borderRight="1px"
      borderColor={dividerColour}
    >
      <Text fontWeight="semibold" fontSize={['sm', 'md']}>
        Sequence Elements
      </Text>
      <Divider borderColor={dividerColour} />
      <Tabs
        w="100%"
        h="100%"
        size="sm"
        variant="soft-rounded"
        isFitted
        defaultIndex={0}
        colorScheme="yellow"
      >
        <Flex
          w="100%"
          flexWrap="wrap"
          justifyContent={['center', 'center', 'space-between']}
          gap="2"
        >
          <TabList>
            <Tab>
              <AddIcon />
            </Tab>
            <Tab>
              <AddIcon />
            </Tab>
            <Tab>
              <AddIcon />
            </Tab>
            <Tab>
              <AddIcon />
            </Tab>
            <Tab>
              <AddIcon />
            </Tab>
          </TabList>
          <Input
            maxW={['100%', '100%', '40%', '50%', '55%']}
            maxH="32px"
            variant="outline"
            borderColor="gray.400"
            placeholder="Search"
            isDisabled
          />
        </Flex>
        <TabPanels
          w="100%"
          h={['calc(100% - 98px)', 'calc(100% - 102px)', 'calc(100% - 72px)']}
          mt={['4px']}
          overflowY="auto"
        >
          {/** the 90px comes from the heights of the text, input, and tablist elements above */}
          <TabPanel>
            <Text>All goes here</Text>
          </TabPanel>
          <TabPanel w="full" p="4px" h="100%">
            <SimpleGrid h="100%" columns={[2, 2, 3]} spacing="1">
              {Hid.all.map((HIDinfo: HidInfo, index: number) => (
                <SequenceElementButton
                  key={index}
                  displayText={HIDinfo.displayString}
                  properties={{
                    type: 'KeyPressEvent',
                    data: {
                      keypress: HIDinfo.HIDcode,
                      press_duration: 1,
                      keytype: KeyType[KeyType.DownUp]
                    }
                  }}
                  onClick={onSequenceElementButtonPress}
                />
              ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <Text>Mouse buttons goes here</Text>
          </TabPanel>
          <TabPanel>
            <Text>System commands go here</Text>
          </TabPanel>
          <TabPanel>
            <Text>
              Plugin commands go here, in a dropdown; each dropdown is for a
              specific application
            </Text>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  )
}

export default SelectElementArea
