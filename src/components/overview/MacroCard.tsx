import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Kbd,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
  Text,
  Tooltip,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { Macro } from '../../types'
import { HIDLookup } from '../../constants/HIDmap'
import { useApplicationContext } from '../../contexts/applicationContext'
import { useSelectedCollection } from '../../contexts/selectors'
import { mouseEnumLookup } from '../../constants/MouseMap'
import { useCallback, useMemo } from 'react'
import { KebabVertical } from '../icons'
import useMainBgColour from '../../hooks/useMainBgColour'

interface Props {
  macro: Macro
  index: number
  onDelete: (index: number) => void
  collectionName?: string
  searchValue: string
}

export default function MacroCard({
  macro,
  index,
  onDelete,
  collectionName,
  searchValue
}: Props) {
  const { selection, onCollectionUpdate, changeSelectedMacroIndex } =
    useApplicationContext()
  const currentCollection = useSelectedCollection()
  const secondBg = useColorModeValue('blue.50', 'gray.800')
  const shadowColour = useColorModeValue('md', 'white-md')
  const subtextColour = useColorModeValue(
    'primary-light.600',
    'primary-dark.400'
  )
  const kebabColour = useColorModeValue('primary-light.500', 'primary-dark.500')
  const kebabHoverColour = useColorModeValue(
    'primary-light.900',
    'primary-dark.400'
  )
  const deleteTextColour = useColorModeValue('red.600', 'red.200')

  const onToggle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newCollection = { ...currentCollection }
      newCollection.macros[index].enabled = event.target.checked
      onCollectionUpdate(newCollection, selection.collectionIndex)
    },
    [currentCollection, index, onCollectionUpdate, selection.collectionIndex]
  )

  const onDuplicate = useCallback(() => {
    const newCollection = { ...currentCollection }
    newCollection.macros.push(macro)
    onCollectionUpdate(newCollection, selection.collectionIndex)
  }, [currentCollection, macro, onCollectionUpdate, selection.collectionIndex])

  const isSearching: boolean = useMemo((): boolean => {
    return searchValue.length !== 0
  }, [searchValue])

  return (
    <VStack
      w="full"
      h="full"
      bg={useMainBgColour()}
      boxShadow={shadowColour}
      rounded="md"
      p={5}
      m="auto"
      justifyContent="space-between"
      spacing={4}
    >
      {/** Top Row */}
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="flex-end"
        spacing={0}
      >
        <Flex w="full" gap={2} alignItems="center">
          <Box
            maxHeight="32px"
            cursor="default"
            opacity={macro.enabled ? 1 : 0.5}
          >
            <em-emoji shortcodes={macro.icon} size="32px" />
          </Box>
          <Text
            textStyle="name"
            fontWeight="semibold"
            fontSize="2xl"
            opacity={macro.enabled ? 1 : 0.5}
          >
            {macro.name}
          </Text>
        </Flex>
        <Menu variant="brand">
          <MenuButton
            h="24px"
            aria-label="macro options"
            color={kebabColour}
            _hover={{ color: kebabHoverColour }}
          >
            <KebabVertical />
          </MenuButton>
          <MenuList p="2" right={0} position="relative">
            <MenuItem onClick={onDuplicate}>Duplicate</MenuItem>
            {/* <MenuItem isDisabled>Move to Collection</MenuItem> */}
            {/* <MenuItem isDisabled>Export</MenuItem> */}
            <Divider />
            <MenuItem
              onClick={() => onDelete(index)}
              textColor={deleteTextColour}
            >
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
      {/** Trigger Keys Display */}
      <VStack w="full" spacing={1} opacity={macro.active ? 1 : 0.5}>
        {isSearching && (
          <HStack alignSelf="flex-start">
            <Text fontSize="sm" fontWeight="thin" color={subtextColour}>
              {collectionName}
            </Text>
          </HStack>
        )}
        <Text fontSize="sm" color={subtextColour} alignSelf="self-start">
          Trigger Keys
        </Text>
        <Flex
          w="full"
          gap="4px"
          bg={secondBg}
          rounded="md"
          p="9px"
          shadow="inner"
        >
          {macro.trigger.type === 'KeyPressEvent' &&
            macro.trigger.data.map((HIDcode) => (
              <Kbd fontSize="md" variant="brand" key={HIDcode}>
                {HIDLookup.get(HIDcode)?.displayString}
              </Kbd>
            ))}
          {macro.trigger.type === 'MouseEvent' && (
            <Kbd fontSize="md" variant="brand">
              {mouseEnumLookup.get(macro.trigger.data)?.displayString}
            </Kbd>
          )}
        </Flex>
      </VStack>
      {/** Buttons */}
      <Flex w="full" alignItems="center" justifyContent="space-between">
        <Button
          size="sm"
          variant="yellowGradient"
          leftIcon={<EditIcon />}
          onClick={() => {
            changeSelectedMacroIndex(index)
          }}
        >
          Edit
        </Button>
        <Tooltip
          variant="brand"
          placement="bottom"
          hasArrow
          label={
            currentCollection.enabled
              ? macro.enabled
                ? 'Disable Macro'
                : 'Enable Macro'
              : 'Re-enable Collection!'
          }
        >
          <Box>
            <Switch
              variant="brand"
              defaultChecked={macro.enabled}
              isChecked={currentCollection.enabled ? macro.enabled : false}
              isDisabled={!currentCollection.enabled}
              aria-label="Macro Toggle"
              onChange={onToggle}
            />
          </Box>
        </Tooltip>
      </Flex>
    </VStack>
  )
}
