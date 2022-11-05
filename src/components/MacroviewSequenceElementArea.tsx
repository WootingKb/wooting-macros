import { Text, VStack, Input, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { ActionEventType } from '../types'
import { AddIcon } from '@chakra-ui/icons'

type Props = {
  sequenceList: ActionEventType[]
  onSequenceChange: () => void
}

const MacroviewSequenceElementArea = ({sequenceList, onSequenceChange}: Props) => {

  // The Sequence Element area houses "buttons" that users can press to add a specific element, e.g. keyboard key or action, to the sequence
  // It will have a filtering system, or a search system, or both

  // the components rendered will be uniform, but the data associated with each "button" corresponds to a single "thing"

  // TODO: create a new component, SequenceElement, that displays and holds information about "what can be in a sequence"

  return (
    <VStack bg="gray.200" w="33%" h="full" p="4px" alignItems="normal">
        <Text fontWeight="semibold" fontSize="xl">Sequence Elements</Text>
        <Input variant="outline" borderColor="gray.400" placeholder='Search' />
        <Tabs w="100%" size='sm' variant='soft-rounded' isFitted defaultIndex={0}>
            <TabList>
                <Tab><AddIcon /></Tab>
                <Tab><AddIcon /></Tab>
                <Tab><AddIcon /></Tab>
                <Tab><AddIcon /></Tab>
                <Tab><AddIcon /></Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                <Text>All goes here</Text>
                </TabPanel>
                <TabPanel>
                <Text>Keyboard keys goes here</Text>
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