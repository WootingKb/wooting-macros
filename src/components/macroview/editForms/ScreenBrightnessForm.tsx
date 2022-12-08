import { Divider, Text, Input, Select } from '@chakra-ui/react'
import { invoke } from '@tauri-apps/api'
import { useState, useEffect } from 'react'
import { useMacroContext } from '../../../contexts/macroContext'
import { useSelectedElement } from '../../../contexts/selectors'
import { Monitor } from '../../../types'

export default function ScreenBrightnessForm() {
  const [brightnessVal, setBrightnessVal] = useState(75)
  const [monitors, setMonitors] = useState<Monitor[]>([])
  const [selectedMonitor, setSelectedMonitor] = useState('')
  const selectedElement = useSelectedElement()
  const { selectedElementId, updateElement } = useMacroContext()

  useEffect(() => {
    if (selectedElement === undefined) {
      return
    }

    if (selectedElement.type !== 'SystemEventAction') {
      return
    }
    if (selectedElement.data.type !== 'Brightness') {
      return
    }
    if (selectedElement.data.action.type !== 'Set') {
      return
    }
    invoke<Monitor[]>('get_monitor_data')
      .then((res) => {
        setMonitors(res)
      })
      .catch((e) => {
        console.error(e)
      })
    setBrightnessVal(selectedElement.data.action.level)
  }, [selectedElement])

  const onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedElement === undefined || selectedElementId === undefined) {
      return
    }
    if (selectedElement.type !== 'SystemEventAction') {
      return
    }

    const newValue = parseInt(event.target.value)
    if (newValue === undefined) {
      return
    }

    setBrightnessVal(newValue)
    const temp = { ...selectedElement }
    temp.data = {
      type: 'Brightness',
      action: { type: 'Set', level: newValue, name: selectedMonitor }
    }
    updateElement(temp, selectedElementId)
  }

  return (
    <>
      <Text fontWeight="semibold" fontSize={['sm', 'md']}>
        {'Set Screen Brightness'}
      </Text>
      <Divider />
      <Text fontSize={['xs', 'sm', 'md']}>Monitor</Text>
      <Select placeholder="Select Monitor" onChange={(event) => setSelectedMonitor(event.target.value)}>
        {monitors.map((monitor) => (
          <option value={monitor.name} key={monitor.name}>
            {monitor.name}
          </option>
        ))}
      </Select>
      <Text fontSize={['xs', 'sm', 'md']}>Brightness value</Text>
      <Input
        type="number"
        value={brightnessVal}
        onChange={onValueChange}
        placeholder="path"
      />
    </>
  )
}
