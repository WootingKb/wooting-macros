import { Box, Button, Flex, HStack, useColorMode, VStack, Text, IconButton } from '@chakra-ui/react'
import { AddIcon, EditIcon } from '@chakra-ui/icons'
import { Link } from 'wouter';

type Props = {}

const MacroView = (props: Props) => {
  return (
        <HStack minH="100vh" spacing="0">
                <Link href='/'>
                    <Button>
                        Back
                    </Button>
                </Link>
        </HStack>
  )
}

export default MacroView