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
    'primary-accent.800',
    'primary-accent.300'
  )
  return (
    <VStack w="full" spacing={4}>
      <Text w="full" fontWeight="bold" fontSize="sm">
        December 21st, 2023, v. 1.1
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
              New UI.&nbsp;
            </Text>
            New, smoother UI with animations and nicer colors.
          </ListItem>
          <ListItem>
            <Text
              as="span"
              fontFamily="Montserrat"
              textColor={highlightedTextColour}
            >
              Macro search.&nbsp;
            </Text>
            You can now search your macros from the main window across all
            collections.
          </ListItem>
          <ListItem>
            <Text
              as="span"
              fontFamily="Montserrat"
              textColor={highlightedTextColour}
            >
              Security updates and bugfixes.&nbsp;
            </Text>
            We made sure the app is more secure than ever. Now you can also use
            any layout for a trigger key.
          </ListItem>
          <ListItem>
            <Text
              as="span"
              fontFamily="Montserrat"
              textColor={highlightedTextColour}
            >
              Gaming.&nbsp;
            </Text>
            Macros now work in games! However, we don't support nor endorse
            their use in multiplayer games, using them in such context is at
            your own risk!
          </ListItem>
          <ListItem>
            <Text
              as="span"
              fontFamily="Montserrat"
              textColor={highlightedTextColour}
            >
              Keycombos.&nbsp;
            </Text>
            Key combos should now work properly, so you can now do the
            CTRL+SHIFT+KEY combos you always wanted.
          </ListItem>
        </UnorderedList>
      </VStack>
    </VStack>
  )
}
