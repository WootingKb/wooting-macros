import { Box, Button, Flex, HStack, useColorMode, VStack, Text, IconButton } from '@chakra-ui/react'
import { AddIcon, EditIcon } from '@chakra-ui/icons'
import MacroCard from "./MacroCard";
import { Macro } from "../types";
import { Link } from 'wouter';

type Props = {}

function Overview({}: Props) {
    const { colorMode, toggleColorMode } = useColorMode()

    // Get Macros
    let macros: Macro[] = [
        {"name": "Macro 1", "isActive": false, "trigger": "trigger not available", "sequence":"not available"},
        {"name": "Macro 2", "isActive": true, "trigger": "trigger not available", "sequence":"not available"},
        {"name": "Macro 3", "isActive": false, "trigger": "trigger not available", "sequence":"not available"},
        {"name": "Macro 4", "isActive": false, "trigger": "trigger not available", "sequence":"not available"},
        {"name": "Macro 5", "isActive": true, "trigger": "trigger not available", "sequence":"not available"},
        {"name": "Macro 6", "isActive": true, "trigger": "trigger not available", "sequence":"not available"},
    ]

    return (
        <HStack minH="100vh" spacing="0">
            {/** Left Side Panel */}
            <VStack borderRight="1px" h="100vh" p="4">
                <Box bg="gray.400" p="4px" rounded="md" w="100%">Default</Box>
                <Box bg="gray.500" p="4px" rounded="md" w="100%">Collection 1</Box>
                <Box bg="gray.500" p="4px" rounded="md" w="100%">Collection 2</Box>
                <Box bg="gray.500" p="4px" rounded="md" w="100%">Collection 3</Box>
                <Button leftIcon={<AddIcon />}>
                New Collection
                </Button>
                <Button onClick={toggleColorMode}>
                Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
                </Button>
            </VStack>
            {/** Main Panel */}
            <VStack minH="100vh">
                <Flex justifyContent="space-between" alignItems="center" p="4" borderBottom="1px" w="100%">
                <VStack>
                    <HStack w="100%">
                    <IconButton aria-label='Collection Icon Button' icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24px">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                    </svg>} variant="ghost">
                    </IconButton>
                    <Text fontWeight="bold" fontSize="xl">Default Collection</Text>
                    <IconButton aria-label="Collection Edit Button" icon={<EditIcon />} variant="ghost"/>
                    </HStack>
                    <HStack w="100%">
                    <Button leftIcon={<AddIcon />}>
                        Export Collection
                    </Button>
                    <Button leftIcon={<AddIcon />}>
                        Import Macros
                    </Button>
                    <Button leftIcon={<AddIcon />}>
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
                <Flex direction="row" wrap="wrap" justify="space-around" rowGap="1" p="8px">
                {macros.map((macro:Macro) => <MacroCard macro={macro}/>)}
                </Flex>
            </VStack>
        </HStack>
    )
}

export default Overview