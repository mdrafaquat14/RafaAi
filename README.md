# RafaAi 2.0 — Phase 1 Frontend

A polished, responsive React/Vite frontend for RafaAi.

## Included
- Premium AI-chat layout with desktop collapsible sidebar and mobile drawer
- Light/Dark theme inside Settings (not exposed as a top-level clutter control)
- Prominent Log in button
- Guest UI limit of 5 successful AI replies
- Send disabled while an AI generation is active
- Hindi / English / Hinglish preferences
- Local chat history
- Image attachment UI
- Quick student modes
- RafaFocus link
- Auth and Supabase function integration hooks

## Important backend note
The frontend sends a RafaAi identity instruction and a guest reply number to the existing edge function. For production enforcement, update the edge function to enforce the new 5-reply guest policy server-side and to honor `systemInstruction`/identity at the model layer. Client-side localStorage limits alone are not secure against clearing browser data.

## Run
```bash
npm install
npm run build
```

Required Vercel environment variables are documented in `.env.example`.


<!-- credit-access-system -->

<!-- production-deploy-check: 2026-09-29 -->
