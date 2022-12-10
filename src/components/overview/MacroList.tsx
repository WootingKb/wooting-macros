import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Grid, GridItem } from '@chakra-ui/react'
import { useCallback } from 'react'
import { useApplicationContext } from '../../contexts/applicationContext'
import { useSelectedCollection } from '../../contexts/selectors'
import { ViewState } from '../../enums'
import { Collection, Macro } from '../../types'
import MacroCard from './MacroCard'

export default function MacroList() {
  const { selection, onCollectionUpdate, changeViewState } =
    useApplicationContext()
  const currentCollection: Collection = useSelectedCollection()

  const onMacroDelete = useCallback((macroIndex: number) => {
    const newCollection = { ...currentCollection }
    newCollection.macros = newCollection.macros.filter(
      (_, i) => i !== macroIndex
    )
    onCollectionUpdate(newCollection, selection.collectionIndex)
  }, [currentCollection, onCollectionUpdate, selection.collectionIndex])

  return (
    <Box
      w="100%"
      h="100%"
      p="2"
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': {
          width: '10px'
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '10px'
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '10px'
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555',
          borderRadius: '10px'
        }
      }}
    >
      {currentCollection.macros.length === 0 ? (
        <Flex h="100%" justifyContent="center" alignItems="center">
          <Button
            colorScheme="yellow"
            leftIcon={<AddIcon />}
            size={['sm', 'md', 'lg']}
            maxW="50%"
            onClick={() => changeViewState(ViewState.Addview)}
            _hover={{ transform: 'scale(110%)' }}
          >
            Add Macro
          </Button>
        </Flex>
      ) : (
        <Grid
          w="100%"
          templateColumns={['repeat(2, 1fr)', 'repeat(3, 1fr)']}
          gap="2"
        >
          <Flex h="163px" justifyContent="center" alignItems="center">
            <Button
              colorScheme="yellow"
              leftIcon={<AddIcon />}
              size={['sm', 'md', 'lg']}
              maxW="50%"
              onClick={() => changeViewState(ViewState.Addview)}
              _hover={{ transform: 'scale(110%)' }}
            >
              Add Macro
            </Button>
          </Flex>
          {currentCollection.macros.map((macro: Macro, index: number) => (
            <GridItem w="100%" h="163px" key={`${index}:${macro.name}`}>
              <MacroCard macro={macro} index={index} onDelete={onMacroDelete} />
            </GridItem>
          ))}
        </Grid>
      )}
    </Box>
  )
}
