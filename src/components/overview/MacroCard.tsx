import {
  Button,
  Flex,
  Text,
  IconButton,
  Switch,
  Divider,
  VStack,
  Kbd,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Box,
  Circle
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { Macro } from '../../types'
import { HIDLookup } from '../../maps/HIDmap'
import { useApplicationContext } from '../../contexts/applicationContext'
import { useSelectedCollection } from '../../contexts/selectors'
import { mouseEnumLookup } from '../../maps/MouseMap'

type Props = {
  macro: Macro
  index: number
  onDelete: (index: number) => void
}

export default function MacroCard({ macro, index, onDelete }: Props) {
  const { selection, onCollectionUpdate, changeSelectedMacroIndex } =
    useApplicationContext()
  const currentCollection = useSelectedCollection()

  const subtextColour = useColorModeValue('gray.500', 'gray.400')
  const borderColour = useColorModeValue('gray.400', 'gray.600')
  const kebabColour = useColorModeValue('black', 'white')

  function onToggle(event: React.ChangeEvent<HTMLInputElement>) {
    const newCollection = { ...currentCollection }
    newCollection.macros[index].active = event.target.checked
    onCollectionUpdate(newCollection, selection.collectionIndex)
  }

  function onDuplicate() {
    const newCollection = { ...currentCollection }
    newCollection.macros.push(macro)
    onCollectionUpdate(newCollection, selection.collectionIndex)
  }

  return (
    <VStack
      w="100%"
      border="1px"
      borderColor={borderColour}
      rounded="md"
      p="3"
      m="auto"
      spacing="8px"
    >
      {/** Top Row */}
      <Flex w="100%" justifyContent="space-between">
        <Flex w="100%" gap="8px" alignItems="center">
          <Circle position="relative" role="group">
            <Image
              borderRadius="full"
              border="1px"
              borderColor={borderColour}
              src={macro.icon}
              fallbackSrc="https://via.placeholder.com/125"
              alt="Macro Icon"
              boxSize="25px"
              objectFit="cover"
            />
          </Circle>
          <Text fontWeight="semibold">{macro.name}</Text>
        </Flex>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Kebab Menu Button"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke={kebabColour}
                width={24}
                height={24}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                />
              </svg>
            }
            variant="link"
          ></MenuButton>
          <MenuList p="2">
            <MenuItem onClick={onDuplicate}>Duplicate</MenuItem>
            {/* <MenuItem isDisabled>Move to Collection</MenuItem> */}
            {/* <MenuItem isDisabled>Export</MenuItem> */}
            <Divider />
            <MenuItem onClick={() => onDelete(index)} textColor="red.500">
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      {/** Trigger Keys Display */}
      <Text fontSize="sm" color={subtextColour} alignSelf="self-start">
        Trigger Keys:
      </Text>
      <Flex w="100%" gap="4px">
        {macro.trigger.type === 'KeyPressEvent' &&
          macro.trigger.data.map((HIDcode) => (
            <Kbd key={HIDcode}>{HIDLookup.get(HIDcode)?.displayString}</Kbd>
          ))}
        {macro.trigger.type === 'MouseEvent' && (
          <Box>{mouseEnumLookup.get(macro.trigger.data)?.displayString}</Box>
        )}
      </Flex>
      <Divider borderColor={borderColour} />
      {/** Buttons */}
      <Flex w="100%" alignItems="center" justifyContent="space-between">
        <Button
          size="sm"
          leftIcon={<EditIcon />}
          onClick={() => {
            changeSelectedMacroIndex(index)
          }}
        >
          Edit
        </Button>
        <Switch defaultChecked={macro.active} onChange={onToggle} />
      </Flex>
    </VStack>
  )
}
