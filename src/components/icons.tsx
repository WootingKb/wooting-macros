import { Icon, IconProps } from '@chakra-ui/react'
import { SiDiscord, SiGithub } from 'react-icons/si'
import { RxKeyboard } from 'react-icons/rx'
import { BsMouse2, BsThreeDotsVertical } from 'react-icons/bs'
import { SlScreenDesktop } from 'react-icons/sl'
import {
  HiArrowDown,
  HiArrowsUpDown,
  HiArrowUp,
  HiOutlinePuzzlePiece
} from 'react-icons/hi2'
import { HiPlay, HiStop } from 'react-icons/hi'
import { RepeatClockIcon } from '@chakra-ui/icons'

export const KeyboardIcon = (props: IconProps) => {
  return <Icon as={RxKeyboard} boxSize={5} {...props} />
}
export const MouseIcon = (props: IconProps) => {
  return <Icon as={BsMouse2} boxSize={5} {...props} />
}
export const SystemIcon = (props: IconProps) => {
  return <Icon as={SlScreenDesktop} boxSize={5} {...props} />
}
export const IntegrationIcon = (props: IconProps) => {
  return <Icon as={HiOutlinePuzzlePiece} boxSize={5} {...props} />
}
export const DiscordIcon = (props: IconProps) => {
  return <Icon as={SiDiscord} boxSize={6} {...props} />
}
export const GithubIcon = (props: IconProps) => {
  return <Icon as={SiGithub} boxSize={6} {...props} />
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
  return <Icon as={BsThreeDotsVertical} w={3} h={6} {...props} />
}
export const StopIcon = (props: IconProps) => {
  return <Icon as={HiStop} boxSize={5} {...props} />
}
export const RecordIcon = (props: IconProps) => {
  return <Icon as={HiPlay} boxSize={5} {...props} />
}
export const ResetDefaultIcon = (props: IconProps) => {
  return <Icon as={RepeatClockIcon} boxSize={5} {...props} />
}
