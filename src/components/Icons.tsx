import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }
const I = ({ size = 20, children, ...props }: IconProps & { children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>
)
export const Plus = (p: IconProps) => <I {...p}><path d="M12 5v14M5 12h14"/></I>
export const Search = (p: IconProps) => <I {...p}><circle cx="11" cy="11" r="6.8"/><path d="m16.2 16.2 4 4"/></I>
export const Settings = (p: IconProps) => <I {...p}><path d="M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Z"/><path d="m19.4 13.3 1.1.8-1.6 2.7-1.3-.5a7.9 7.9 0 0 1-1.8 1.1l-.2 1.4h-3.2l-.2-1.4a7.9 7.9 0 0 1-1.9-1.1l-1.3.5-1.6-2.7 1.1-.8a8 8 0 0 1 0-2.6l-1.1-.8 1.6-2.7 1.3.5a7.9 7.9 0 0 1 1.9-1.1l.2-1.4h3.2l.2 1.4a7.9 7.9 0 0 1 1.8 1.1l1.3-.5 1.6 2.7-1.1.8a8 8 0 0 1 0 2.6Z"/></I>
export const Menu = (p: IconProps) => <I {...p}><path d="M4 7h16M4 12h16M4 17h16"/></I>
export const ChevronLeft = (p: IconProps) => <I {...p}><path d="m15 18-6-6 6-6"/></I>
export const ChevronRight = (p: IconProps) => <I {...p}><path d="m9 18 6-6-6-6"/></I>
export const X = (p: IconProps) => <I {...p}><path d="m6 6 12 12M18 6 6 18"/></I>
export const Send = (p: IconProps) => <I {...p}><path d="m4 4 16 8-16 8 3.5-8L4 4Z"/><path d="M7.5 12H20"/></I>
export const Stop = (p: IconProps) => <I {...p}><rect x="7" y="7" width="10" height="10" rx="2"/></I>
export const Paperclip = (p: IconProps) => <I {...p}><path d="m20 11.2-7.9 7.9a5 5 0 0 1-7.1-7.1l8.2-8.2a3.4 3.4 0 1 1 4.8 4.8l-8.2 8.2a1.8 1.8 0 0 1-2.5-2.5l7.2-7.2"/></I>
export const ImageIcon = (p: IconProps) => <I {...p}><rect x="3.5" y="4" width="17" height="16" rx="2.5"/><circle cx="8.5" cy="9" r="1.3"/><path d="m4.5 17 4.2-4.2 3.1 3 2.1-2.1 5.6 5"/></I>
export const Globe = (p: IconProps) => <I {...p}><circle cx="12" cy="12" r="8.5"/><path d="M3.7 12h16.6M12 3.5c2.2 2.3 3.3 5.1 3.3 8.5s-1.1 6.2-3.3 8.5c-2.2-2.3-3.3-5.1-3.3-8.5S9.8 5.8 12 3.5Z"/></I>
export const Sparkles = (p: IconProps) => <I {...p}><path d="m12 3-1.1 4.1L7 8.3l3.9 1.2L12 13.5l1.1-4 3.9-1.2-3.9-1.2L12 3ZM19 13l-.7 2.3L16 16l2.3.7L19 19l.7-2.3L22 16l-2.3-.7L19 13ZM5 14l-.8 2.7L2 17.5l2.2.8L5 21l.8-2.7 2.2-.8-2.2-.8L5 14Z"/></I>
export const BookOpen = (p: IconProps) => <I {...p}><path d="M4 5.5a2 2 0 0 1 2-2h5v16H6a2 2 0 0 0-2 2V5.5ZM20 5.5a2 2 0 0 0-2-2h-5v16h5a2 2 0 0 1 2 2V5.5Z"/></I>
export const Pen = (p: IconProps) => <I {...p}><path d="m14.5 6.5 3 3M5 19l2.2-5.2L16.7 4.3a2.1 2.1 0 0 1 3 3l-9.5 9.5L5 19Z"/></I>
export const Calculator = (p: IconProps) => <I {...p}><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h.01M16 18h.01"/></I>
export const ListChecks = (p: IconProps) => <I {...p}><path d="m4 6 1.5 1.5L8 5M11 6h9M4 12l1.5 1.5L8 11M11 12h9M4 18l1.5 1.5L8 17M11 18h9"/></I>
export const More = (p: IconProps) => <I {...p}><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/></I>
export const User = (p: IconProps) => <I {...p}><circle cx="12" cy="8" r="3.3"/><path d="M5 20a7 7 0 0 1 14 0"/></I>
export const LogOut = (p: IconProps) => <I {...p}><path d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10M14 8l4 4-4 4M18 12H9"/></I>
export const Trash = (p: IconProps) => <I {...p}><path d="M4 7h16M10 11v5M14 11v5M6 7l1 13h10l1-13M9 7V4h6v3"/></I>
export const Copy = (p: IconProps) => <I {...p}><rect x="8" y="8" width="11" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2"/></I>
export const Refresh = (p: IconProps) => <I {...p}><path d="M20 11a8 8 0 0 0-14.7-4L4 9"/><path d="M4 5v4h4M4 13a8 8 0 0 0 14.7 4L20 15"/><path d="M20 19v-4h-4"/></I>
export const ThumbsUp = (p: IconProps) => <I {...p}><path d="M7 10v10H4V10h3ZM7 20h8.8a2 2 0 0 0 1.9-1.5l1.5-5.7A2 2 0 0 0 17.3 10H14l.5-3a2.5 2.5 0 0 0-2.5-3L8 10"/></I>
export const ThumbsDown = (p: IconProps) => <I {...p}><path d="M7 14V4H4v10h3ZM7 4h8.8a2 2 0 0 1 1.9 1.5l1.5 5.7A2 2 0 0 1 17.3 14H14l.5 3a2.5 2.5 0 0 1-2.5 3L8 14"/></I>
export const MessageSquare = (p: IconProps) => <I {...p}><path d="M5 5.5h14v10H9l-4 3v-13Z"/></I>
export const HelpCircle = (p: IconProps) => <I {...p}><circle cx="12" cy="12" r="8.5"/><path d="M9.7 9.2a2.5 2.5 0 1 1 4.3 1.7c-1.1 1-2 1.3-2 2.6M12 17h.01"/></I>
