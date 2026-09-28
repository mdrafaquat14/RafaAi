import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const I = (props: P) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props} />
export const PlusIcon = (p:P)=><I {...p}><path d="M12 5v14M5 12h14"/></I>
export const SearchIcon = (p:P)=><I {...p}><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></I>
export const MenuIcon = (p:P)=><I {...p}><path d="M4 7h16M4 12h16M4 17h16"/></I>
export const SunIcon = (p:P)=><I {...p}><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></I>
export const MoonIcon = (p:P)=><I {...p}><path d="M20.5 14.2A8.4 8.4 0 0 1 9.8 3.5 8.7 8.7 0 1 0 20.5 14.2Z"/></I>
export const ArrowUpIcon = (p:P)=><I {...p}><path d="M12 19V5M6.5 10.5 12 5l5.5 5.5"/></I>
export const PaperclipIcon = (p:P)=><I {...p}><path d="m20.5 11.5-8.1 8.1a5 5 0 0 1-7.1-7.1l8.6-8.6a3.5 3.5 0 0 1 5 5l-8.7 8.7a2 2 0 0 1-2.8-2.8l8.1-8.1"/></I>
export const ImageIcon = (p:P)=><I {...p}><rect x="3.5" y="4" width="17" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.4"/><path d="m4.5 17 4.5-4.5 3.5 3 2.5-2.5 4 4"/></I>
export const CopyIcon = (p:P)=><I {...p}><rect x="8" y="8" width="11" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2"/></I>
export const RefreshIcon = (p:P)=><I {...p}><path d="M20 11a8 8 0 0 0-14.8-4L3 10"/><path d="M3 5v5h5M4 13a8 8 0 0 0 14.8 4L21 14"/><path d="M21 19v-5h-5"/></I>
export const ThumbsUpIcon = (p:P)=><I {...p}><path d="M7 10v10H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h3ZM7 20h9.3a2.5 2.5 0 0 0 2.4-1.8l1.7-6A2.5 2.5 0 0 0 18 9h-4l.5-3.1A2.4 2.4 0 0 0 12.1 3L7 10v10Z"/></I>
export const ThumbsDownIcon = (p:P)=><I {...p}><path d="M7 14V4H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3ZM7 4h9.3a2.5 2.5 0 0 1 2.4 1.8l1.7 6a2.5 2.5 0 0 1-2.4 3.2h-4l.5 3.1a2.4 2.4 0 0 1-2.4 2.9L7 14V4Z"/></I>
export const XIcon = (p:P)=><I {...p}><path d="m6 6 12 12M18 6 6 18"/></I>
export const LogOutIcon = (p:P)=><I {...p}><path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/></I>
export const ChevronDownIcon = (p:P)=><I {...p}><path d="m6 9 6 6 6-6"/></I>
export const TrashIcon = (p:P)=><I {...p}><path d="M4 7h16M9 11v6M15 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></I>
export const EditIcon = (p:P)=><I {...p}><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z"/><path d="m14.5 7.5 2 2"/></I>
export const SparkIcon = (p:P)=><I {...p}><path d="m12 3-1.2 5.1L6 9.5l4.8 1.4L12 16l1.2-5.1L18 9.5l-4.8-1.4L12 3ZM19 16l-.6 2.4L16 19l2.4.6L19 22l.6-2.4L22 19l-2.4-.6L19 16ZM5 3l-.5 2L3 5.5 4.5 6 5 8l.5-2L7 5.5 5.5 5 5 3Z"/></I>
export const CheckIcon = (p:P)=><I {...p}><path d="m5 12 4 4L19 6"/></I>
export const StopIcon = (p:P)=><I {...p}><rect x="7" y="7" width="10" height="10" rx="2"/></I>
