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
import { useCallback } from 'react'
import useScrollbarStyles from '../../hooks/useScrollbarStyles'
import useMainBgColour from '../../hooks/useMainBgColour'
import useBorderColour from '../../hooks/useBorderColour'
import { error } from 'tauri-plugin-log'

interface Props {
  onOpenSettingsModal: () => void
}

function SearchBar() {
  const cancelSearchButtonColour = useColorModeValue('#A0AEC0', '#52525b')
  const borderColour = useColorModeValue(
    'primary-light.500',
    'primary-dark.500'
  )
  const { searchValue, setSearchValue } = useApplicationContext()

  return (
    <Input
      type="search"
      maxW={['full']}
      maxH="32px"
      variant="brand"
      placeholder="Search for a macro..."
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
      onChange={(event) => setSearchValue(event.target.value)}
    />
  )
}

export default function LeftPanel({ onOpenSettingsModal }: Props) {
  const {
    collections,
    selection,
    onCollectionAdd,
    onCollectionUpdate,
    changeSelectedCollectionIndex,
    isMacroOutputEnabled,
    changeMacroOutputEnabled,
    searchValue
  } = useApplicationContext()
  const [parent] = useAutoAnimate<HTMLDivElement>()
  const toast = useToast()

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

          <SearchBar />
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
          {searchValue.length === 0 &&
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
          {searchValue.length === 0 && (
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
