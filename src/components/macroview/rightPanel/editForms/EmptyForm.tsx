import { Flex, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'

export default function EmptyForm() {
  return (
    <Flex
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      w="full"
      h="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Text
        fontWeight="bold"
        fontSize={['sm', 'md', 'lg']}
        w="75%"
        textAlign="center"
      >
        Press on an element to edit it
      </Text>
    </Flex>
  )
}
