import { VStack, HStack, Text, Button, Divider } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { useEffect, useState } from 'react'
import { ActionEventType } from '../types'
import SequenceElementDraggableDisplay from './SequenceElementDraggableDisplay'

type Props = {
  sequenceList: ActionEventType[]
  onSequenceChange: (newList: ActionEventType[]) => void
}

const MacroviewSequencingArea = ({sequenceList, onSequenceChange}: Props) => {

  // TODO: add context so that MacroviewSequenceElementArea, MacroviewSequencingArea, and MacroviewEditArea share the same "list of sequence elements, with IDs"


  // only needs sequenceList to populate a separate list of items, so that we have IDs
  const [items, setItems] = useState<{ id:number, element: ActionEventType }[]>([])

  useEffect(() => {
    // take sequence list and populate new list with IDs
    console.log("refreshed")
    let temp: { id:number, element: ActionEventType }[] = []
    for (let i = 0; i < sequenceList.length; i++) {
      const sequenceElement = sequenceList[i];
      temp.push({id: i, element:sequenceElement})
    }
    setItems(temp)
  }, [])

  const handleDrag = (event:any) => {
    if (event.active.id !== event.over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === event.active.id)
        const newIndex = items.findIndex(item => item.id === event.over.id)
  
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <VStack w="41%" h="full" p="4px">
      {/** Header */}
      <HStack justifyContent="space-around" w="100%">
        <Text fontWeight="semibold" fontSize="xl">Sequence</Text>
        <Button leftIcon={<EditIcon />}>Record</Button>
        <Button leftIcon={<EditIcon />}>Add Delay</Button>
      </HStack>
      <Divider />
      {/** Timeline */}
      <DndContext
        onDragEnd={handleDrag}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
          <VStack w="100%" overflowY="auto" overflowX="hidden">
            {items.map((item:any, index:number) =>
              <SequenceElementDraggableDisplay elementID={item.id} properties={item.element} key={index} />
            )}
          </VStack>
        </SortableContext>
      </DndContext>
    </VStack>
  )
}

export default MacroviewSequencingArea