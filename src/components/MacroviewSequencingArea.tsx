import { VStack, HStack, Text, Button } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'

type Props = {

}

const MacroviewSequencingArea = ({}: Props) => {
  return (
    <VStack bg="gray.200" w="41%" h="full" p="4px">
      {/** Header */}
      <HStack justifyContent="space-around" w="100%">
        <Text fontWeight="semibold" fontSize="xl">Sequence</Text>
        <Button leftIcon={<EditIcon />}>Record</Button>
        <Button leftIcon={<EditIcon />}>Add Delay</Button>
      </HStack>
      {/** Timeline */}
      <VStack>
        {/**
         * needs to be a Scrollable, Sortable list
         * each sequence element can be moved around
         * each delay sequence elements can also be moved around
         * any non-delay sequence elements that are not separated by a delay are grouped together
         * groups can be moved as a whole, or individual elements can be pulled out of a group
         * there can be no delays within a group, all actions start at the same time (but not necessarily take the same amount of time)
         */}
      </VStack>
    </VStack>
  )
}

export default MacroviewSequencingArea