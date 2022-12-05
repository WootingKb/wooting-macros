import { AddIcon } from '@chakra-ui/icons'
import {
  VStack,
  Divider,
  Button,
  HStack,
  Text,
  useColorMode,
  useColorModeValue,
  Tooltip,
  IconButton
} from '@chakra-ui/react'
import { Collection } from '../../types'
import { useApplicationContext } from '../../contexts/applicationContext'
import CollectionButton from './CollectionButton'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useState } from 'react'
import { invoke } from '@tauri-apps/api'
import ToggleGrabbingButton from './ToggleGrabbingButton'

type Props = {
  onOpenCollectionModal: () => void
  onOpenSettingsModal: () => void
}

export default function LeftPanel({
  onOpenCollectionModal,
  onOpenSettingsModal
}: Props) {
  const {
    collections,
    selection,
    onCollectionUpdate,
    changeSelectedCollectionIndex,
    updateIsRenamingCollection
  } = useApplicationContext()
  const { colorMode, toggleColorMode } = useColorMode()
  const [parent] = useAutoAnimate<HTMLDivElement>()
  const panelBg = useColorModeValue('gray.100', 'gray.900')
  const dividerBg = useColorModeValue('gray.400', 'gray.600')

  const onCollectionButtonPress = (newActiveIndex: number) => {
    changeSelectedCollectionIndex(newActiveIndex)
  }

  return (
    <VStack
      bg={panelBg}
      borderRight="1px"
      borderColor={dividerBg}
      h="100vh"
      p="2"
      w={['30%', '25%', '15%']}
      justifyContent="space-between"
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}
    >
      <VStack w="100%">
        <HStack w="100%" justifyContent="space-between">
          <Text w="100%" fontWeight="bold">
            Collections
          </Text>
          <ToggleGrabbingButton />
        </HStack>
        <Divider borderColor={dividerBg} />
        <VStack w="100%" ref={parent}>
          {collections.map((collection: Collection, index: number) => (
            <CollectionButton
              collection={collection}
              index={index}
              key={collection.name}
              isFocused={index == selection.collectionIndex}
              setFocus={onCollectionButtonPress}
              toggleCollection={() =>
                onCollectionUpdate(
                  {
                    ...collections[index],
                    active: !collections[index].active
                  },
                  index
                )
              }
            />
          ))}
        </VStack>
        <Button
          colorScheme="yellow"
          size={['sm']}
          leftIcon={<AddIcon />}
          onClick={() => {
            updateIsRenamingCollection(false)
            onOpenCollectionModal()
          }}
        >
          New Collection
        </Button>
      </VStack>
      <HStack w="100%">
        <Button
          variant="outline"
          borderColor="gray.400"
          onClick={onOpenSettingsModal}
          w="100%"
          size={'sm'}
        >
          <Text fontSize={['2xs', 'xs']}>Settings</Text>
        </Button>
        {/* <Button
          variant="outline"
          borderColor="gray.400"
          onClick={toggleColorMode}
          w="100%"
          size={'sm'}
        >
          <Text fontSize={['2xs', 'xs']}>
            Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
          </Text>
        </Button> */}
        {/* <Button
          variant="outline"
          borderColor="gray.400"
          w="100%"
          size={'sm'}
          isDisabled
        >
          <Text fontSize={['2xs', 'xs']}>Give Feedback</Text>
        </Button> */}
      </HStack>
    </VStack>
  )
}
