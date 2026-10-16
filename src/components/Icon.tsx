import type { ReactNode } from 'react'

type IconName = 'home' | 'clock' | 'chart' | 'settings' | 'plus' | 'arrow-up' | 'arrow-down' | 'chevron-right' | 'shopping-bag' | 'wallet' | 'car' | 'play' | 'coffee' | 'close' | 'sliders'

const paths: Record<IconName, ReactNode> = {
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  chart: <><path d="M4 20V10m6 10V4m6 16v-7m4 7H2" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.73 2.73-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-3.86v-.09a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-2.73-2.73.06-.06A1.7 1.7 0 0 0 4.94 15a1.7 1.7 0 0 0-1.56-1.03H3.3v-3.86h.08a1.7 1.7 0 0 0 1.56-1.03A1.7 1.7 0 0 0 4.6 7.2l-.06-.06 2.73-2.73.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.56V3.16h3.86v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.73 2.73-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.03h.08v3.86h-.08A1.7 1.7 0 0 0 19.4 15Z" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  'arrow-up': <path d="m6 10 6-6 6 6M12 4v16" />,
  'arrow-down': <path d="m18 14-6 6-6-6m6 6V4" />,
  'chevron-right': <path d="m9 18 6-6-6-6" />,
  'shopping-bag': <><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
  wallet: <><path d="M4 7a2 2 0 0 1 2-2h12v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" /><path d="M4 8h13v5h-4a2 2 0 0 0 0 4h4" /></>,
  car: <><path d="m5 17-1-5 2-5h12l2 5-1 5H5Z" /><path d="M5 12h14M7 17v2m10-2v2" /><circle cx="7" cy="14.5" r=".5" fill="currentColor" /><circle cx="17" cy="14.5" r=".5" fill="currentColor" /></>,
  play: <><rect x="4" y="4" width="16" height="16" rx="4" /><path d="m10 8 5 4-5 4V8Z" /></>,
  coffee: <><path d="M4 8h12v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z" /><path d="M16 10h1a3 3 0 0 1 0 6h-1M7 4v2m3-2v2m3-2v2" /></>,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  sliders: <><path d="M4 7h16M4 17h16M8 4v6m8 4v6" /></>,
}

export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}
