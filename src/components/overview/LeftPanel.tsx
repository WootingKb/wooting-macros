import { AddIcon, SettingsIcon } from '@chakra-ui/icons'
import {
  Button,
  Divider,
  Input,
  Text,
  useColorModeValue,
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
import { borderRadiusStandard } from '../../theme/config'

interface Props {
  onOpenSettingsModal: () => void
}

type SearchBarProps = {
  searchValue: string
  changeSearchValue: (v: string) => void
  setDisplaySearchResults: (v: boolean) => void
}

function SearchBar({
  searchValue,
  changeSearchValue,
  setDisplaySearchResults
}: SearchBarProps) {
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    changeSearchValue(event.target.value.toLocaleLowerCase())
    if (event.target.value !== '') {
      setDisplaySearchResults(true)
    } else {
      setDisplaySearchResults(false)
    }
  }
  const cancelSearchButtonColour = useColorModeValue('#A0AEC0', '#52525b')
  const borderColour = useColorModeValue(
    'primary-light.500',
    'primary-dark.500'
  )

  return (
    <Input
      type="search"
      maxW={['full']}
      maxH="32px"
      variant="brand"
      placeholder="Search"
      _placeholder={{ opacity: 1, color: borderColour }}
      sx={{
        '&::-webkit-search-cancel-button': {
          WebkitAppearance: 'none',
          display: 'inline-block',
          width: '16px',
          height: '16px',
          background: `linear-gradient(45deg, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 43%,${cancelSearchButtonColour} 45%,${cancelSearchButtonColour} 55%,rgba(0,0,0,0) 57%,rgba(0,0,0,0) 100%), linear-gradient(135deg, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 43%,${cancelSearchButtonColour} 45%,${cancelSearchButtonColour} 55%,rgba(0,0,0,0) 57%,rgba(0,0,0,0) 100%)`,
          cursor: 'pointer'
        }
      }}
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
    setSearchValue,
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
          <Text w="full" fontWeight="bold" fontSize="28px">
            Collections
          </Text>

          <SearchBar
            searchValue={searchValue}
            changeSearchValue={setSearchValue}
            setDisplaySearchResults={setDisplaySearchResults}
          />
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
          {!displaySearchResults && (
            <Button
              rounded={borderRadiusStandard}
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
          colorScheme={isMacroOutputEnabled ? 'green' : 'red'}
          size="sm"
          onClick={() => {
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
