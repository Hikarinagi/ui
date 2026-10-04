export function fileNameOf(url: string, fallback = 'image'): string {
  try {
    const parsed = new URL(url, 'http://localhost')
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return fallback
    const name = decodeURIComponent(parsed.pathname.split('/').filter(Boolean).pop() ?? '')
    return name || fallback
  } catch {
    return fallback
  }
}

export async function saveImage(url: string): Promise<'saved' | 'opened'> {
  try {
    const response = await fetch(url, { mode: 'cors' })
    if (!response.ok) throw new Error(String(response.status))
    const blob = await response.blob()
    const href = URL.createObjectURL(blob)
    const anchor = Object.assign(document.createElement('a'), {
      href,
      download: fileNameOf(url),
    })
    anchor.click()
    setTimeout(() => URL.revokeObjectURL(href), 0)
    return 'saved'
  } catch {
    window.open(url, '_blank', 'noopener')
    return 'opened'
  }
}
