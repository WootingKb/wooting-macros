import {
  HStack,
  IconButton,
  Text,
  useColorModeValue,
  StackDivider, Tooltip, useDisclosure, Input, VStack, keyframes, Fade, Collapse, Box, Slide
} from '@chakra-ui/react'
import { HiArrowRight, HiArrowDownTray, HiArrowPath, HiArrowPathRoundedSquare } from 'react-icons/hi2'
import { useMacroContext } from '../../../contexts/macroContext'
import { MacroType, MacroTypeDefinitions } from '../../../constants/enums'
import { checkIfStringIsNonNumeric } from '../../../constants/utils'
import React, { useEffect, useState } from "react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

export default function MacroTypeArea() {
  const {macro, updateMacroType} = useMacroContext()
  const borderColour = useColorModeValue('gray.400', 'gray.600')
  const typeIcons = [<HiArrowRight/>, <HiArrowPath/>, <HiArrowDownTray/>, <HiArrowPathRoundedSquare/>]
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [repeatValue, setRepeatValue] = useState(0);

  const expandAnimation = keyframes`
      from {
          max-width: 0px;
          visibility: hidden;

      }
      to {
          max-width: 180px;
          visibility: visible;

      }
  `;

  const closeAnimation = keyframes`
      from {
          max-width: 180px;
          visibility: visible;
      }
      to {
          max-width: 0px;
          visibility: hidden;

      }
  `;

  useEffect(() => {
    if (macro.macro_type === 'RepeatX') {
      onOpen();
    }
  }, [macro.macro_type, onOpen])
  return (
    <>
      <HStack
        justifyItems="flex-start"
        w="fit"
        h="fit"
        p="2"
        border="1px"
        borderColor={borderColour}
        divider={<StackDivider/>}
        rounded="md"
        spacing="16px"
      >
        <Text fontWeight="semibold" fontSize={['sm', 'md']}>
          Macro Type
        </Text>
        <HStack>
          {(Object.keys(MacroType) as Array<keyof typeof MacroType>)
            .filter(checkIfStringIsNonNumeric)
            .map((value: string, index: number) => (
              <Tooltip variant="brand"
                       label={MacroTypeDefinitions[index]}
                       placement="bottom-start"
                       hasArrow>
                <IconButton
                  icon={typeIcons[index]}
                  aria-label="macro type"
                  size="sm"
                  colorScheme={
                    macro.macro_type === value ? 'primary-accent' : 'gray'
                  }


                  onClick={() => {
                    updateMacroType(index, macro.repeat_amount)
                    if (value === 'RepeatX') {
                      onOpen()
                    } else {
                      onClose()
                    }
                  }
                  }
                  key={value}
                ></IconButton>
              </Tooltip>
            ))}
          <Box
            maxWidth={isOpen ? "150px" : "0px"}
            overflow="hidden"
            transition="maxWidth 0.5s ease-out"
            pointerEvents={isOpen ? "auto" : "none"}
            sx={{
              animation: `${isOpen ? expandAnimation : closeAnimation} 0.5s ease-out forwards`
            }}
          >
            <Box opacity={isOpen ? 1 : 0}
                 transition="opacity 0.5s ease-out"
                 pointerEvents={isOpen ? "auto" : "none"}
                 sx={{
                   animation: `${isOpen ? expandAnimation : closeAnimation} 0.5s ease-out forwards`
                 }}
            >
              <HStack>
                <Input
                  w="full"
                  variant="flushed"
                  placeholder="Repeat Value"
                  size="xl"
                  textStyle="name"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setRepeatValue(Number(event.target.value))
                  }}
                  value={repeatValue > 0 ? repeatValue : 1}
                  _focusVisible={{borderColor: 'primary-accent.500'}}
                />
                <VStack>
                  <IconButton
                    aria-label="Increase Value"
                    variant="yellowGradient"
                    icon={<AddIcon/>}
                    onClick={() => setRepeatValue(repeatValue > 0 ? repeatValue + 1 : 1)}
                    size="2"
                  />
                  <IconButton
                    aria-label="Decrease Value"
                    variant="yellowGradient"
                    icon={<MinusIcon/>}
                    onClick={() => setRepeatValue(repeatValue > 1 ? repeatValue - 1 : 1)}
                    size="2"
                  />
                </VStack>
              </HStack>
            </Box>

          </Box>


        </HStack>
      </HStack>
    </>
  )
}
