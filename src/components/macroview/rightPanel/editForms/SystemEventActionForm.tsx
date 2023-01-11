import { useMemo } from 'react'
import { SystemAction } from '../../../../types'
import ClipboardForm from './ClipboardForm'
import EmptyForm from './EmptyForm'
import OpenEventForm from './OpenEventForm'
import ScreenBrightnessForm from './ScreenBrightnessForm'
import VolumeControlForm from './VolumeControlForm'

interface Props {
  item: SystemAction
  selectedElementId: number
}

export default function SystemEventActionForm({ item, selectedElementId }: Props) {
  const SelectedElementFormComponent = useMemo(() => {
    switch (item.type) {
      case 'Open':
        return <OpenEventForm selectedElementId={selectedElementId}/>
      case 'Volume':
        return <EmptyForm />
      case 'Clipboard':
        if (item.action.type === 'PasteUserDefinedString') {
          return <ClipboardForm selectedElementId={selectedElementId}/>
        } else {
          return <EmptyForm />
        }
      case 'Brightness':
        return <ScreenBrightnessForm />
      default:
        return <EmptyForm />
    }
  }, [item.action.type, item.type, selectedElementId])
  return SelectedElementFormComponent
}
