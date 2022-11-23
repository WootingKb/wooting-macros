import { AddIcon } from '@chakra-ui/icons'
import { Button, Flex, Grid, GridItem } from '@chakra-ui/react'
import { useState } from 'react'
import { useApplicationContext } from '../../contexts/applicationContext'
import { useSelectedCollection } from '../../contexts/selectors'
import { ViewState } from '../../enums'
import { Collection, Macro } from '../../types'
import { updateBackendConfig } from '../../utils'
import FadeInWrapper from '../FadeInWrapper'
import MacroCard from './MacroCard'

const MacroList = () => {
  const { collections, selection, changeViewState } = useApplicationContext()
  const currentCollection: Collection = useSelectedCollection()
  const [temp, setTemp] = useState(false)

  const onMacroDelete = (macroIndex: number) => {
    collections[selection.collectionIndex].macros.splice(macroIndex, 1)
    setTemp(!temp)
    updateBackendConfig(collections)
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
        <Flex minH="100px" justifyContent="center" alignItems="center">
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

export default MacroList
