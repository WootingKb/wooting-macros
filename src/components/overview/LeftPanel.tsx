import { AddIcon } from '@chakra-ui/icons'
import { VStack, Divider, Button, HStack, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { Collection } from '../../types'
import { useApplicationContext } from '../../contexts/applicationContext'
import CollectionButton from './CollectionButton'
import { updateBackendConfig } from '../../utils'
import { useState } from 'react'

type Props = {
    onOpen: () => void
}

const LeftPanel = ({onOpen}: Props) => {
  const {
    collections,
    selection,
    changeSelectedCollectionIndex,
  } = useApplicationContext()
    const [isRenamingCollection, setIsRenamingCollection] = useState(false)
      const { colorMode, toggleColorMode } = useColorMode()
      const panelBg = useColorModeValue("gray.200", "gray.900")
      const dividerBg = useColorModeValue("gray.400", "gray.600")

    const onCollectionButtonPress = (newActiveIndex: number) => {
    changeSelectedCollectionIndex(newActiveIndex)
  }

  const onCollectionToggle = (index: number) => {
    collections[index].active = !collections[index].active
    setIsRenamingCollection(!isRenamingCollection)
    updateBackendConfig(collections)
  }
  
  return (
    <VStack
    bg={panelBg}
    borderRight="1px"
    borderColor={dividerBg}
    h="100vh"
    p="2"
    w={['25%', '20%', '15%']}
    justifyContent="space-between"
    >
    <VStack w="100%">
        <Text w="100%" fontWeight="bold">
        Collections
        </Text>
        <Divider borderColor={dividerBg} />
        {collections.map((collection: Collection, index: number) => (
        <CollectionButton
            collection={collection}
            index={index}
            key={index}
            isFocused={index == selection.collectionIndex}
            setFocus={onCollectionButtonPress}
            toggleCollection={onCollectionToggle}
        />
        ))}
        <Button
        colorScheme="yellow"
        size={['sm']}
        leftIcon={<AddIcon />}
        onClick={() => {
            setIsRenamingCollection(false)
            onOpen()
        }}
        >
        New Collection
        </Button>
    </VStack>
    <HStack w="100%">
        <Button variant="outline" borderColor="gray.400" onClick={toggleColorMode} w="100%" size={'sm'}>
        <Text fontSize={'xs'}>
            Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
        </Text>
        </Button>
        <Button variant="outline" borderColor="gray.400" w="100%" size={'sm'}>
        <Text fontSize={'xs'}>Give Feedback</Text>
        </Button>
    </HStack>
    </VStack>
  )
}

export default LeftPanel