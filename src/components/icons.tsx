import {
  Icon,
  IconProps,
} from '@chakra-ui/react'
import { FaDiscord, FaTwitter} from 'react-icons/fa'
import { RxKeyboard } from 'react-icons/Rx'
import { MdOutlineMouse, MdOutlineComputer } from 'react-icons/md'
import {
  HiOutlinePuzzlePiece,
  HiArrowUp,
  HiArrowDown,
  HiArrowsUpDown,
} from 'react-icons/hi2'
import { GoKebabVertical } from 'react-icons/go'

export const KeyboardIcon = (props: IconProps) => {
  return <Icon as={RxKeyboard} boxSize={5} {...props} />
}
export const MouseIcon = (props: IconProps) => {
  return <Icon as={MdOutlineMouse} boxSize={5} {...props} />
}
export const SystemIcon = (props: IconProps) => {
  return <Icon as={MdOutlineComputer} boxSize={5} {...props} />
}
export const IntegrationIcon = (props: IconProps) => {
  return <Icon as={HiOutlinePuzzlePiece} boxSize={5} {...props} />
}
export const DiscordIcon = (props: IconProps) => {
  return <Icon as={FaDiscord} boxSize={6} {...props} />
}
export const TwitterIcon = (props: IconProps) => {
  return <Icon as={FaTwitter} boxSize={6} {...props} />
}
export const DownArrowIcon = (props: IconProps) => {
  return <Icon as={HiArrowDown} boxSize={6} {...props} />
}
export const UpArrowIcon = (props: IconProps) => {
  return <Icon as={HiArrowUp} boxSize={6} {...props} />
}
export const DownUpArrowsIcon = (props: IconProps) => {
  return <Icon as={HiArrowsUpDown} boxSize={6} {...props} />
}
export const KebabVertical = (props: IconProps) => {
  return <Icon as={GoKebabVertical} w={2} h={6} {...props} />
}
