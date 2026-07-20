import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value?: number) {
  if (!value) return 'Request Quote'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

export function metricValue(metrics: { label: string; value: string }[], key: string, fallback: string) {
  return metrics.find((metric) => metric.label === key)?.value ?? fallback
}

export function getInitials(name?: string) {
  return (name || 'BL').split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

export function uid(_prefix = 'id') {
  return crypto.randomUUID()
}
