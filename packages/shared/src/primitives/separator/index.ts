export type SeparatorOrientation = 'horizontal' | 'vertical'

export function separatorOrientation(orientation: unknown): SeparatorOrientation {
  return orientation === 'vertical' ? 'vertical' : 'horizontal'
}

export function separatorSemantics(orientation: SeparatorOrientation, decorative?: boolean) {
  return decorative
    ? { role: 'none' as const }
    : {
        'aria-orientation': orientation === 'vertical' ? orientation : undefined,
        role: 'separator' as const,
      }
}
