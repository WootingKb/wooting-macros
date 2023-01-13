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
import { useSelectedCollection } from '../../contexts/selectors'
import { ViewState } from '../../constants/enums'
import { Macro } from '../../types'
import MacroCard from './MacroCard'
import useScrollbarStyles from '../../hooks/useScrollbarStyles'
import useMainBgColour from '../../hooks/useMainBgColour'

export default function MacroList() {
  const { selection, onCollectionUpdate, changeViewState } =
    useApplicationContext()
  const currentCollection = useSelectedCollection()
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
      w="full"
      h="full"
      p='25px'
      overflow="hidden"
      overflowY="auto"
      sx={useScrollbarStyles()}
    >
      <Grid
        w="full"
        templateColumns={['repeat(2, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
        gap={'25px'}
      >
        <Flex h="full" justifyContent="center" alignItems="center">
          <VStack
            w="full"
            minH="202px"
            h="full"
            bg={useMainBgColour()}
            boxShadow={shadowColour}
            rounded="2xl"
            p={3}
            m="auto"
            justifyContent="center"
            spacing={2}
          >
            <Button
              variant="yellowGradient"
              leftIcon={<AddIcon />}
              size={['sm', 'md', 'lg']}
              onClick={() => {
                changeViewState(ViewState.Addview)
              }}
            >
              Add Macro
            </Button>
          </VStack>
        </Flex>
        {currentCollection.macros.map((macro: Macro, index: number) => (
          <GridItem w="full" h="fit-content" key={`${macro.name} + ${index}`}>
            <MacroCard macro={macro} index={index} onDelete={onMacroDelete} />
          </GridItem>
        ))}
      </Grid>
    </Box>
  )
}
