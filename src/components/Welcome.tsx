import type { PromptMode } from '../types'
import { SparkIcon } from './Icons'
import { Logo } from './Logo'

export function Welcome({ onPrompt }: { onPrompt:(text:string, mode:PromptMode)=>void }) {
  const prompts:[string,PromptMode][] = [
    ['Explain a difficult topic simply','Explain'],
    ['Solve this math problem step by step','Solve'],
    ['Help me write a better answer','Write'],
    ['Give me 10 practice questions','Practice'],
    ['Research a topic with sources','Search'],
  ]
  return <section className="welcome">
    <div className="welcome-logo"><Logo /></div>
    <div className="eyebrow"><SparkIcon /> Student-first AI assistant</div>
    <h1>What can I help you with?</h1>
    <p>Ask a question, share a problem, or bring your study work. RafaAi is built to explain things clearly.</p>
    <div className="suggestion-row">{prompts.map(([text,mode])=><button key={text} onClick={()=>onPrompt(text,mode)}>{text}</button>)}</div>
  </section>
}
