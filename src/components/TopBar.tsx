import type { Theme } from '../types'
import { MenuIcon, MoonIcon, SunIcon } from './Icons'
import { Logo } from './Logo'

export function TopBar({ theme, setTheme, onMenu, signedIn }: { theme:Theme; setTheme:(t:Theme)=>void; onMenu:()=>void; signedIn:boolean }) {
  return <header className="topbar"><button className="mobile-top-menu" onClick={onMenu} aria-label="Open menu"><MenuIcon/></button><div className="mobile-brand"><Logo small/><strong>RafaAi</strong></div><div className="topbar-spacer"/><div className="topbar-actions"><span className="status-dot"/><span className="status-label">{signedIn?'Account ready':'Guest mode'}</span><button className="theme-button" onClick={()=>setTheme(theme==='dark'?'light':'dark')} title={`Switch to ${theme==='dark'?'light':'dark'} mode`} aria-label="Toggle theme">{theme==='dark'?<SunIcon/>:<MoonIcon/>}</button></div></header>
}
