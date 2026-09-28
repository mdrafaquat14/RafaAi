import type { ChatSession, Theme } from '../types'

const CHAT_KEY = 'rafaai.chats.v2'
const THEME_KEY = 'rafaai.theme.v2'
const GUEST_KEY = 'rafaai.guestReplies.v2'
const GUEST_ID_KEY = 'rafaai.guestId.v1'
const LANG_KEY = 'rafaai.language.v1'
const RESPONSE_KEY = 'rafaai.responseStyle.v1'

function read<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

export const storage = {
  chats(): ChatSession[] { return read<ChatSession[]>(CHAT_KEY, []) },
  saveChats(chats: ChatSession[]) { localStorage.setItem(CHAT_KEY, JSON.stringify(chats.slice(0, 50))) },
  theme(): Theme { return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark' },
  saveTheme(theme: Theme) { localStorage.setItem(THEME_KEY, theme) },
  guestReplies(): number { return Math.min(5, Math.max(0, Number(localStorage.getItem(GUEST_KEY) || 0))) },
  guestId(): string {
    try {
      const existing = localStorage.getItem(GUEST_ID_KEY)
      if (existing) return existing
      const generated = `guest-${crypto.randomUUID()}`
      localStorage.setItem(GUEST_ID_KEY, generated)
      return generated
    } catch {
      return `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`
    }
  },
  incrementGuestReplies(): number {
    const next = Math.min(5, storage.guestReplies() + 1)
    localStorage.setItem(GUEST_KEY, String(next))
    return next
  },
  language(): 'auto' | 'en' | 'hi' | 'hinglish' {
    const value = localStorage.getItem(LANG_KEY)
    return value === 'en' || value === 'hi' || value === 'hinglish' ? value : 'auto'
  },
  saveLanguage(value: 'auto' | 'en' | 'hi' | 'hinglish') { localStorage.setItem(LANG_KEY, value) },
  responseStyle(): 'balanced' | 'concise' | 'detailed' {
    const value = localStorage.getItem(RESPONSE_KEY)
    return value === 'concise' || value === 'detailed' ? value : 'balanced'
  },
  saveResponseStyle(value: 'balanced' | 'concise' | 'detailed') { localStorage.setItem(RESPONSE_KEY, value) },
  clearChats() { localStorage.removeItem(CHAT_KEY) },
  clearGuest() { localStorage.removeItem(GUEST_KEY) },
}
