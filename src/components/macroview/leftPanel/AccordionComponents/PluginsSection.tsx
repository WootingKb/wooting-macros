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
import { PluginEventInfo } from '../../../../constants/PluginsEventMap'
import { PluginCategory } from '../../../../types'
import SelectElementButton from '../SelectElementButton'

interface Props {
  pluginCategories: PluginCategory[]
}

export default function PluginsSection({ pluginCategories }: Props) {
  return (
    <>
      {pluginCategories.map((plugin: PluginCategory) => (
        <AccordionItem key={plugin.name}>
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
                {plugin.name}
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
              {/* {plugin.elements.map((pluginEventInfo: PluginEventInfo) => (
                <GridItem key={pluginEventInfo.subtype}>
                  <AspectRatio h="full" ratio={2 / 1}>
                    <SelectElementButton
                      displayText={pluginEventInfo.displayString}
                      properties={{
                        type: '',
                        data: undefined // pluginEventInfo.defaultData
                      }}
                    />
                  </AspectRatio>
                </GridItem>
              ))} */}
            </Grid>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </>
  )
}
