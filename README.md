# RafaAi — Phase 1 Production Frontend

A responsive React + Vite frontend for RafaAi, designed as an original premium AI assistant experience for students.

## Included
- Guest flow: first 3 questions locally, login gate on the 4th.
- Supabase email/password login and signup.
- Logged-in chat with local chat history.
- Light and dark themes only.
- Responsive sidebar + mobile drawer.
- New chat, chat search, rename/delete local chats.
- Prompt mode chips: Explain, Solve, Write, Practice, Search.
- Attachment/image selection UI with preview.
- Copy, regenerate, like/dislike actions.
- Stop-generation UI state.
- Markdown-style rendering for common AI output patterns.
- Original RafaAi logo with its background removed and transparency preserved.
- Ready to call the `rafaai-chat` Supabase Edge Function.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Add your Supabase project URL and publishable/anon key.
3. Run:

```bash
npm install
npm run dev
```

4. For Vercel, import the GitHub repository and add the same environment variables in the Vercel project settings.

## Important
- Do **not** add `GEMINI_API_KEY` to this frontend or to GitHub.
- The Gemini secret belongs in the Supabase Edge Function environment.
- The guest 3-question counter is browser-local in this Phase 1 UI. It is a UX gate, not an abuse-proof security boundary. A server-side anonymous rate-limit layer can be added later if strict anti-abuse enforcement is required.
- The frontend reads a logged-in user's `profiles.status`; the Edge Function remains the final authority for restricted accounts.

## Expected backend contract
POST `${VITE_SUPABASE_URL}/functions/v1/rafaai-chat`

```json
{
  "contents": [
    { "role": "user", "parts": [{ "text": "Explain photosynthesis" }] }
  ],
  "guest": false
}
```

For a guest request, the UI sends `guest: true` and the current local question number (1–3).

## Phase 2
The UI is structured so the existing Supabase Edge Function can be upgraded for true token streaming, stronger guest abuse protection, richer file/PDF handling, and admin management without redesigning the app shell.
