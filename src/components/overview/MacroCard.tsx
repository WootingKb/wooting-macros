import {
  Button,
  Flex,
  Text,
  IconButton,
  Switch,
  Divider,
  VStack,
  Kbd,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { Keypress, Macro } from '../../types'
import { BaseSyntheticEvent } from 'react'
import { HIDLookup } from '../../HIDmap'
import { updateBackendConfig } from '../../utils'
import { useApplicationContext } from '../../contexts/applicationContext'
import { ViewState } from '../../enums'

type Props = {
  macro: Macro
  index: number
  onDelete: (index: number) => void
}

function MacroCard({ macro, index, onDelete }: Props) {
  const { collections, changeSelectedMacroIndex, changeViewState } =
    useApplicationContext()

  const onToggle = (event: BaseSyntheticEvent) => {
    macro.active = event.target.checked
    // update backend
    updateBackendConfig(collections)
  }

  return (
    <VStack w="100%" border="1px" rounded="md" p="3" m="auto" spacing="8px">
      {/** Top Row */}
      <Flex w="100%" justifyContent="space-between">
        <Flex w="100%" gap="8px">
          {/** Kebab Menu Icon needs to be changed later */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            width="24px"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
            />
          </svg>
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
                viewBox="0 0 20 20"
                strokeWidth="1.5"
                stroke="currentColor"
                width="24px"
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
          <MenuList>
            <MenuItem onClick={() => onDelete(index)}>Delete</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      {/** Trigger Keys Display */}
      <Text fontSize="sm" color="gray.600" alignSelf="self-start">
        Trigger Keys:
      </Text>
      <Flex w="100%" gap="4px">
        {macro.trigger.data.map((key: Keypress, index: number) => (
          <Kbd key={index}>{HIDLookup.get(key.keypress)?.displayString}</Kbd>
        ))}
      </Flex>
      <Divider />
      {/** Buttons */}
      <Flex w="100%" alignItems="center" justifyContent="space-between">
        <Button
          size="sm"
          leftIcon={<EditIcon />}
          onClick={() => {
            changeSelectedMacroIndex(index)
            changeViewState(ViewState.Editview)
          }}
        >
          Edit
        </Button>
        <Switch defaultChecked={macro.active} onChange={onToggle} />
      </Flex>
    </VStack>
  )
}

export default MacroCard