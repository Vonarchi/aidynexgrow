import type { CSSProperties, ReactNode } from 'react'
import type { TenantTheme } from '../../types/website'

type TenantThemeProviderProps = {
  theme: TenantTheme
  children: ReactNode
}

type TenantThemeStyles = CSSProperties & {
  '--tenant-primary': string
  '--tenant-secondary': string
  '--tenant-accent': string
  '--tenant-background': string
  '--tenant-surface': string
  '--tenant-foreground': string
  '--tenant-heading-font': string
  '--tenant-body-font': string
  '--tenant-button-radius': string
  '--tenant-card-radius': string
}

export function TenantThemeProvider({ theme, children }: TenantThemeProviderProps) {
  const style: TenantThemeStyles = {
    '--tenant-primary': theme.primary,
    '--tenant-secondary': theme.secondary,
    '--tenant-accent': theme.accent,
    '--tenant-background': theme.background ?? '#fffbf5',
    '--tenant-surface': '#fff7ea',
    '--tenant-foreground': theme.foreground ?? '#2d2a32',
    '--tenant-heading-font': theme.headingFont,
    '--tenant-body-font': theme.bodyFont,
    '--tenant-button-radius': theme.buttonRadius ?? '999px',
    '--tenant-card-radius': theme.cardRadius ?? '24px',
    fontFamily: 'var(--tenant-body-font)',
  }

  return <div style={style}>{children}</div>
}
