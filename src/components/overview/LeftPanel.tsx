import { AddIcon, SettingsIcon } from '@chakra-ui/icons'
import {
  VStack,
  Divider,
  Button,
  HStack,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { Collection } from '../../types'
import { useApplicationContext } from '../../contexts/applicationContext'
import CollectionButton from './CollectionButton'
import { useAutoAnimate } from '@formkit/auto-animate/react'
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
    changeIsUpdatingCollection: updateIsRenamingCollection
  } = useApplicationContext()
  const [parent] = useAutoAnimate<HTMLDivElement>()
  const panelBg = useColorModeValue('stone.200', 'zinc.900')
  const borderColour = useColorModeValue('stone.500', 'zinc.500')

  const onCollectionButtonPress = (newActiveIndex: number) => {
    changeSelectedCollectionIndex(newActiveIndex)
  }

  return (
    <VStack
      bg={panelBg}
      borderRight="1px"
      borderColor={borderColour}
      h="100vh"
      p="2"
      w={['30%', '25%', '15%']}
      justifyContent="space-between"
    >
      <VStack w="100%" h="calc(100%) - 100px" pt="1" overflow="hidden">
        <HStack w="100%" justifyContent="space-between">
          <Text w="100%" fontWeight="bold">
            Collections
          </Text>
          <ToggleGrabbingButton />
        </HStack>
        <Divider />
        <Button
          size={['sm']}
          w="full"
          variant="yellowGradient"
          p="2"
          leftIcon={<AddIcon />}
          onClick={() => {
            updateIsRenamingCollection(false)
            onOpenCollectionModal()
          }}
        >
          New Collection
        </Button>
        <VStack
          w="100%"
          overflowY="auto"
          css={{
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }}
        >
          <VStack w="100%" ref={parent} spacing="1">
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
        </VStack>
      </VStack>
      <HStack w="100%">
        <Button
          w="100%"
          variant={'brand'}
          size={'sm'}
          leftIcon={<SettingsIcon />}
          onClick={onOpenSettingsModal}
        >
          <Text fontSize={['sm', 'md']}>Settings</Text>
        </Button>
      </HStack>
    </VStack>
  )
}
