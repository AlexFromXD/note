import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Q: 看起來是簡化語法 & 解 css 衝突用的，但沒有每個地方都呼叫？
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
