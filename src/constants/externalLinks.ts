import { open } from '@tauri-apps/api/shell'

export const openDiscordLink = () => {
  open('https://discord.gg/wooting')
}
export const openSupportEmail = () => {
  open('mailto:social@wooting.io?Subject=Macro%20App:%20please%20help!')
}
export const openTwitterLink = () => {
  open('https://twitter.com/WootingKB')
}
