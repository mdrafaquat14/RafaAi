import { useEffect } from 'react'

type PageType='privacy'|'terms'|'about'

const content={
  about:{title:'About RafaAi',eyebrow:'ABOUT RAFAAI',intro:'RafaAi is a student-first AI assistant built to make learning, problem solving, studying, and everyday questions easier.',sections:[
    ['What is RafaAi?','RafaAi helps students understand concepts, solve questions step by step, practise topics, write, and explore ideas through natural conversation. It is designed with a simple, student-friendly experience in mind.'],
    ['Built for learning','RafaAi is especially focused on learners who want quick explanations without losing the ability to think, practise, and learn independently.'],
    ['Creator','RafaAi was created by Md Rafaquat.'],
    ['Use AI thoughtfully','AI can make mistakes. For important academic, legal, medical, financial, or other high-impact information, verify the answer with a trusted source or qualified person.']
  ]},
  privacy:{title:'Privacy Policy',eyebrow:'PRIVACY',intro:'This policy explains, in simple language, how RafaAi handles information when you use the website.',sections:[
    ['Information you provide','If you create an account, RafaAi may receive your email address and profile details such as your name and class. Chat content may also be processed when you use AI features.'],
    ['Chat data','Chats on this device are stored locally by the website for the chat-history experience. Account and service requests may also be processed through the services used to operate RafaAi.'],
    ['AI processing','When you send a prompt or attachment for an AI response, the information needed to generate that response is sent through the RafaAi backend and the configured AI service. Do not submit sensitive information you do not want processed.'],
    ['Security','RafaAi uses reasonable technical measures and third-party infrastructure to operate accounts and AI features. No internet service can guarantee absolute security.'],
    ['Your choices','You can use guest access where available, create or delete local chat history, and manage account details through Settings. Account-related deletion or data requests can be handled by the service operator where supported.'],
    ['Children and students','RafaAi is intended as a learning tool. Students should avoid sharing passwords, financial information, government IDs, precise addresses, or other highly sensitive personal information in chats.'],
    ['Changes','This policy may be updated as RafaAi changes. The latest version will be published on this page.']
  ]},
  terms:{title:'Terms of Use',eyebrow:'TERMS',intro:'By using RafaAi, you agree to use the service responsibly and understand the following conditions.',sections:[
    ['Use of the service','Use RafaAi for lawful, educational, and constructive purposes. Do not attempt to abuse, disrupt, reverse-engineer, or gain unauthorized access to the service or other users’ accounts.'],
    ['Accounts','Keep your account credentials private and use accurate information when creating an account. You are responsible for activity performed through your account.'],
    ['AI-generated content','RafaAi responses are generated with AI and may be incomplete, outdated, or incorrect. You are responsible for reviewing important information before relying on it.'],
    ['Academic use','RafaAi can support learning, but students should follow their school, teacher, examination, and assignment rules. Do not use AI in a way that violates an assessment’s rules.'],
    ['Files and prompts','Only upload or submit content you have the right to use and that is appropriate for the service. Avoid submitting confidential or highly sensitive information.'],
    ['Availability','Features may change, be limited, or become temporarily unavailable. Free access and usage limits may also change over time.'],
    ['Third-party services','RafaAi may rely on third-party services for authentication, hosting, AI processing, or other functionality. Their own terms and policies may also apply.'],
    ['Changes to these terms','These terms may be updated as RafaAi evolves. Continued use after an update means you accept the updated terms to the extent permitted by applicable law.']
  ]}
} as const

export function LegalPage({type}:{type:PageType}){
 const page=content[type]
 useEffect(()=>{document.title=page.title+' — RafaAi';window.scrollTo(0,0)},[page.title])
 return <main className="legal-page">
   <header className="legal-header"><a href="/" className="legal-brand"><img src="/rafaai-new-logo.png" alt="RafaAi"/><span>RafaAi</span></a><a href="/" className="legal-back">Back to RafaAi</a></header>
   <article className="legal-card">
     <div className="eyebrow">{page.eyebrow}</div>
     <h1>{page.title}</h1>
     <p className="legal-intro">{page.intro}</p>
     <div className="legal-sections">{page.sections.map(([heading,text])=><section key={heading}><h2>{heading}</h2><p>{text}</p></section>)}</div>
     <p className="legal-updated">Last updated: September 30, 2026</p>
   </article>
   <footer className="legal-footer"><a href="/about">About</a><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Use</a></footer>
 </main>
}
