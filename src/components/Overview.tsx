import { Box, Button, Flex, HStack, useColorMode, VStack, Text, IconButton } from '@chakra-ui/react'
import { AddIcon, EditIcon } from '@chakra-ui/icons'
import MacroCard from "./MacroCard";
import { Macro } from "../types";
import { Link } from 'wouter';

type Props = {
  macros: Macro[]
}

function Overview({macros}: Props) {
    const { colorMode, toggleColorMode } = useColorMode()

    return (
        <HStack minH="100vh" spacing="0">
            {/** Left Side Panel */}
            <VStack borderRight="1px" h="100vh" p="4">
                <Box bg="gray.400" p="4px" rounded="md" w="100%">Default</Box>
                <Box bg="gray.500" p="4px" rounded="md" w="100%">Collection 1</Box>
                <Box bg="gray.500" p="4px" rounded="md" w="100%">Collection 2</Box>
                <Box bg="gray.500" p="4px" rounded="md" w="100%">Collection 3</Box>
                <Button leftIcon={<AddIcon />} isDisabled>
                New Collection
                </Button>
                <Button onClick={toggleColorMode}>
                Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
                </Button>
            </VStack>
            {/** Main Panel */}
            <VStack minH="100vh" w="100%">
                <Flex justifyContent="space-between" alignItems="center" p="4" borderBottom="1px" w="100%">
                <VStack>
                    <HStack w="100%">
                    <IconButton aria-label='Collection Icon Button' icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="24px">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                    </svg>} variant="ghost" isDisabled>
                    </IconButton>
                    <Text fontWeight="bold" fontSize="xl">Default Collection</Text>
                    <IconButton aria-label="Collection Edit Button" icon={<EditIcon />} variant="ghost" isDisabled/>
                    </HStack>
                    <HStack w="100%">
                    <Button leftIcon={<AddIcon />} isDisabled>
                        Export Collection
                    </Button>
                    <Button leftIcon={<AddIcon />} isDisabled>
                        Import Macros
                    </Button>
                    <Button leftIcon={<AddIcon />} isDisabled>
                        Delete Collection
                    </Button>
                    </HStack>
                </VStack>
                <Link href='/macroview'>
                    <Button leftIcon={<AddIcon />}>
                        Add Macro
                    </Button>
                </Link>
                </Flex>
                <Flex w="100%" direction="row" wrap="wrap" justify="space-around" rowGap="1" p="8px">
                {macros.map((macro:Macro, index:number) => <MacroCard macro={macro} key={index}/>)}
                </Flex>
            </VStack>
        </HStack>
    )
}

export default Overview