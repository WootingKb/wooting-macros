import { AddIcon } from '@chakra-ui/icons'
import { Button, Flex, Grid, GridItem } from '@chakra-ui/react'
import { useApplicationContext } from '../../contexts/applicationContext'
import { useSelectedCollection } from '../../contexts/selectors'
import { ViewState } from '../../enums'
import { Collection, Macro } from '../../types'
import FadeInWrapper from '../FadeInWrapper'
import MacroCard from './MacroCard'

export default function MacroList() {
  const { selection, onCollectionUpdate, changeViewState } =
    useApplicationContext()
  const currentCollection: Collection = useSelectedCollection()

  const onMacroDelete = (macroIndex: number) => {
    const newCollection = { ...currentCollection }
    newCollection.macros = newCollection.macros.filter(
      (_, i) => i !== macroIndex
    )
    onCollectionUpdate(newCollection, selection.collectionIndex)
  }

  return (
    <FadeInWrapper transitionDuration={500}>
      <Grid
        w="100%"
        templateColumns={['repeat(2, 1fr)', 'repeat(3, 1fr)']}
        p="2"
        gap="2"
        overflowY="auto"
      >
        <Flex minH="163px" justifyContent="center" alignItems="center">
          <Button
            colorScheme="yellow"
            leftIcon={<AddIcon />}
            size={['sm', 'md', 'lg']}
            maxW="50%"
            onClick={() => changeViewState(ViewState.Addview)}
          >
            Add Macro
          </Button>
        </Flex>
        {currentCollection.macros.map((macro: Macro, index: number) => (
          <GridItem w="100%" key={`${index}:${macro.name}`}>
            <MacroCard macro={macro} index={index} onDelete={onMacroDelete} />
          </GridItem>
        ))}
      </Grid>
    </FadeInWrapper>
  )
}
