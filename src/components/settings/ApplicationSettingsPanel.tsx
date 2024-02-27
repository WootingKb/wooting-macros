import { Divider, Text, VStack } from '@chakra-ui/react'
import NumberInputSetting from './NumberInputSetting'
import ToggleSetting from './ToggleSetting'
import { useSettingsContext } from '../../contexts/settingsContext'

export default function ApplicationSettingsPanel() {
  const {
    config,
    updateLaunchOnStartup,
    updateMinimizeOnStartup,
    updateMinimizeOnClose,
    updateAutoAddDelay,
    updateDefaultDelayVal,
    updateDefaultElementDurationVal,
    updateAutoSelectElement
  } = useSettingsContext()

  return (
    <VStack w="full" spacing="4">
      <VStack w="full">
        <Text w="full" textStyle="miniHeader">
          Window Settings
        </Text>
      </VStack>
      <VStack w="full" spacing={[4]}>
        <ToggleSetting
          title="Launch on startup"
          description="The app will open during your computer's startup phase."
          value={config.AutoStart}
          onChange={updateLaunchOnStartup}
        />
        <Divider />
        <ToggleSetting
          title="Minimize on startup"
          description="The app will open quietly in the background on startup. Requires 'Launch on Startup' to be enabled."
          value={config.MinimizeAtLaunch}
          onChange={updateMinimizeOnStartup}
          didDependencyCheckFail={!config.AutoStart}
        />
        <Divider />
        <ToggleSetting
          title="Minimize on close"
          description="Pressing X will minimize the app instead of closing it."
          value={config.MinimizeToTray}
          onChange={updateMinimizeOnClose}
        />
        <Divider />
      </VStack>
      <VStack w="full">
        <Text w="full" textStyle="miniHeader">
          Delay Settings
        </Text>
      </VStack>
      <VStack w="full" spacing={[4]}>
        <ToggleSetting
          title="Auto-add Delay"
          description="When enabled, a delay element is automatically added to the sequence, if the last element of the sequence is not a delay."
          value={config.AutoAddDelay}
          onChange={updateAutoAddDelay}
        />
        <Divider />
        <NumberInputSetting
          title="Default Delay Value"
          description="The value (in ms) that all Delay elements will default to when added to the sequence."
          defaultValue={config.DefaultDelayValue}
          onChange={updateDefaultDelayVal}
          minimum={1}
          maximum={20000}
        />
        <Divider />
        <NumberInputSetting
          title="Default Element Duration Value"
          description="The duration (in ms) that all elements other than Delay will default to when added to the sequence."
          defaultValue={config.DefaultElementDurationValue}
          onChange={updateDefaultElementDurationVal}
          minimum={20}
          maximum={20000}
        />
        <Divider />
      </VStack>
      <VStack w="full">
        <Text w="full" textStyle="miniHeader">
          Macro Creation Settings
        </Text>
      </VStack>
      <VStack w="full" spacing={[4]}>
        <ToggleSetting
          title="Auto-select Element on Add"
          description="When enabled, adding a new element automatically selects it for Editing (if applicable), rendering related options in the Edit Panel."
          value={config.AutoSelectElement}
          onChange={updateAutoSelectElement}
        />
        <Divider />
      </VStack>
    </VStack>
  )
}
