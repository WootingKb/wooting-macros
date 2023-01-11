import {
  Accordion,
  Flex,
  Text,
  Divider,
  useColorModeValue
} from '@chakra-ui/react'
import { useCallback, useMemo } from 'react'
import {
  scrollbarsStylesDark,
  scrollbarStylesLight
} from '../../../../constants/utils'
import { HIDCategory, PluginGroup } from '../../../../constants/enums'
import { Hid } from '../../../../constants/HIDmap'
import { SystemEvent } from '../../../../constants/SystemEventMap'
import MouseButtonsSection from './MouseButtonsSection'
import SystemEventsSection from './SystemEventsSection'
import { MouseInput } from '../../../../constants/MouseMap'
import KeyboardKeysSection from './KeyboardKeysSection'
import PluginsSection from './PluginsSection'
import { Plugin } from '../../../../constants/PluginsEventMap'

interface Props {
  searchValue: string
}

export default function SelectAreaAccordion({ searchValue }: Props) {
  const scrollbarStyles = useColorModeValue(
    scrollbarStylesLight,
    scrollbarsStylesDark
  )

  const systemEventElements = useMemo(() => {
    if (searchValue.trim() === '') {
      return SystemEvent.all
    }
    return SystemEvent.all.filter((element) =>
      element.displayString.toLowerCase().includes(searchValue)
    )
  }, [searchValue])

  const keyboardKeyElements = useCallback(
    (categoryName: string) => {
      if (searchValue.trim() === '') {
        return Hid.all.filter(
          (element) => HIDCategory[element.category] === categoryName
        )
      }
      return Hid.all.filter(
        (element) =>
          HIDCategory[element.category] === categoryName &&
          element.displayString.toLowerCase().includes(searchValue)
      )
    },
    [searchValue]
  )

  // const pluginElements = useCallback(
  //   (pluginGroup: string) => {
  //     if (searchValue.trim() === '') {
  //       return Plugin.all.filter(
  //         (element) => PluginGroup[element.pluginGroup] === pluginGroup
  //       )
  //     }
  //     return Plugin.all.filter(
  //       (element) =>
  //         PluginGroup[element.pluginGroup] === pluginGroup &&
  //         element.displayString.toLowerCase().includes(searchValue)
  //     )
  //   },
  //   [searchValue]
  // )

  const mouseElements = useMemo(() => {
    if (searchValue.trim() === '') {
      return MouseInput.all
    }
    return MouseInput.all.filter((element) =>
      element.displayString.toLowerCase().includes(searchValue)
    )
  }, [searchValue])

  const indices = useMemo(() => {
    if (searchValue.trim() === '') {
      return undefined
    }

    let count = 0

    if (systemEventElements.length > 0) {
      count++
    }

    const keyboardKeyCategories = Object.keys(HIDCategory).filter((key) =>
      isNaN(Number(key))
    )

    for (let i = 0; i < keyboardKeyCategories.length; i++) {
      const categoryName = keyboardKeyCategories[i]
      if (keyboardKeyElements(categoryName).length > 0) {
        count++
      }
    }
    // const pluginGroups = Object.keys(PluginGroup).filter((key) =>
    //   isNaN(Number(key))
    // )

    // for (let i = 0; i < pluginGroups.length; i++) {
    //   const pluginGroupName = pluginGroups[i]
    //   if (pluginElements(pluginGroupName).length > 0) {
    //     count++
    //   }
    // }
    if (mouseElements.length > 0) {
      count++
    }
    return [...Array(count).keys()]
  }, [
    keyboardKeyElements,
    // pluginElements,
    searchValue,
    mouseElements.length,
    systemEventElements.length
  ])

  const isValidSearch = useMemo(() => {
    return indices !== undefined && indices.length === 0
  }, [indices])

  return (
    <Flex
      direction="column"
      w="full"
      h="fit"
      overflowY="auto"
      alignItems={isValidSearch ? 'center' : 'flex-start'}
      sx={scrollbarStyles}
    >
      {isValidSearch && searchValue !== '' && (
        <>
          <Divider />
          <Text mt={4} fontWeight="semibold">
            Nothing found, try another query.
          </Text>
        </>
      )}
      <Accordion w="full" variant="brand" allowMultiple p={0} index={indices}>
        {systemEventElements.length > 0 && (
          <SystemEventsSection elementsToRender={systemEventElements} />
        )}
        <KeyboardKeysSection keyboardKeyElements={keyboardKeyElements} />
        {mouseElements.length > 0 && (
          <MouseButtonsSection elementsToRender={mouseElements} />
        )}
        {/* <PluginsSection pluginGroupElements={pluginElements} /> */}
      </Accordion>
    </Flex>
  )
}
