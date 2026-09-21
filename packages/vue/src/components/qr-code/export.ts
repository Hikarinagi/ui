import type { QRCodeExportOptions } from './types'

function dataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

export async function exportQRCode(
  svg: SVGSVGElement,
  size: number,
  { type = 'image/png', scale = 2 }: QRCodeExportOptions = {},
): Promise<Blob> {
  const clone = svg.cloneNode(true) as SVGSVGElement
  const source = [svg, ...svg.querySelectorAll('*')]
  const target = [clone, ...clone.querySelectorAll('*')]
  target.forEach((el, index) => {
    const style = getComputedStyle(source[index]!)
    el.removeAttribute('class')
    el.removeAttribute('style')
    el.setAttribute('fill', style.fill)
  })
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('width', String(size))
  clone.setAttribute('height', String(size))
  for (const image of clone.querySelectorAll('image')) {
    const href = image.getAttribute('href')
    if (!href) continue
    let embedded = href
    if (!href.startsWith('data:')) {
      const response = await fetch(new URL(href, svg.ownerDocument.baseURI))
      if (!response.ok) throw new Error('Unable to export the QR code logo')
      embedded = await dataURL(await response.blob())
    }
    const decoded = new Image()
    decoded.src = embedded
    await decoded.decode()
    image.setAttribute('href', embedded)
  }
  const blob = new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' })
  if (type === 'image/svg+xml') return blob
  const url = URL.createObjectURL(blob)
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    const factor = Number.isFinite(scale) ? Math.max(1, Math.min(8, scale)) : 2
    const canvas = svg.ownerDocument.createElement('canvas')
    canvas.width = canvas.height = Math.min(8192, Math.round(size * factor))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas is unavailable')
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        result => (result ? resolve(result) : reject(new Error('Unable to export the QR code'))),
        'image/png',
      )
    })
  } finally {
    URL.revokeObjectURL(url)
  }
}
