import { supabase } from './supabase'

const functionName = (import.meta.env.VITE_RAFAAI_FUNCTION_NAME as string | undefined) || 'rafaai-chat'

export interface GenerateArgs {
  contents: unknown[]
  guest: boolean
  guestQuestionNumber?: number
  guestId?: string
  classLevel?: string
  mode?: string
}

export async function generateAnswer(args: GenerateArgs, onDelta?: (text: string) => void) {
  if (!supabase) throw new Error('Supabase is not configured yet. Add the VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY environment variables.')

  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData.session?.access_token
  const baseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || 'https://kpcltwcxidmzwsdjidlx.supabase.co'
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${baseUrl}/functions/v1/${functionName}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...args, stream: true }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const message = body?.error || body?.message || `Request failed (${response.status})`
    const error = new Error(message) as Error & { status?: number; code?: string }
    error.status = response.status
    error.code = body?.code
    ;(error as any).details = body
    throw error
  }

  if (!response.body) throw new Error('AI stream was unavailable.')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let fullText = ''

  const consume = (chunk: string) => {
    buffer += chunk
    const lines = buffer.split(/\r?\n/)
    buffer = lines.pop() || ''
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue
      const raw = trimmed.slice(5).trim()
      if (!raw || raw === '[DONE]') continue
      try {
        const parsed = JSON.parse(raw)
        const delta = parsed?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text || '').join('') || ''
        if (delta) {
          fullText += delta
          onDelta?.(delta)
        }
      } catch {}
    }
  }

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    consume(decoder.decode(value, { stream: true }))
  }
  consume(decoder.decode())
  if (!fullText) throw new Error('AI returned an empty response.')
  return { text: fullText, creditStatus: { remaining: response.headers.get('X-RafaAi-Credits-Remaining'), limit: response.headers.get('X-RafaAi-Daily-Limit'), resetAt: response.headers.get('X-RafaAi-Credits-Reset-At') } }
}

export function extractText(payload: any): string {
  return payload?.text
    || payload?.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('')
    || payload?.candidates?.[0]?.output_text
    || 'I could not find a readable answer in the model response.'
}
