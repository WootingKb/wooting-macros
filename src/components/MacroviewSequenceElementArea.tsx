import { Text, VStack, Input, Tabs, TabList, TabPanels, Tab, TabPanel, SimpleGrid } from '@chakra-ui/react'
import { ActionEventType } from '../types'
import { AddIcon } from '@chakra-ui/icons'
import { Hid, HidInfo } from '../HIDmap'
import SequenceElementButton from './SequenceElementButton'

type Props = {
  sequenceList: ActionEventType[]
  onSequenceChange: (newList: ActionEventType[]) => void
}

const MacroviewSequenceElementArea = ({sequenceList, onSequenceChange}: Props) => {
  const temp:ActionEventType[] = sequenceList

  // The Sequence Element area houses "buttons" that users can press to add a specific element, e.g. keyboard key or action, to the sequence
  // It will have a filtering system, or a search system, or both

  // the components rendered will be uniform, but the data associated with each "button" corresponds to a single "thing"
  
  const onSequenceElementButtonPress = (text:string) => {
    console.log("pressed sequence element " + text)
  }


  return (
    <VStack w="33%" h="100%" p="8px" alignItems="normal" borderRight='1px' borderColor='gray.200'>
        <Text fontWeight="semibold" fontSize={['sm', 'md']}>Sequence Elements</Text>
        <Input h="40px" variant="outline" borderColor="gray.400" placeholder='Search' />
        <Tabs w="100%" h="100%" size='sm' variant="soft-rounded" isFitted defaultIndex={0} colorScheme="yellow">
            <TabList>
                <Tab><AddIcon /></Tab>
                <Tab><AddIcon /></Tab>
                <Tab><AddIcon /></Tab>
                <Tab><AddIcon /></Tab>
                <Tab><AddIcon /></Tab>
            </TabList>

            <TabPanels w="100%" h="calc(100% - 90px)" overflowY="auto">
              {/** the 90px comes from the heights of the text, input, and tablist elements above */}
              <TabPanel>
              <Text>All goes here</Text>
              </TabPanel>
              <TabPanel w="full" p="4px" h="100%">
                <SimpleGrid h="100%" columns={[2, 2, 3]} spacing="1">
                  {Hid.all.map((HIDinfo: HidInfo, index:number) =>
                    <SequenceElementButton key={index} displayText={HIDinfo.displayString} onClick={onSequenceElementButtonPress}/>
                  )}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
              <Text>Mouse buttons goes here</Text>
              </TabPanel>
              <TabPanel>
              <Text>System commands go here</Text>
              </TabPanel>
              <TabPanel>
              <Text>Plugin commands go here, in a dropdown; each dropdown is for a specific application</Text>
              </TabPanel>
            </TabPanels>
        </Tabs>
    </VStack>
  )
}

export default MacroviewSequenceElementArea