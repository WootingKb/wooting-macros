import { Box, Button, Flex, Text, IconButton, useColorMode, Switch, Divider, VStack } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { Macro } from '../types'
type Props = {
  macro: Macro
}

function MacroCard({macro}: Props) {
  return (
    <VStack w="33%" border="1px" rounded="md" p="3" spacing="8px">
      {/** Header */}
      <Flex w="100%" justifyContent="space-between">
        <Flex w="100%" gap="8px">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24px">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>
            <Text fontWeight="semibold">{macro.name}</Text>
        </Flex>
        <IconButton aria-label='Kebab Menu Button' icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24px">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>} variant="link">
        </IconButton>
      </Flex>
      {/** Trigger Display */}
      <Flex w="100%">
        <Text>{macro.trigger}</Text>
      </Flex>
      <Divider/>
      {/** Misc */}
      <Flex w="100%" alignItems="center" justifyContent="space-between">
        <Button leftIcon={<EditIcon />}>Edit</Button>
        <Switch defaultChecked={macro.isActive}/>
      </Flex>
    </VStack>
  )
}

export default MacroCard