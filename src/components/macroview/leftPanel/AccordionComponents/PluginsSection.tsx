import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AspectRatio,
  Flex,
  Grid,
  GridItem
} from '@chakra-ui/react'
import { PluginGroup } from '../../../../constants/enums'
import { PluginEventInfo } from '../../../../constants/PluginsEventMap'
import SelectElementButton from '../SelectElementButton'

interface Props {
  pluginGroupElements: (pluginGroup: string) => PluginEventInfo[]
}

export default function PluginsSection({ pluginGroupElements }: Props) {
  return (
    <>
      {Object.keys(PluginGroup)
        .filter((key) => isNaN(Number(key)))
        .map(
          (pluginGroup: string) =>
            pluginGroupElements(pluginGroup).length > 0 && (
              <AccordionItem key={pluginGroup}>
                <h2>
                  <AccordionButton>
                    <Flex
                      as="span"
                      flex="1"
                      textAlign="left"
                      fontWeight={'semibold'}
                      alignItems="center"
                      gap={2}
                    >
                      {/** TODO: Include Plugin Icon */}
                      {pluginGroup}
                    </Flex>
                    <AccordionIcon boxSize={6} />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <Grid
                    w="full"
                    h="fit"
                    px={4}
                    templateColumns={{
                      base: 'repeat(1, 1fr)',
                      md: 'repeat(2, 1fr)',
                      xl: 'repeat(3, 1fr)'
                    }}
                    gap={2}
                  >
                    {pluginGroupElements(pluginGroup).map(
                      (pluginEventInfo: PluginEventInfo) => (
                        <GridItem key={pluginEventInfo.subtype}>
                          <AspectRatio h="full" ratio={2 / 1}>
                            <SelectElementButton
                              displayText={pluginEventInfo.displayString}
                              properties={{
                                type: 'PhillipsHueEventAction',
                                data: undefined // pluginEventInfo.defaultData
                              }}
                            />
                          </AspectRatio>
                        </GridItem>
                      )
                    )}
                  </Grid>
                </AccordionPanel>
              </AccordionItem>
            )
        )}
    </>
  )
}
