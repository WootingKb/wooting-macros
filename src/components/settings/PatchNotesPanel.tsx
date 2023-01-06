import {
  Heading,
  ListItem,
  Text,
  UnorderedList,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'

export default function PatchNotesPanel() {
  const whatsNewTextColour = useColorModeValue('green.600', 'green.400')
  const textColour = useColorModeValue('bg-dark', 'bg-light')
  return (
    <VStack w="full" spacing={4}>
      <Text w="full" fontWeight="bold" fontSize="sm">
        January 10th, 2023
      </Text>
      <VStack w="full" spacing={0}>
        <Heading w="full" size="lg" textColor={whatsNewTextColour}>
          What's New
        </Heading>
        <UnorderedList
          w="full"
          px="8"
          spacing={2}
          textColor={textColour}
          fontWeight="semibold"
        >
          <ListItem>
            <span style={{ fontFamily: 'Montserrat' }}>
              Macros: Create a sequence of actions that can be triggered by
              specific keyboard keys or a single mouse button.&nbsp;
            </span>
            You can add keypresses, system events, and some other actions. You may also optionally set a name and an icon, and delete it later.
          </ListItem>
          <ListItem>
            <span style={{ fontFamily: 'Montserrat' }}>
              Collections: Create groups of macros that can be easily toggled
              on/off as a group.&nbsp;
            </span>
            You can optionally set a name and an icon for the collection. And if you end up
            not wanting it, you can delete later.
          </ListItem>
          <ListItem>
            <span style={{ fontFamily: 'Montserrat' }}>
              Settings: Adjust how the application behaves.&nbsp;
            </span>
            You can adjust some window settings, as well as some functionality
            settings that affect your experience creating a macro.
          </ListItem>
          <ListItem>
            <span style={{ fontFamily: 'Montserrat' }}>
              Appearance: Blind your eyes, or don't.&nbsp;
            </span>
            You can select between one of two colour modes, light and dark.
          </ListItem>
          <ListItem>
            <span style={{ fontFamily: 'Montserrat' }}>
              Toggle on/off: Enable and disable individual macros, collections,
              or the entire app without closing it.&nbsp;
            </span>
            If you find yourself in a situation where you'd like to disable one
            or more macros, you can easily toggle them off.
          </ListItem>
        </UnorderedList>
      </VStack>
    </VStack>
  )
}
