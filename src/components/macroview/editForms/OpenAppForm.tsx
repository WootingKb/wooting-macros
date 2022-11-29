import {
  Button,
  Divider,
  Flex,
  Input,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { useMacroContext } from '../../../contexts/macroContext'
import { useSelectedElement } from '../../../contexts/selectors'

const OpenAppForm = () => {
  const inputFile = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState('')
  const selectedElement = useSelectedElement()
  const { selectedElementId, updateElement } = useMacroContext()
  const dividerColour = useColorModeValue('gray.400', 'gray.600')

  useEffect(() => {
    console.log(inputFile.current?.files)
  }, [inputFile.current?.files])
  

  return (
    <>
      <Text fontWeight="semibold" fontSize={['sm', 'md']}>
        {'Open Application'}
      </Text>
      <Divider borderColor={dividerColour} />
      <Input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: 'none' }}
      />
      <Button
        colorScheme={'yellow'}
        onClick={() => {
          inputFile.current?.click()
        }}
      >
        Browse
      </Button>
    </>
  )
}

export default OpenAppForm
