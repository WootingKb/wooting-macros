import { AddIcon, SettingsIcon } from '@chakra-ui/icons'
import { Button, Divider, Text, useToast, VStack } from '@chakra-ui/react'
import { Collection } from '../../types'
import { useApplicationContext } from '../../contexts/applicationContext'
import { updateMacroOutput } from '../../constants/utils'
import CollectionButton from './CollectionButton'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useCallback, useMemo } from 'react'
import useScrollbarStyles from '../../hooks/useScrollbarStyles'
import useMainBgColour from '../../hooks/useMainBgColour'
import useBorderColour from '../../hooks/useBorderColour'
import { error } from 'tauri-plugin-log'
import { SearchBar } from '../../views/Overview'

interface Props {
  onOpenSettingsModal: () => void
  searchValue: string
  changeSearchValue: (newValue: string) => void
}

export default function LeftPanel({
  onOpenSettingsModal,
  searchValue,
  changeSearchValue
}: Props) {
  const {
    collections,
    selection,
    onCollectionAdd,
    onCollectionUpdate,
    changeSelectedCollectionIndex,
    isMacroOutputEnabled,
    changeMacroOutputEnabled
  } = useApplicationContext()
  const [parent] = useAutoAnimate<HTMLDivElement>()
  const toast = useToast()

  const onNewCollectionButtonPress = useCallback(() => {
    onCollectionAdd({
      enabled: true,
      icon: `:😍:`,
      macros: [],
      name: `Collection ${collections.length + 1}`
    })
  }, [collections.length, onCollectionAdd])

  const isSearching: boolean = useMemo((): boolean => {
    return searchValue.length !== 0
  }, [searchValue])

  return (
    <VStack
      bg={useMainBgColour()}
      h="100vh"
      w="300px"
      borderRight="1px"
      borderColor={useBorderColour()}
      justifyContent="space-between"
    >
      <VStack w="full" h="full" overflowY="auto">
        <VStack w="full" h="fit-content" p={4} gap={2}>
          <Text w="full" fontWeight="bold" fontSize="28px">
            Collections
          </Text>

          <SearchBar changeSearchValue={changeSearchValue} />
          <Divider />
        </VStack>
        <VStack
          w="full"
          h="full"
          overflowY="auto"
          overflowX="hidden"
          ref={parent}
          px={4}
          spacing={1}
          sx={useScrollbarStyles()}
        >
          {!isSearching &&
            collections.map((collection: Collection, index: number) => (
              <CollectionButton
                collection={collection}
                index={index}
                key={`${collection.name.toLowerCase().trim()} + ${index}`}
                isFocused={index == selection.collectionIndex}
                isMacroOutputEnabled={isMacroOutputEnabled}
                setFocus={(index) => changeSelectedCollectionIndex(index)}
                toggleCollection={() =>
                  onCollectionUpdate(
                    {
                      ...collections[index],
                      enabled: !collections[index].enabled
                    },
                    index
                  )
                }
              />
            ))}
          {!isSearching && (
            <Button
              rounded="md"
              size="md"
              w="full"
              variant="yellowGradient"
              p={1}
              minH="2.5rem"
              margin={1}
              leftIcon={<AddIcon />}
              fontSize="md"
              onClick={onNewCollectionButtonPress}
            >
              New Collection
            </Button>
          )}
        </VStack>
      </VStack>
      <VStack w="full" px={4} pb={4}>
        <Button
          w="full"
          colorScheme={isMacroOutputEnabled ? 'green' : 'orange'}
          size="sm"
          onClick={() => {
            updateMacroOutput(isMacroOutputEnabled)
              .then(() => {
                changeMacroOutputEnabled(isMacroOutputEnabled)
              })
              .catch((e) => {
                error(e)
                toast({
                  title: `Error ${
                    isMacroOutputEnabled ? 'disabling' : 'enabling'
                  } macro output`,
                  description: `Unable to ${
                    isMacroOutputEnabled ? 'disable' : 'enable'
                  } macro output, please re-open the app. If that does not work, please contact us on Discord.`,
                  status: 'error',
                  isClosable: true
                })
              })
          }}
        >
          <Text fontSize={['sm', 'md']}>
            {isMacroOutputEnabled ? 'Disable' : 'Enable'} Macro Output
          </Text>
        </Button>
        <Button
          w="full"
          variant="brandAccent"
          size="sm"
          leftIcon={<SettingsIcon />}
          onClick={onOpenSettingsModal}
        >
          <Text fontSize={['sm', 'md']}>Settings</Text>
        </Button>
      </VStack>
    </VStack>
  )
}
