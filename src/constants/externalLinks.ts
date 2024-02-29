import { shell } from '@tauri-apps/api'

export const openDiscordLink = () => {
  shell.open('https://discord.gg/wooting')
}
export const openGithubLink = () => {
  shell.open('https://github.com/WootingKb/wooting-macros')
}
