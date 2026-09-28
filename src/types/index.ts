export type Theme = 'light' | 'dark'
export type ChatRole = 'user' | 'assistant'
export type PromptMode = 'Explain' | 'Solve' | 'Write' | 'Practice' | 'Search'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: number
  attachmentName?: string
  imageDataUrl?: string
  liked?: boolean | null
}

export interface ChatSession {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  messages: ChatMessage[]
}

export interface Profile {
  id: string
  full_name: string | null
  role: 'student' | 'admin'
  status: 'active' | 'restricted'
}
