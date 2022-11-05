import { Text, VStack, Input, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

type Props = {}

const MacroviewSequenceElementArea = (props: Props) => {
  return (
    <VStack bg="gray.200" w="33%" h="full" p="4px">
        <Text fontWeight="semibold" fontSize="xl">Sequence Elements</Text>
        <Input variant="outline" borderColor="gray.400" placeholder='Search' />
        <Tabs w="100%" size='sm' variant='soft-rounded' isFitted defaultIndex={0}>
            <TabList>
                <Tab><Text fontSize="xs">All</Text></Tab>
                <Tab><Text fontSize="xs">Keyboard</Text></Tab>
                <Tab><Text fontSize="xs">Mouse</Text></Tab>
                <Tab><Text fontSize="xs">System</Text></Tab>
                <Tab><Text fontSize="xs">Plugins</Text></Tab>
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