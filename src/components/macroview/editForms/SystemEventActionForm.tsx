import { useMemo } from 'react'
import { SystemAction } from '../../../types'
import ClipboardForm from './ClipboardForm'
import EmptyForm from './EmptyForm'
import OpenEventForm from './OpenEventForm'
import ScreenBrightnessForm from './ScreenBrightnessForm'
import VolumeControlForm from './VolumeControlForm'

export default function SystemEventActionForm({
  item
}: {
  item: SystemAction
}) {
  const SelectedElementFormComponent = useMemo(() => {
    switch (item.type) {
      case 'Open':
        return <OpenEventForm />
      case 'Volume':
        return <VolumeControlForm />
      case 'Clipboard':
        return <ClipboardForm />
      case 'Brightness':
        return <ScreenBrightnessForm />
      default:
        return <EmptyForm />
    }
  }, [item.type])
  return SelectedElementFormComponent
}
