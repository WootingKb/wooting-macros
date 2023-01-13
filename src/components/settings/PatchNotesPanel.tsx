import {
  Heading,
  ListItem,
  Text,
  UnorderedList,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'

export default function PatchNotesPanel() {
  const whatsNewTextColour = useColorModeValue('green.600', 'green.300')
  const textColour = useColorModeValue('primary-light.900', 'primary-dark.100')
  const highlightedTextColour = useColorModeValue(
    'primary-accent.700',
    'primary-accent.300'
  )
  return (
    <VStack w="full" spacing={4}>
      <Text w="full" fontWeight="bold" fontSize="sm">
        January 16th, 2023
      </Text>
      <VStack w="full">
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
            <Text
              as="span"
              fontFamily="Montserrat"
              textColor={highlightedTextColour}
            >
              Perform keystrokes, open applications, folders, and websites,
              paste text with emojis, and more.&nbsp;
            </Text>
            Create simple macros that can be triggered by specific keyboard keys
            or a single mouse button. You can also optionally set a name and an
            icon, and/or delete it later.
          </ListItem>
          <ListItem>
            <Text
              as="span"
              fontFamily="Montserrat"
              textColor={highlightedTextColour}
            >
              Create groups of macros that can be easily toggled on/off as a
              group.&nbsp;
            </Text>
            Collections allow you to easily organize and manage your macros.
            Group by game, task, etc. You can optionally set a name and an icon
            for the collection, and/or delete it later.
          </ListItem>
          <ListItem>
            <Text
              as="span"
              fontFamily="Montserrat"
              textColor={highlightedTextColour}
            >
              Adjust how the application behaves.&nbsp;
            </Text>
            You can adjust some window settings, as well as some functionality
            settings that affect your experience creating a macro.
          </ListItem>
          <ListItem>
            <Text
              as="span"
              fontFamily="Montserrat"
              textColor={highlightedTextColour}
            >
              Blind your eyes, or don't.&nbsp;
            </Text>
            You can select between one of two themes, light and dark.&nbsp;
            <Text as="span" fontSize="2xs">
              Dark mode is better, definitely not biased...
            </Text>
          </ListItem>
          <ListItem>
            <Text
              as="span"
              fontFamily="Montserrat"
              textColor={highlightedTextColour}
            >
              Enable and disable individual macros, collections, or the entire
              app without closing it.&nbsp;
            </Text>
            If you find yourself in a situation where you'd like to turn off one
            or more macros, you have a breadth of options to choose from.
            <Text mt={3}>
              *Be aware that disabling Macro Output (aka the entire app), will
              not be enough if you plan on using the app and playing certain
              games. For peace of mind, when playing competitive games, it is
              recommended that you close the app.
            </Text>
          </ListItem>
        </UnorderedList>
      </VStack>
    </VStack>
  )
}
