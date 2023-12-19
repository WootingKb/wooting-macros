import { useMemo } from 'react'
import { SystemEventAction } from '../../../../types'
import ClipboardForm from './ClipboardForm'
import EmptyForm from './EmptyForm'
import OpenEventForm from './OpenEventForm'

interface Props {
  selectedElement: SystemEventAction
  selectedElementId: number
}

export default function SystemEventActionForm({
  selectedElement,
  selectedElementId
}: Props) {
  return useMemo(() => {
    switch (selectedElement.data.type) {
      case 'Open':
        return (
          <OpenEventForm
            selectedElementId={selectedElementId}
            selectedElement={selectedElement}
          />
        )
      case 'Volume':
        return <EmptyForm />
      case 'Clipboard':
        if (selectedElement.data.action.type === 'PasteUserDefinedString') {
          return (
            <ClipboardForm
              selectedElementId={selectedElementId}
              selectedElement={selectedElement}
            />
          )
        } else {
          return <EmptyForm />
        }
      default:
        return <EmptyForm />
    }
  }, [selectedElement, selectedElementId])
}
