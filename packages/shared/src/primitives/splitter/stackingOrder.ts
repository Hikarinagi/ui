import { assert } from './assert'

export function compare(a: HTMLElement, b: HTMLElement): number {
  if (a === b) throw new Error('Cannot compare node with itself')
  const ancestors = {
    a: getAncestors(a),
    b: getAncestors(b),
  }
  let commonAncestor: HTMLElement | undefined
  while (ancestors.a.at(-1) === ancestors.b.at(-1)) {
    a = ancestors.a.pop() as HTMLElement
    b = ancestors.b.pop() as HTMLElement
    commonAncestor = a
  }
  assert(commonAncestor)
  const zIndexes = {
    a: getZIndex(findStackingContext(ancestors.a)),
    b: getZIndex(findStackingContext(ancestors.b)),
  }
  if (zIndexes.a === zIndexes.b) {
    const children = commonAncestor.childNodes
    const furthestAncestors = {
      a: ancestors.a.at(-1),
      b: ancestors.b.at(-1),
    }
    let i = children.length
    while (i--) {
      const child = children[i]
      if (child === furthestAncestors.a) return 1
      if (child === furthestAncestors.b) return -1
    }
  }
  return Math.sign(zIndexes.a - zIndexes.b)
}

const props =
  /\b(?:position|zIndex|opacity|transform|webkitTransform|mixBlendMode|filter|webkitFilter|isolation)\b/

function isFlexItem(node: HTMLElement) {
  const display = getComputedStyle(getParent(node) as HTMLElement).display
  return display === 'flex' || display === 'inline-flex'
}

function createsStackingContext(node: HTMLElement) {
  const style = getComputedStyle(node)
  if (style.position === 'fixed') return true
  if (style.zIndex !== 'auto' && (style.position !== 'static' || isFlexItem(node))) return true
  if (+style.opacity < 1) return true
  if ('transform' in style && style.transform !== 'none') return true
  if ('webkitTransform' in style && style.webkitTransform !== 'none') return true
  if ('mixBlendMode' in style && style.mixBlendMode !== 'normal') return true
  if ('filter' in style && style.filter !== 'none') return true
  if ('webkitFilter' in style && (style as { webkitFilter?: string }).webkitFilter !== 'none')
    return true
  if ('isolation' in style && style.isolation === 'isolate') return true
  if (props.test(style.willChange)) return true
  if ((style as { webkitOverflowScrolling?: string }).webkitOverflowScrolling === 'touch')
    return true
  return false
}

function findStackingContext(nodes: HTMLElement[]) {
  let i = nodes.length
  while (i--) {
    const node = nodes[i]
    assert(node)
    if (createsStackingContext(node)) return node
  }
  return null
}

function getZIndex(node: HTMLElement | null) {
  return (node && Number(getComputedStyle(node).zIndex)) || 0
}

function getAncestors(node: HTMLElement | null) {
  const ancestors: HTMLElement[] = []
  while (node) {
    ancestors.push(node)
    node = getParent(node)
  }
  return ancestors
}

function getParent(node: HTMLElement) {
  return ((node.parentNode instanceof DocumentFragment && (node.parentNode as ShadowRoot)?.host) ||
    node.parentNode) as HTMLElement | null
}
