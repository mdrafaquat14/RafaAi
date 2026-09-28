import type { ChatSession, Theme } from '../types'

const CHAT_KEY = 'rafaai.chats.v1'
const THEME_KEY = 'rafaai.theme.v1'
const GUEST_KEY = 'rafaai.guestQuestions.v1'

function read<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

export const storage = {
  chats(): ChatSession[] {
    return read<ChatSession[]>(CHAT_KEY, [])
  },
  saveChats(chats: ChatSession[]) {
    localStorage.setItem(CHAT_KEY, JSON.stringify(chats.slice(0, 50)))
  },
  theme(): Theme {
    const value = localStorage.getItem(THEME_KEY)
    return value === 'light' ? 'light' : 'dark'
  },
  saveTheme(theme: Theme) {
    localStorage.setItem(THEME_KEY, theme)
  },
  guestQuestions(): number {
    return Math.min(3, Math.max(0, Number(localStorage.getItem(GUEST_KEY) || 0)))
  },
  incrementGuestQuestions(): number {
    const next = Math.min(3, storage.guestQuestions() + 1)
    localStorage.setItem(GUEST_KEY, String(next))
    return next
  },
}
