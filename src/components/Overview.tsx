import { BaseSyntheticEvent, useEffect, useState } from 'react'
import { invoke } from "@tauri-apps/api/tauri";
import MacroCard from "./MacroCard";
import { Collection, Macro } from "../types";
import { Link } from 'wouter';
import CollectionButton from './CollectionButton';
import { Box, Button, Flex, HStack, useColorMode, VStack, Text, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Input } from '@chakra-ui/react'
import { AddIcon, EditIcon } from '@chakra-ui/icons'
import { updateBackendConfig } from '../utils';

type Props = {
    collections: Collection[]
}

function Overview({collections}: Props) {
    const { colorMode, toggleColorMode } = useColorMode()
    const { isOpen: isOpenNewCollection, onOpen: onOpenNewCollection, onClose: onCloseNewCollection } = useDisclosure()
    const { isOpen: isOpenRenameCollection, onOpen: onOpenRenameCollection, onClose: onCloseRenameCollection } = useDisclosure()
    const [collectionName, setCollectionName] = useState("")
    const [collectionIndex, setCollectionIndex] = useState(0)
    const [canUseCollectionName, setCanUseCollectionName] = useState(true)

    useEffect(() => {
        for (let i = 0; i < collections.length; i++) {
            const collection = collections[i];
            if (collection.active) {
                setCollectionIndex(i)
            }
        }
    }, [])

    const onAddCollectionButtonPress = () => {
        console.log("add collection button pressed")
        collections.push({active: false, icon:"i", macros: [], name: collectionName })
        updateBackendConfig(collections)
        onCloseNewCollection()
    }

    const onCollectionNameChange = (event:BaseSyntheticEvent) => {
        let newName:string = event.target.value
        newName = newName.trim()

        setCollectionName(newName)
        for (let i = 0; i < collections.length; i++) {
            const collection = collections[i];
            if (collection.name.toUpperCase() === newName.toUpperCase()) {
                setCanUseCollectionName(false)
                return
            }
        }
        setCanUseCollectionName(true)
    }

    const onCollectionButtonPress = (newActiveIndex:number) => {
        setCollectionIndex(newActiveIndex)
    }

    const onCollectionToggle = (index:number) => {
        collections[index].active = !collections[index].active
        setCanUseCollectionName(!canUseCollectionName)
        updateBackendConfig(collections)
    }

    const onRenameCollection = () => {
        collections[collectionIndex].name = collectionName
        onCloseRenameCollection()
        updateBackendConfig(collections)
    }

    const onCollectionDelete = () => {
        collections.splice(collectionIndex, 1)
        collections[0].active = true
        setCollectionIndex(0)
        updateBackendConfig(collections)
    }

    const onMacroDelete = (macroIndex:number) => {
        collections[collectionIndex].macros.splice(macroIndex, 1)
        setCollectionName("reset")
        updateBackendConfig(collections)
    }

    return (
        <HStack minH="100vh" spacing="0">
            {/** Left Side Panel */}
            <VStack borderRight="1px" h="100vh" p="4">
                {collections.map((collection:Collection, index:number) => 
                    <CollectionButton collection={collection} index={index} key={index} isFocused={index == collectionIndex} setFocus={onCollectionButtonPress} toggleCollection={onCollectionToggle}/>
                )}
                <Button colorScheme="yellow" leftIcon={<AddIcon />} onClick={onOpenNewCollection}>
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
                    <Text fontWeight="bold" fontSize="xl">{collections[collectionIndex].name}</Text>
                    <IconButton aria-label="Collection Edit Button" icon={<EditIcon />} variant="ghost" isDisabled={collectionIndex <= 0} onClick={onOpenRenameCollection}/>
                    </HStack>
                    <HStack w="100%">
                    <Button leftIcon={<AddIcon />} isDisabled>
                        Export Collection
                    </Button>
                    <Button leftIcon={<AddIcon />} isDisabled>
                        Import Macros
                    </Button>
                    <Button leftIcon={<AddIcon />} isDisabled={collectionIndex <= 0} onClick={onCollectionDelete}>
                        Delete Collection
                    </Button>
                    </HStack>
                </VStack>
                <Link href={'/macroview/' + collectionIndex}>
                    <Button colorScheme="yellow" leftIcon={<AddIcon />}>
                        Add Macro
                    </Button>
                </Link>
                </Flex>
                <Flex w="100%" direction="row" wrap="wrap" gap="1" p="8px">
                {collections[collectionIndex].macros.map((macro:Macro, index:number) => <MacroCard macro={macro} index={index} key={index} collectionIndex={collectionIndex} onDelete={onMacroDelete}/>)}
                </Flex>
            </VStack>
            {/** New Collection Modal */}
            <Modal isOpen={isOpenNewCollection} onClose={onCloseNewCollection}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Give it a unique name</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input variant='flushed' isRequired isInvalid={!canUseCollectionName} onChange={onCollectionNameChange} placeholder='Collection Name'/>
                </ModalBody>
                <ModalFooter>
                    <Button mr={3} onClick={onCloseNewCollection}>
                    Close
                    </Button>
                    <Button colorScheme="yellow" onClick={onAddCollectionButtonPress}>Create</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
            {/** Rename Collection Modal */}
            <Modal isOpen={isOpenRenameCollection} onClose={onCloseRenameCollection}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Changed your mind?</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input variant='flushed' isRequired isInvalid={!canUseCollectionName} onChange={onCollectionNameChange} placeholder={collections[collectionIndex].name}/>
                </ModalBody>
                <ModalFooter>
                    <Button mr={3} onClick={onCloseRenameCollection}>
                    Close
                    </Button>
                    <Button colorScheme="yellow" onClick={onRenameCollection}>Rename</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </HStack>
    )
}

export default Overview