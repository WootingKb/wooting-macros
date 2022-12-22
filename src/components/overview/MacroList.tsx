import { AddIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'
import { useCallback } from 'react'
import { useApplicationContext } from '../../contexts/applicationContext'
import { useMacroContext } from '../../contexts/macroContext'
import { useSelectedCollection } from '../../contexts/selectors'
import { ViewState } from '../../enums'
import { Collection, Macro } from '../../types'
import MacroCard from './MacroCard'

export default function MacroList() {
  const { selection, onCollectionUpdate, changeViewState } =
    useApplicationContext()
  const { changeIsUpdatingMacro } = useMacroContext()
  const currentCollection: Collection = useSelectedCollection()
  const bg = useColorModeValue('primary-light.200', 'primary-dark.900')
  const shadowColour = useColorModeValue('md', 'white-md')

  const onMacroDelete = useCallback(
    (macroIndex: number) => {
      const newCollection = { ...currentCollection }
      newCollection.macros = newCollection.macros.filter(
        (_, i) => i !== macroIndex
      )
      onCollectionUpdate(newCollection, selection.collectionIndex)
    },
    [currentCollection, onCollectionUpdate, selection.collectionIndex]
  )

  return (
    <Box
      w="100%"
      h="100%"
      p={['2', '3', '4']}
      overflow="hidden"
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}
      // css={{
      //   '&::-webkit-scrollbar': {
      //     width: '10px'
      //   },
      //   '&::-webkit-scrollbar-track': {
      //     background: '#f1f1f1',
      //     borderRadius: '10px'
      //   },
      //   '&::-webkit-scrollbar-thumb': {
      //     background: '#888',
      //     borderRadius: '10px'
      //   },
      //   '&::-webkit-scrollbar-thumb:hover': {
      //     background: '#555',
      //     borderRadius: '10px'
      //   }
      // }}
    >
      {currentCollection.macros.length === 0 ? (
        <Flex h="100%" justifyContent="center" alignItems="center">
          <Button
            variant="yellowGradient"
            _hover={{
              transform: 'scale(110%)'
            }}
            leftIcon={<AddIcon />}
            size={['sm', 'md', 'lg']}
            maxW="50%"
            onClick={() => {
              changeIsUpdatingMacro(false)
              changeViewState(ViewState.Addview)
            }}
          >
            Add Macro
          </Button>
        </Flex>
      ) : (
        <Grid
          w="100%"
          templateColumns={['repeat(2, 1fr)', 'repeat(3, 1fr)']}
          gap={['2', '3', '4']}
        >
          <Flex h="163px" justifyContent="center" alignItems="center">
            <VStack
              w="100%"
              h="full"
              bg={bg}
              boxShadow={shadowColour}
              rounded="md"
              p="3"
              m="auto"
              justifyContent="center"
              spacing="8px"
            >
              <Button
                variant="yellowGradient"
                _hover={{
                  transform: 'scale(110%)'
                }}
                leftIcon={<AddIcon />}
                size={['sm', 'md', 'lg']}
                onClick={() => {
                  changeIsUpdatingMacro(false)
                  changeViewState(ViewState.Addview)
                }}
              >
                Add Macro
              </Button>
            </VStack>
          </Flex>
          {currentCollection.macros.map((macro: Macro, index: number) => (
            <GridItem w="100%" h="163px" key={macro.name}>
              <MacroCard macro={macro} index={index} onDelete={onMacroDelete} />
            </GridItem>
          ))}
        </Grid>
      )}
    </Box>
  )
}
