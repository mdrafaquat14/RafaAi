import fs from 'node:fs'
import path from 'node:path'

const dist=path.resolve('dist')
const source=fs.readFileSync(path.join(dist,'index.html'),'utf8')

const pages={
  about:{
    title:'About RafaAi — Student AI Assistant',
    description:'Learn what RafaAi is, who created it, what it can do for students, and how it is designed as a student-first AI learning assistant.',
    canonical:'https://rafaaii.vercel.app/about',
    heading:'About RafaAi',
    intro:'RafaAi is a student-first AI assistant created to make learning, problem solving, studying, writing, and everyday questions easier through a simple chat experience.',
    body:`<section><h2>What is RafaAi?</h2><p>RafaAi is an AI learning assistant for students and learners. You can ask questions in natural language, request explanations, work through problems, practise a topic, or ask for help with writing.</p><p>The goal is to help you understand and practise, not replace your own thinking.</p></section><section><h2>What you can do</h2><ul><li>Ask questions and get step-by-step explanations.</li><li>Use Explain, Solve, Study, Write, and Practice modes.</li><li>Keep recent chats locally on your device.</li><li>Attach supported images and documents to prompts.</li><li>Choose Hindi, English, or Hinglish preferences.</li><li>Open RafaFocus for the connected study workflow.</li></ul></section><section><h2>Built for students</h2><p>RafaAi is designed for learners who want clear explanations without unnecessary complexity.</p></section><section><h2>AI limitations</h2><p>AI answers can be incorrect, incomplete, or outdated. Check important academic information with your textbook, teacher, official source, or another trusted reference.</p></section><section><h2>Creator</h2><p>RafaAi was created by Md Rafaquat as a student-focused project.</p></section>`
  },
  privacy:{
    title:'Privacy Policy — RafaAi',
    description:'Read the RafaAi Privacy Policy covering account information, chat history, AI requests, browser storage, security, retention, and user choices.',
    canonical:'https://rafaaii.vercel.app/privacy',
    heading:'Privacy Policy',
    intro:'This Privacy Policy explains what information the current RafaAi website can handle, why it is used, where it is stored, and what choices are available.',
    body:`<section><h2>1. Scope</h2><p>This policy applies to the current RafaAi website and its described features. Third-party services used by RafaAi may have their own privacy policies and terms.</p></section><section><h2>2. Information you provide</h2><p>When you create an account, RafaAi can receive account information such as your email address, name, and optional class level. Prompts and attachments you choose to submit are processed to provide the requested AI feature.</p></section><section><h2>3. Chat history on your device</h2><p>The current website saves chat history locally in your browser so recent conversations appear in the sidebar.</p></section><section><h2>4. AI requests and attachments</h2><p>AI requests are sent through the RafaAi backend and configured AI service. Avoid submitting passwords, government IDs, financial details, precise private addresses, or other sensitive information unless necessary and appropriate.</p></section><section><h2>5. Account and authentication</h2><p>RafaAi uses Supabase authentication and backend functions for account operations.</p></section><section><h2>6. Browser storage</h2><p>The current frontend uses browser storage for local chat history, theme preference, language preference, response-style preference, and guest usage information.</p></section><section><h2>7. Security and retention</h2><p>RafaAi uses reasonable technical measures, but no online service can guarantee absolute security. Local chat data remains until it is cleared or browser storage is removed; account/backend retention depends on the services and configuration used by RafaAi.</p></section><section><h2>8. Your choices</h2><p>You can clear local chats, edit available profile information, change your password, choose preferences, and use password recovery. Clearing local chats is not account deletion.</p></section><section><h2>9. Third-party services and changes</h2><p>RafaAi may use third-party infrastructure for hosting, authentication, backend functions, and AI processing. This policy may be updated as the product and data practices change.</p></section>`
  },
  terms:{
    title:'Terms of Use — RafaAi',
    description:'Read the RafaAi Terms of Use covering accounts, AI-generated answers, academic integrity, files, misuse, usage limits, availability, and third-party services.',
    canonical:'https://rafaaii.vercel.app/terms',
    heading:'Terms of Use',
    intro:'These Terms of Use describe the basic rules for using RafaAi. Use the service responsibly and follow applicable laws and school rules.',
    body:`<section><h2>1. Using RafaAi</h2><p>RafaAi is an AI-assisted learning and productivity service. Use it for lawful, constructive purposes and do not interfere with the service, other users, or its supporting infrastructure.</p></section><section><h2>2. Accounts</h2><p>If you create an account, use information you are permitted to provide and keep your credentials private.</p></section><section><h2>3. AI-generated answers</h2><p>RafaAi responses may be wrong, incomplete, biased, or outdated. Check important information before relying on it.</p></section><section><h2>4. Academic integrity</h2><p>RafaAi can help you learn, practise, understand concepts, and improve drafts. Follow the rules of your school, teacher, board, examination, competition, or assignment.</p></section><section><h2>5. Prompts and files</h2><p>Only submit prompts, images, documents, and other material that you have the right and permission to use.</p></section><section><h2>6. Prohibited misuse</h2><ul><li>Do not attempt unauthorized access to RafaAi, accounts, backend, or infrastructure.</li><li>Do not disrupt, overload, probe, or interfere with the service.</li><li>Do not misrepresent your identity or abuse account/access controls.</li><li>Do not use the service in violation of applicable law or institutional rules.</li></ul></section><section><h2>7. Usage limits and availability</h2><p>Guest access, account access, daily AI credits, and other limits may apply. Features may change, be interrupted, or be temporarily unavailable.</p></section><section><h2>8. Third-party services and intellectual property</h2><p>RafaAi depends on third-party services for parts of its operation. The RafaAi name, interface, code, branding, and original site materials belong to their respective owners unless otherwise stated.</p></section><section><h2>9. Changes</h2><p>These terms may be updated as RafaAi evolves. The latest version will be published here with an updated date.</p></section>`
  }
}

for (const [route,page] of Object.entries(pages)) {
  let html=source
  html=html.replace(/<title>[\\s\\S]*?<\\/title>/i,`<title>${page.title}</title>`)
  html=html.replace(/<meta name="description" content="[^"]*" \/>/i,`<meta name="description" content="${page.description}" />`)
  html=html.replace(/<link rel="canonical" href="[^"]*" \/>/i,`<link rel="canonical" href="${page.canonical}" />`)
  html=html.replace(/<meta property="og:title" content="[^"]*" \/>/i,`<meta property="og:title" content="${page.title}" />`)
  html=html.replace(/<meta property="og:description" content="[^"]*" \/>/i,`<meta property="og:description" content="${page.description}" />`)
  html=html.replace(/<meta property="og:url" content="[^"]*" \/>/i,`<meta property="og:url" content="${page.canonical}" />`)
  html=html.replace(/<meta name="twitter:title" content="[^"]*" \/>/i,`<meta name="twitter:title" content="${page.title}" />`)
  html=html.replace(/<meta name="twitter:description" content="[^"]*" \/>/i,`<meta name="twitter:description" content="${page.description}" />`)
  html=html.replace(/<main id="seo-content">[\\s\\S]*?<\\/main>/i,`<main id="seo-content"><header><a href="/">RafaAi</a></header><article><h1>${page.heading}</h1><p>${page.intro}</p>${page.body}</article><nav aria-label="RafaAi information"><a href="/">Home</a><a href="/about">About RafaAi</a><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Use</a></nav></main>`)
  const outDir=path.join(dist,route)
  fs.mkdirSync(outDir,{recursive:true})
  fs.writeFileSync(path.join(outDir,'index.html'),html)
}
console.log('Generated route-specific SEO HTML for /about, /privacy and /terms')
