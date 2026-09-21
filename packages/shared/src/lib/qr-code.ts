import { encode } from 'uqr'

export type QRCodeLevel = 'L' | 'M' | 'Q' | 'H'

export interface QRCodeGeometry {
  size: number
  path: string
}

export function qrCodeGeometry(
  value: string,
  level: QRCodeLevel = 'M',
  margin = 4,
): QRCodeGeometry {
  const border = Number.isFinite(margin) ? Math.max(0, Math.min(64, Math.trunc(margin))) : 4
  const matrix = encode(value, { ecc: level, border, boostEcc: false })
  const runs: string[] = []
  for (let y = 0; y < matrix.size; y++) {
    const row = matrix.data[y]!
    for (let x = 0; x < matrix.size; x++) {
      if (!row[x]) continue
      const start = x
      while (x + 1 < matrix.size && row[x + 1]) x++
      runs.push(`M${start} ${y}h${x - start + 1}v1H${start}z`)
    }
  }
  return { size: matrix.size, path: runs.join('') }
}

export function qrCodeSize(value: number): number {
  return Number.isFinite(value) && value > 0 ? Math.min(4096, value) : 192
}
