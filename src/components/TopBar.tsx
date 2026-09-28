import { User } from './Icons'
export function TopBar({onMenu,onLogin,onSettings,signedIn,userName}:{onMenu:()=>void;onLogin:()=>void;onSettings:()=>void;signedIn:boolean;userName:string|null}){
 return <header className="topbar">
   <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Open menu"><span className="menu-glyph">☰</span></button>
   <div className="topbar-brand"><div className="topbar-title"><span>RafaAi</span></div></div>
   <div className="topbar-actions">{signedIn?<button className="profile-chip" onClick={onSettings}><span className="avatar mini">{(userName||'R').slice(0,1).toUpperCase()}</span><span>{userName||'Account'}</span></button>:<button className="top-login" onClick={onLogin}><User size={18}/><span>Log in</span></button>}</div>
 </header>
}
