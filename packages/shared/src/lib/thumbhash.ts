import { thumbHashToDataURL } from 'thumbhash'

export function thumbhashToDataUrl(hash: string): string | null {
  let binary: string
  try {
    binary = atob(hash.trim().replace(/-/g, '+').replace(/_/g, '/'))
  } catch {
    return null
  }
  if (binary.length < 5) return null
  return thumbHashToDataURL(Uint8Array.from(binary, char => char.charCodeAt(0)))
}
