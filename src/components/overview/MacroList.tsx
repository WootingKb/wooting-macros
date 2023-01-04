import { AddIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  useColorMode,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'
import { useCallback } from 'react'
import {
  scrollbarStylesLight,
  scrollbarsStylesDark
} from '../../constants/utils'
import { useApplicationContext } from '../../contexts/applicationContext'
import { useSelectedCollection } from '../../contexts/selectors'
import { ViewState } from '../../enums'
import { Collection, Macro } from '../../types'
import MacroCard from './MacroCard'

export default function MacroList() {
  const { selection, onCollectionUpdate, changeViewState } =
    useApplicationContext()
  const currentCollection: Collection = useSelectedCollection()
  const { colorMode } = useColorMode()
  const bg = useColorModeValue('bg-light', 'primary-dark.900')
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
      p={"25px"}
      overflow="hidden"
      overflowY="auto"
      sx={colorMode === 'light' ? scrollbarStylesLight : scrollbarsStylesDark}
    >
      <Grid
        w="full"
        templateColumns={['repeat(2, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
        gap={"25px"}
      >
        <Flex h="full" justifyContent="center" alignItems="center">
          <VStack
            w="full"
            h="187px"
            bg={bg}
            boxShadow={shadowColour}
            rounded="2xl"
            p="3"
            m="auto"
            justifyContent="center"
            spacing="8px"
          >
            <Button
              variant="yellowGradient"
              _hover={{
                transform: 'scale(105%)'
              }}
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
