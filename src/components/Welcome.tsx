import type { PromptMode } from '../types'
import { BookOpen, Calculator, ListChecks, Pen, Sparkles } from './Icons'
const modes:{label:string;mode:PromptMode;icon:React.ReactNode;prompt:string}[]=[
 {label:'Explain',mode:'Explain',icon:<Sparkles size={17}/>,prompt:'Explain this concept in a simple way: '},
 {label:'Solve',mode:'Solve',icon:<Calculator size={17}/>,prompt:'Solve this step by step: '},
 {label:'Study',mode:'Study',icon:<BookOpen size={17}/>,prompt:'Help me study this topic: '},
 {label:'Write',mode:'Write',icon:<Pen size={17}/>,prompt:'Help me write: '},
 {label:'Practice',mode:'Practice',icon:<ListChecks size={17}/>,prompt:'Give me practice questions on: '},
]
export function Welcome({onPrompt}:{onPrompt:(text:string,mode:PromptMode)=>void}){
 return <section className="welcome"><div className="welcome-inner">
   <div className="welcome-mark"><img src="/rafaai-logo.svg" alt="" /></div>
   <div className="eyebrow">STUDENT-FIRST AI ASSISTANT</div>
   <h1>What are you doing today?</h1>
   <p className="welcome-subtitle">Ask a doubt, solve a question, learn a topic, or get help with your next study task.</p>
   <div className="quick-modes" aria-label="Quick modes">{modes.map(item=><button key={item.label} onClick={()=>onPrompt(item.prompt,item.mode)}>{item.icon}<span>{item.label}</span></button>)}</div>
   <div className="welcome-note">RafaAi can make mistakes. Check important answers with your teacher or trusted sources.</div>
 </div></section>
}
