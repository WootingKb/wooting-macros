import {
  Box,
  HStack,
  IconButton,
  Input,
  keyframes,
  StackDivider,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  VStack
} from '@chakra-ui/react'
import { HiArrowDownTray, HiArrowPath, HiArrowPathRoundedSquare, HiArrowRight } from 'react-icons/hi2'
import { useMacroContext } from '../../../contexts/macroContext'
import { MacroType, MacroTypeDefinitions } from '../../../constants/enums'
import { checkIfStringIsNonNumeric } from '../../../constants/utils'
import React, { useEffect, useState } from "react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { borderRadiusStandard } from '../../../theme/config'

export default function MacroTypeArea() {
  const {macro, updateMacroType, updateMacroRepeatAmount} = useMacroContext()
  const borderColour = useColorModeValue('gray.400', 'gray.600')
  const secondBg = useColorModeValue('blue.50', 'gray.900')
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

  const updateValue = (newValue: number) => {
    setRepeatValue(newValue);
    updateMacroRepeatAmount(newValue);
  };


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
                    updateMacroType(index)
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
            position="absolute"
            // left="50%"
            transform="translate(40%, -140%)"
            fontSize="md"
            zIndex="1"
            bgColor={secondBg}

          >
            {macro.macro_type}
          </Box>
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
                    const newValue = Number(event.target.value);
                    updateValue(newValue);
                    console.error(newValue);
                  }}
                  value={repeatValue > 0 ? repeatValue : 1}
                  _focusVisible={{borderColor: 'primary-accent.500'}}
                />
                <VStack>
                  <IconButton
                    aria-label="Increase Value"
                    variant="yellowGradient"
                    icon={<AddIcon/>}
                    onClick={() => updateValue(repeatValue > 0 ? repeatValue + 1 : 1)}
                    size="2"
                  />
                  <IconButton
                    aria-label="Decrease Value"
                    variant="yellowGradient"
                    icon={<MinusIcon/>}
                    onClick={() => updateValue(repeatValue > 1 ? repeatValue - 1 : 1)}
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
