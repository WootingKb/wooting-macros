import { AddIcon } from '@chakra-ui/icons'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Text,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'
import { useCallback, useMemo, useState } from 'react'
import { useApplicationContext } from '../../contexts/applicationContext'
import { useSelectedCollection } from '../../contexts/selectors'
import { ViewState } from '../../constants/enums'
import { Collection, Macro } from '../../types'
import MacroCard from './MacroCard'
import useScrollbarStyles from '../../hooks/useScrollbarStyles'
import useMainBgColour from '../../hooks/useMainBgColour'
import { motion } from 'framer-motion'

interface Props {
  searchValue: string
}

export default function MacroList({ searchValue }: Props) {
  // Get the ApplicationContext from your hook.
  const {
    collections,
    selection,
    onCollectionUpdate,
    changeViewState,
    isMacroOutputEnabled
  } = useApplicationContext()
  const currentCollection = useSelectedCollection()
  const shadowColour = useColorModeValue('md', 'white-md')

  const matchingMacros = useMemo(() => {
    const newMatchingMacros: { macro: Macro; collection: Collection }[] = []

    if (searchValue) {
      collections.map((collection) => {
        collection.macros.map((macro) => {
          if (macro.name.toLocaleLowerCase().includes(searchValue)) {
            newMatchingMacros.push({ macro, collection })
          }
        })
      })
      return newMatchingMacros
    } else {
      return currentCollection.macros.map((macro, index) => ({
        macro,
        collection: currentCollection,
        index
      }))
    }
  }, [searchValue, collections, currentCollection])

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

  const isSearching: boolean = useMemo((): boolean => {
    return searchValue.length !== 0
  }, [searchValue.length])

  return (
    <Box
      w="full"
      h="full"
      p="25px"
      overflow="hidden"
      overflowY="auto"
      sx={useScrollbarStyles()}
    >
      {!isMacroOutputEnabled && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
        >
          <Alert status="warning" w={-25} rounded="md" py="1" p={2} m={2}>
            <AlertIcon boxSize={['16px', '20px']} />
            <AlertDescription fontSize={['md', 'lg']} fontWeight="bold">
              Macros will not function while Macro output is disabled.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
      <Grid
        w="full"
        templateColumns={['repeat(2, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
        gap="25px"
        p={2}
      >
        {!searchValue && (
          <>
            <motion.div
              initial={{ x: '100vh' }}
              animate={{ x: 0 }}
              transition={{ ease: 'circOut', duration: 0.2 }}
              exit={{ x: '100vh' }}
            >
              <Flex h="full" justifyContent="center" alignItems="center">
                <VStack
                  w="full"
                  minH="202px"
                  h="full"
                  bg={useMainBgColour()}
                  boxShadow={shadowColour}
                  rounded="md"
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
            </motion.div>
            {currentCollection.macros.map((macro, index) => (
              <motion.div
                key={`${macro.name} + ${index}`}
                initial={{ x: '100vh' }}
                transition={{ ease: 'circOut', duration: 0.2 }}
                animate={{ x: 0 }}
                exit={{ x: '100vh' }}
              >
                <GridItem w="full" h="fit-content">
                  <MacroCard
                    macro={macro}
                    index={index}
                    onDelete={onMacroDelete}
                    searchValue={searchValue}
                  />
                </GridItem>
              </motion.div>
            ))}
          </>
        )}
        {searchValue &&
          matchingMacros.map(({ macro, collection }, index) => (
            <motion.div
              key={`${macro.name} + ${index}`}
              initial={{ x: '100vh' }}
              transition={{ ease: 'circOut', duration: 0.2 }}
              animate={{ x: 0 }}
              exit={{ x: '100vh' }}
            >
              <GridItem w="full" h="fit-content">
                <MacroCard
                  macro={macro}
                  index={index}
                  onDelete={onMacroDelete}
                  collectionName={collection.name}
                  searchValue={searchValue}
                />
              </GridItem>
            </motion.div>
          ))}
      </Grid>
      {matchingMacros.length === 0 && isSearching && (
        <HStack align="center" justifyContent="center">
          <Text>{`No macros correspond to: "${searchValue}"`}</Text>
        </HStack>
      )}
    </Box>
  )
}
