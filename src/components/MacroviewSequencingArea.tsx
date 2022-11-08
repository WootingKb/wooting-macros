import { VStack, HStack, Text, Button, Divider } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { DndContext, useSensor, PointerSensor } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { useState } from 'react'
import Sortable from './Sortable'
import { ActionEventType } from '../types'

type Props = {
  sequenceList: ActionEventType[]
  onSequenceChange: (newList: ActionEventType[]) => void
}

const MacroviewSequencingArea = ({sequenceList, onSequenceChange}: Props) => {
  const [items, setItems] = useState([
    {
      id: "1",
      name: "sequence element 1"
    },
    {
      id: "2",
      name: "sequence element 2"
    },
    {
      id: "3",
      name: "sequence element 3"
    },
    {
      id: "4",
      name: "sequence element 4"
    },
  ])

  const sensors = [useSensor(PointerSensor)]

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
      <VStack>
        <DndContext
          sensors={sensors}
          onDragEnd={handleDrag}
        >
          <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
            {items.map((item:any, index:number) =>
              <Sortable id={item.id} text={item.name} key={index} />
            )}
          </SortableContext>
        </DndContext>

        {/**
         * needs to be a Scrollable, Sortable list
         * each sequence element can be moved around
         * each delay sequence elements can also be moved around
         * any non-delay sequence elements that are not separated by a delay are grouped together
         * groups can be moved as a whole, or individual elements can be pulled out of a group
         * there can be no delays within a group, all actions start at the same time (but not necessarily take the same amount of time)
         */}
      </VStack>
    </VStack>
  )
}

export default MacroviewSequencingArea