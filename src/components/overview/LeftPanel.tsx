import { AddIcon, SettingsIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Divider,
  HStack,
  Input,
  Switch,
  Text,
  Tooltip,
  useToast,
  VStack
} from '@chakra-ui/react'
import { Collection } from '../../types'
import { useApplicationContext } from '../../contexts/applicationContext'
import { updateMacroOutput } from '../../constants/utils'
import CollectionButton from './CollectionButton'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useCallback, useState } from 'react'
import useScrollbarStyles from '../../hooks/useScrollbarStyles'
import useMainBgColour from '../../hooks/useMainBgColour'
import useBorderColour from '../../hooks/useBorderColour'
import { error } from 'tauri-plugin-log'

interface Props {
  onOpenSettingsModal: () => void
}

function SearchBar({
  searchValue,
  changeSearchValue,
  setDisplaySearchResults
}) {
  const handleInput = (event) => {
    changeSearchValue(event.target.value.toLocaleLowerCase())
    if (event.target.value !== '') {
      setDisplaySearchResults(true)
    } else {
      setDisplaySearchResults(false)
    }
  }

  return (
    <Input
      placeholder="Search..."
      size="md"
      value={searchValue}
      onChange={handleInput}
    />
  )
}

export default function LeftPanel({ onOpenSettingsModal }: Props) {
  const [displaySearchResults, setDisplaySearchResults] = useState(false)

  const {
    collections,
    selection,
    onCollectionAdd,
    onCollectionUpdate,
    changeSelectedCollectionIndex,
    changeSearchValue,
    searchValue
  } = useApplicationContext()
  const [parent] = useAutoAnimate<HTMLDivElement>()
  const toast = useToast()
  const [isMacroOutputEnabled, setIsMacroOutputEnabled] = useState(true)

  const onNewCollectionButtonPress = useCallback(() => {
    onCollectionAdd({
      active: true,
      icon: `:😍:`,
      macros: [],
      name: `Collection ${collections.length + 1}`
    })
  }, [collections.length, onCollectionAdd])

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
          <HStack w="full" justifyContent="space-between" px={1}>
            <Text w="full" fontWeight="bold" fontSize="28px">
              Collections
            </Text>
            <Tooltip
              hasArrow
              label={
                isMacroOutputEnabled
                  ? 'Disable Macro Output'
                  : 'Enable Macro Output'
              }
              closeOnClick={false}
              variant="brand"
            >
              <Box>
                <Switch
                  size="sm"
                  variant="brand"
                  defaultChecked={isMacroOutputEnabled}
                  isChecked={isMacroOutputEnabled}
                  aria-label="Macro Output Toggle"
                  onChange={() => {
                    setIsMacroOutputEnabled((value) => {
                      updateMacroOutput(value).catch((e) => {
                        error(e)
                        toast({
                          title: `Error ${
                            !value ? 'disabling' : 'enabling'
                          } macro output`,
                          description: `Unable to ${
                            !value ? 'disable' : 'enable'
                          } macro output, please re-open the app. If that does not work, please contact us on Discord.`,
                          status: 'error',
                          duration: 2000,
                          isClosable: true
                        })
                      })
                      return !value
                    })
                  }}
                />
              </Box>
            </Tooltip>
          </HStack>
          <SearchBar
            searchValue={searchValue}
            changeSearchValue={changeSearchValue}
            setDisplaySearchResults={setDisplaySearchResults}
          />
          <Divider />

          {!displaySearchResults && (
            <Button
              size="lg"
              w="full"
              variant="yellowGradient"
              p={2}
              leftIcon={<AddIcon />}
              fontSize="md"
              onClick={onNewCollectionButtonPress}
            >
              New Collection
            </Button>
          )}
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
          {!displaySearchResults &&
            collections.map((collection: Collection, index: number) => (
              <CollectionButton
                collection={collection}
                index={index}
                key={`${collection.name} + ${index}`}
                isFocused={index == selection.collectionIndex}
                isMacroOutputEnabled={isMacroOutputEnabled}
                setFocus={(index) => changeSelectedCollectionIndex(index)}
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
      <HStack w="full" px={4} pb={4}>
        <Button
          w="full"
          variant="brandAccent"
          size="sm"
          leftIcon={<SettingsIcon />}
          onClick={onOpenSettingsModal}
        >
          <Text fontSize={['sm', 'md']}>Settings</Text>
        </Button>
      </HStack>
    </VStack>
  )
}
