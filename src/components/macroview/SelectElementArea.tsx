import {
  Text,
  VStack,
  Input,
  Divider,
  useColorModeValue,
  HStack,
  IconButton,
  Stack,
  Tooltip,
  Icon,
} from '@chakra-ui/react'
import { IntegrationIcon, KeyboardIcon, MouseIcon, SystemIcon } from '../icons'
import { TfiLayoutGrid3Alt } from 'react-icons/Tfi'
import { useMemo, useState } from 'react'
import AllElementsGrid from './elementGrids/AllElementsGrid'
import KeyboardKeysGrid from './elementGrids/KeyboardKeysGrid'
import MouseButtonsGrid from './elementGrids/MouseButtonsGrid'
import SystemEventsGrid from './elementGrids/SystemEventsGrid'
import PluginsGrid from './elementGrids/PluginsGrid'

export default function SelectElementArea() {
  const [tabIndex, setTabIndex] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const iconColour = useColorModeValue('bg-dark', 'bg-light')
  const borderColour = useColorModeValue(
    'primary-light.500',
    'primary-dark.500'
  )
  const cancelSearchButtonColour = useColorModeValue('#A0AEC0', '#52525b')

  const ElementsToShow = useMemo(() => {
    switch (tabIndex) {
      case 0:
        return (
          <AllElementsGrid searchValue={searchValue}/>
        )
      case 1:
        return (
          <KeyboardKeysGrid searchValue={searchValue}/>
        )
      case 2:
        return (
          <MouseButtonsGrid searchValue={searchValue}/>
        )
      case 3:
        return (
          <SystemEventsGrid searchValue={searchValue}/>
        )
      case 4:
        return (
          <PluginsGrid searchValue={searchValue}/>
        )
      default:
        return <></>
    }
  }, [tabIndex, searchValue])

  return (
    <VStack
      w="33%"
      h="100%"
      p={[2, 4, 6]}
      alignItems="normal"
      borderRight="1px"
      borderColor={borderColour}
    >
      <Text fontWeight="semibold" fontSize={['sm', 'md']}>
        ELEMENTS
      </Text>
      <Stack
        direction={['column', 'column', 'row']}
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack>
          <Tooltip
            variant="brand"
            label="All Elements"
            aria-label="All elements category button"
            hasArrow
          >
            <IconButton
              variant={tabIndex === 0 ? 'brandSelected' : 'brandGhost'}
              aria-label="All Elements Tab"
              icon={
                <Icon
                  as={TfiLayoutGrid3Alt}
                  boxSize={5}
                  color={tabIndex === 0 ? 'bg-dark' : iconColour}
                />
              }
              onClick={() => setTabIndex(0)}
            />
          </Tooltip>
          <Tooltip
            variant="brand"
            label="Keyboard Keys"
            aria-label="Keyboard Keys category button"
            hasArrow
          >
            <IconButton
              variant={tabIndex === 1 ? 'brandSelected' : 'brandGhost'}
              aria-label="Keyboard Key Elements"
              icon={
                <KeyboardIcon color={tabIndex === 1 ? 'bg-dark' : iconColour} />
              }
              onClick={() => setTabIndex(1)}
            />
          </Tooltip>
          <Tooltip
            variant="brand"
            label="Mouse Buttons"
            aria-label="Mouse buttons category button"
            hasArrow
          >
            <IconButton
              variant={tabIndex === 2 ? 'brandSelected' : 'brandGhost'}
              aria-label="Mouse Button Elements"
              icon={
                <MouseIcon color={tabIndex === 2 ? 'bg-dark' : iconColour} />
              }
              onClick={() => setTabIndex(2)}
            />
          </Tooltip>
          <Tooltip
            variant="brand"
            label="System Events"
            aria-label="System events category button"
            hasArrow
          >
            <IconButton
              variant={tabIndex === 3 ? 'brandSelected' : 'brandGhost'}
              aria-label="System Event Elements"
              icon={
                <SystemIcon color={tabIndex === 3 ? 'bg-dark' : iconColour} />
              }
              onClick={() => setTabIndex(3)}
            />
          </Tooltip>
          <Tooltip
            variant="brand"
            label="Integrations"
            aria-label="Integrations category button"
            hasArrow
          >
            <IconButton
              variant={tabIndex === 4 ? 'brandSelected' : 'brandGhost'}
              aria-label="Integration Elements"
              icon={
                <IntegrationIcon
                  color={tabIndex === 4 ? 'bg-dark' : iconColour}
                />
              }
              onClick={() => setTabIndex(4)}
            />
          </Tooltip>
        </HStack>
        <Input
          type="search"
          maxW={['100%', '100%', '55%']}
          maxH="32px"
          variant="brand"
          placeholder="Search"
          _placeholder={{ opacity: 1, color: borderColour }}
          onChange={(event) => setSearchValue(event.target.value)}
          css={{
            '&::-webkit-search-cancel-button': {
              'WebkitAppearance': 'none',
              display: 'inline-block',
              width: '16px',
              height: '16px',
              background: `linear-gradient(45deg, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 43%,${cancelSearchButtonColour} 45%,${cancelSearchButtonColour} 55%,rgba(0,0,0,0) 57%,rgba(0,0,0,0) 100%), linear-gradient(135deg, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 43%,${cancelSearchButtonColour} 45%,${cancelSearchButtonColour} 55%,rgba(0,0,0,0) 57%,rgba(0,0,0,0) 100%)`,
              cursor: 'pointer'
            }
          }}
        />
      </Stack>
      <Divider />
      {ElementsToShow}
    </VStack>
  )
}
