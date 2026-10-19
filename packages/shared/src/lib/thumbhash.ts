import { rgbaToDataURL, thumbHashToRGBA } from 'thumbhash'

export interface Thumbhash {
  url: string
  width: number
  height: number
}

export function decodeThumbhash(hash: string): Thumbhash | null {
  let binary: string
  try {
    binary = atob(hash.trim().replace(/-/g, '+').replace(/_/g, '/'))
  } catch {
    return null
  }
  if (binary.length < 5) return null
  const { w, h, rgba } = thumbHashToRGBA(Uint8Array.from(binary, char => char.charCodeAt(0)))
  return { url: rgbaToDataURL(w, h, rgba), width: w, height: h }
}

export function thumbhashToDataUrl(hash: string): string | null {
  return decodeThumbhash(hash)?.url ?? null
}
