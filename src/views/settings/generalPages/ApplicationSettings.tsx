import { Divider, Text, VStack } from '@chakra-ui/react'
import { Fragment } from 'react'
import NumberInputSetting from '../../../components/settings/NumberInputSetting'
import ToggleSetting from '../../../components/settings/ToggleSetting'
import { applicationSettings } from '../../../constants/applicationSettings'

export default function ApplicationSettings() {
  
  return (
    <VStack spacing="4">
      {applicationSettings.map((subcategory) => (
        <VStack key={subcategory.name}>
          <Text w="100%" textStyle="settingsCategoryHeader">
            {subcategory.name}
          </Text>
          <VStack w="100%" spacing={[4]}>
            {subcategory.settings.map((setting) => (
              <Fragment key={setting.name}>
                {setting.type === "toggle" && <ToggleSetting
                  title={setting.name}
                  description={setting.desc}
                />}
                {setting.type === "numberInput" && <NumberInputSetting
                  title={setting.name}
                  description={setting.desc}
                />}
                <Divider />
              </Fragment>
            ))}
          </VStack>
        </VStack>
      ))}
    </VStack>
  )
}
