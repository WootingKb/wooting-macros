import {
  Button,
  Flex,
  Text,
  Switch,
  Divider,
  VStack,
  Kbd,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Box,
  HStack,
  Tooltip
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { Macro } from '../../types'
import { HIDLookup } from '../../constants/HIDmap'
import { useApplicationContext } from '../../contexts/applicationContext'
import { useSelectedCollection } from '../../contexts/selectors'
import { mouseEnumLookup } from '../../constants/MouseMap'
import { useCallback } from 'react'
import { KebabVertical } from '../icons'

type Props = {
  macro: Macro
  index: number
  onDelete: (index: number) => void
}

export default function MacroCard({ macro, index, onDelete }: Props) {
  const { selection, onCollectionUpdate, changeSelectedMacroIndex } =
    useApplicationContext()
  const currentCollection = useSelectedCollection()
  const bg = useColorModeValue('bg-light', 'primary-dark.900')
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

  const onToggle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newCollection = { ...currentCollection }
      newCollection.macros[index].active = event.target.checked
      onCollectionUpdate(newCollection, selection.collectionIndex)
    },
    [currentCollection, index, onCollectionUpdate, selection.collectionIndex]
  )

  const onDuplicate = useCallback(() => {
    const newCollection = { ...currentCollection }
    newCollection.macros.push(macro)
    onCollectionUpdate(newCollection, selection.collectionIndex)
  }, [currentCollection, macro, onCollectionUpdate, selection.collectionIndex])

  return (
    <VStack
      w="full"
      h="full"
      bg={bg}
      boxShadow={shadowColour}
      rounded="2xl"
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
            opacity={macro.active ? 1 : 0.5}
          >
            <em-emoji shortcodes={macro.icon} size="32px" />
          </Box>
          <Text
            textStyle="name"
            fontWeight="semibold"
            fontSize="2xl"
            opacity={macro.active ? 1 : 0.5}
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
          <MenuList p="2" right={0}>
            <MenuItem onClick={onDuplicate}>Duplicate</MenuItem>
            {/* <MenuItem isDisabled>Move to Collection</MenuItem> */}
            {/* <MenuItem isDisabled>Export</MenuItem> */}
            <Divider />
            <MenuItem onClick={() => onDelete(index)} textColor="red.500">
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
      {/** Trigger Keys Display */}
      <VStack w="full" spacing={1} opacity={macro.active ? 1 : 0.5}>
        <Text fontSize="sm" color={subtextColour} alignSelf="self-start">
          Trigger Keys:
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
              <Kbd variant="brand" key={HIDcode}>
                {HIDLookup.get(HIDcode)?.displayString}
              </Kbd>
            ))}
          {macro.trigger.type === 'MouseEvent' && (
            <Box>{mouseEnumLookup.get(macro.trigger.data)?.displayString}</Box>
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
          aria-label="Toggle Macro Switch description"
          label={
            currentCollection.active
              ? macro.active
                ? 'Disable Macro'
                : 'Enable Macro'
              : 'Re-enable Collection!'
          }
        >
          <Box>
            <Switch
              variant="brand"
              defaultChecked={macro.active}
              isChecked={currentCollection.active ? macro.active : false}
              isDisabled={!currentCollection.active}
              onChange={onToggle}
            />
          </Box>
        </Tooltip>
      </Flex>
    </VStack>
  )
}
