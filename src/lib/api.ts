import { supabase } from './supabase'

const functionName = (import.meta.env.VITE_RAFAAI_FUNCTION_NAME as string | undefined) || 'rafaai-chat'

export interface GenerateArgs {
  contents: unknown[]
  guest: boolean
  guestQuestionNumber?: number
  classLevel?: string
  mode?: string
}

export async function generateAnswer(args: GenerateArgs) {
  if (!supabase) throw new Error('Supabase is not configured yet. Add the VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY environment variables.')

  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData.session?.access_token
  const baseUrl = import.meta.env.VITE_SUPABASE_URL as string
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${baseUrl}/functions/v1/${functionName}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(args),
  })

  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = body?.error || body?.message || `Request failed (${response.status})`
    const error = new Error(message) as Error & { status?: number }
    error.status = response.status
    throw error
  }

  return body
}

export function extractText(payload: any): string {
  return payload?.text
    || payload?.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('')
    || payload?.candidates?.[0]?.output_text
    || 'I could not find a readable answer in the model response.'
}
