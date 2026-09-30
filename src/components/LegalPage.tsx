import { useEffect } from 'react'

type PageType='privacy'|'terms'|'about'
type Section={heading:string;paragraphs:string[];bullets?:string[]}

const content:Record<PageType,{title:string;description:string;eyebrow:string;intro:string;sections:Section[]}>={
about:{
 title:'About RafaAi',description:'Learn what RafaAi is, who created it, what it can do for students, and how it is designed as a student-first AI learning assistant.',eyebrow:'ABOUT RAFAAI',
 intro:'RafaAi is a student-first AI assistant created to make learning, problem solving, studying, writing, and everyday questions easier through a simple chat experience.',
 sections:[
  {heading:'What is RafaAi?',paragraphs:['RafaAi is an AI learning assistant for students and learners. You can ask questions in natural language, request explanations, work through problems, practise a topic, or ask for help with writing.','The goal is to help you understand and practise, not replace your own thinking.']},
  {heading:'What you can do',paragraphs:['The current product brings several learning actions into one place. Features may change as RafaAi develops.'],bullets:['Ask questions and get step-by-step explanations.','Use Explain, Solve, Study, Write, and Practice modes.','Keep recent chats locally on your device.','Attach supported images and documents to prompts.','Choose Hindi, English, or Hinglish preferences.','Open RafaFocus for the connected study workflow.']},
  {heading:'Built for students',paragraphs:['RafaAi is designed for learners who want clear explanations without unnecessary complexity. New chat, local chat search, account settings, and the message composer are kept close to the main learning area.']},
  {heading:'AI limitations',paragraphs:['AI answers can be incorrect, incomplete, or outdated. Check important academic information with your textbook, teacher, official source, or another trusted reference. RafaAi is not a substitute for a qualified professional.']},
  {heading:'Creator',paragraphs:['RafaAi was created by Md Rafaquat as a student-focused project. The product and interface may continue to change as the project is improved.']},
  {heading:'Privacy by design',paragraphs:['The current frontend keeps chat history and several preferences in browser storage, while account and AI requests use the services required to operate RafaAi. See the Privacy Policy for details.']},
  {heading:'Responsible use',paragraphs:['Use RafaAi as a learning and productivity tool. Follow your school, teacher, examination, and assignment rules when using AI-generated help.']}
 ]},
privacy:{
 title:'Privacy Policy',description:'Read the RafaAi Privacy Policy covering account information, chat history, AI requests, browser storage, security, retention, and user choices.',eyebrow:'PRIVACY',
 intro:'This Privacy Policy explains what information the current RafaAi website can handle, why it is used, where it is stored, and what choices are available.',
 sections:[
  {heading:'1. Scope',paragraphs:['This policy applies to the current RafaAi website and its described features. Third-party services used by RafaAi may have their own privacy policies and terms.']},
  {heading:'2. Information you provide',paragraphs:['When you create an account, RafaAi can receive account information such as your email address, name, and optional class level. Prompts and attachments you choose to submit are processed to provide the requested AI feature.']},
  {heading:'3. Chat history on your device',paragraphs:['The current website saves chat history locally in your browser so recent conversations appear in the sidebar. You can clear this local copy from Settings → AI settings → Clear saved chats. Clearing local chats does not delete an online account.']},
  {heading:'4. AI requests and attachments',paragraphs:['AI requests are sent through the RafaAi backend and configured AI service. Supported attachments may be encoded by the browser and included with the request.','Avoid submitting passwords, government IDs, financial details, precise private addresses, or other sensitive information unless necessary and appropriate.']},
  {heading:'5. Account and authentication',paragraphs:['RafaAi uses Supabase authentication and backend functions for account operations. Account information is handled through those services according to their applicable policies and the project configuration.']},
  {heading:'6. Browser storage',paragraphs:['The current frontend uses browser storage for product state, including:'],bullets:['Local chat history and message state.','Theme preference.','Language preference.','Response-style preference.','Guest usage information needed for the local guest limit.']},
  {heading:'7. Security',paragraphs:['RafaAi uses reasonable technical measures from the application and its infrastructure. No online service can guarantee absolute security. Keep your password private and sign out on shared devices when appropriate.']},
  {heading:'8. Retention',paragraphs:['Local chat data remains until you clear it, relevant browser storage is removed, or the application changes how it stores that information. Account/backend retention depends on the services and configuration used by RafaAi. AI-provider retention may also depend on the provider and service configuration.']},
  {heading:'9. Your choices',paragraphs:['You can clear local chats, edit available profile information, change your password, choose theme/language/response preferences, and use password recovery. The current interface does not provide a self-service account-deletion button, so clearing local chats should not be treated as account deletion.']},
  {heading:'10. Students and younger users',paragraphs:['RafaAi is a learning tool. Students should avoid entering information they would not want processed by an online service. If school, parent/guardian, or local rules require permission for an online AI service, follow those requirements.']},
  {heading:'11. Third-party services',paragraphs:['RafaAi may use third-party infrastructure for hosting, authentication, backend functions, and AI processing. Those providers may process information necessary to deliver requested features and may have their own policies.']},
  {heading:'12. Changes',paragraphs:['RafaAi may update this policy when the product, infrastructure, or data practices change. The latest version will be published here with an updated date.']}
 ]},
terms:{
 title:'Terms of Use',description:'Read the RafaAi Terms of Use covering accounts, AI-generated answers, academic integrity, files, misuse, usage limits, availability, and third-party services.',eyebrow:'TERMS',
 intro:'These Terms of Use describe the basic rules for using RafaAi. Use the service responsibly and follow applicable laws and school rules.',
 sections:[
  {heading:'1. Using RafaAi',paragraphs:['RafaAi is an AI-assisted learning and productivity service. Use it for lawful, constructive purposes and do not interfere with the service, other users, or its supporting infrastructure.']},
  {heading:'2. Accounts',paragraphs:['If you create an account, use information you are permitted to provide and keep your credentials private. You are responsible for activity performed through your account.']},
  {heading:'3. AI-generated answers',paragraphs:['RafaAi responses may be wrong, incomplete, biased, or outdated. Check important information before relying on it. A confident-looking answer is not a guarantee of correctness.']},
  {heading:'4. Academic integrity',paragraphs:['RafaAi can help you learn, practise, understand concepts, and improve drafts. Follow the rules of your school, teacher, board, examination, competition, or assignment. Do not use AI in a way that violates an assessment rule.']},
  {heading:'5. Prompts and files',paragraphs:['Only submit prompts, images, documents, and other material that you have the right and permission to use. Do not upload confidential material you are not authorized to share with an online service.']},
  {heading:'6. Prohibited misuse',paragraphs:['You must not use RafaAi to:'],bullets:['Attempt unauthorized access to RafaAi, accounts, backend, or infrastructure.','Disrupt, overload, probe, or interfere with the service or another user’s access.','Misrepresent your identity or intentionally abuse account/access controls.','Use the service in violation of applicable law or institutional rules.']},
  {heading:'7. Usage limits and access',paragraphs:['Guest access, account access, daily AI credits, and other limits may apply. RafaAi may change limits, temporarily restrict access, or require additional verification as the service evolves.']},
  {heading:'8. Availability and changes',paragraphs:['Features may be added, removed, changed, interrupted, or temporarily unavailable. RafaAi is a developing project and does not guarantee uninterrupted availability or a particular response time.']},
  {heading:'9. Third-party services',paragraphs:['RafaAi depends on third-party services for parts of its operation, including authentication, hosting, backend functions, and AI processing. Applicable third-party terms and policies may also apply.']},
  {heading:'10. Intellectual property',paragraphs:['The RafaAi name, interface, code, branding, and original site materials belong to their respective owners unless otherwise stated. Do not copy, redistribute, or present RafaAi branding or proprietary site material as your own without permission.']},
  {heading:'11. No professional guarantee',paragraphs:['RafaAi is not a doctor, lawyer, financial adviser, teacher, examination authority, or other licensed professional. For high-impact decisions, use appropriate qualified or official sources.']},
  {heading:'12. Account and local-data controls',paragraphs:['Settings currently lets signed-in users edit available profile information, change their password, adjust AI preferences, log out, and clear locally saved chats. Clearing local chats is a browser-data action, not account deletion.']},
  {heading:'13. Changes to these terms',paragraphs:['These terms may be updated as RafaAi evolves. The latest version will be published here with an updated date.']}
 ]}}

export function LegalPage({type}:{type:PageType}){
 const page=content[type]
 useEffect(()=>{
  const canonical='https://rafaaii.vercel.app/'+(type==='about'?'about':type)
  document.title=page.title+' — RafaAi'
  const setMeta=(selector:string,content:string,attr:'name'|'property'='name')=>{
   let el=document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${selector}"]`)
   if(!el){el=document.createElement('meta');el.setAttribute(attr,selector);document.head.appendChild(el)}
   el.setAttribute('content',content)
  }
  setMeta('description',page.description)
  setMeta('robots','index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1')
  setMeta('og:type','article','property');setMeta('og:title',page.title+' — RafaAi','property');setMeta('og:description',page.description,'property');setMeta('og:url',canonical,'property');setMeta('og:site_name','RafaAi','property')
  setMeta('twitter:card','summary');setMeta('twitter:title',page.title+' — RafaAi');setMeta('twitter:description',page.description)
  let link=document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if(!link){link=document.createElement('link');link.rel='canonical';document.head.appendChild(link)}
  link.href=canonical
  window.scrollTo(0,0)
 },[page.title,page.description,type])
 const go=(path:string)=>window.location.assign(path)
 return <main className="legal-page">
  <header className="legal-header">
   <button className="legal-brand" onClick={()=>go('/')} aria-label="Go to RafaAi home"><img src="/rafaai-new-logo.png" alt="" /><span>RafaAi</span></button>
   <button className="legal-back" onClick={()=>go('/')}>Back to RafaAi</button>
  </header>
  <article className="legal-card">
   <div className="eyebrow">{page.eyebrow}</div><h1>{page.title}</h1><p className="legal-intro">{page.intro}</p>
   <div className="legal-sections">{page.sections.map(section=><section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(p=><p key={p}>{p}</p>)}{section.bullets&&<ul>{section.bullets.map(item=><li key={item}>{item}</li>)}</ul>}</section>)}</div>
   <p className="legal-updated">Last updated: September 30, 2026</p>
  </article>
  <nav className="legal-footer" aria-label="Legal pages"><button onClick={()=>go('/about')}>About</button><button onClick={()=>go('/privacy')}>Privacy Policy</button><button onClick={()=>go('/terms')}>Terms of Use</button></nav>
 </main>
}
