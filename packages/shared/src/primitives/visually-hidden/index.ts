export type VisuallyHiddenFeature = 'focusable' | 'fully-hidden'

export const VISUALLY_HIDDEN_STYLE = {
  position: 'absolute',
  border: 0,
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  wordWrap: 'normal',
  top: '-1px',
  left: '-1px',
} as const

export function isAriaHidden(feature: VisuallyHiddenFeature) {
  return feature === 'focusable' || feature === 'fully-hidden'
}

export function isFullyHidden(feature: VisuallyHiddenFeature) {
  return feature === 'fully-hidden'
}
