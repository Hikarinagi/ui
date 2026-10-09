export interface CollapsibleMotion {
  transitionDuration: string
  animationName: string
}

export function openState(open: unknown) {
  return open ? 'open' : 'closed'
}

export function measureCollapsibleContent(
  node: HTMLElement,
  saved: CollapsibleMotion | undefined,
  suppressed: boolean,
) {
  const motion = saved || {
    transitionDuration: node.style.transitionDuration,
    animationName: node.style.animationName,
  }
  node.style.transitionDuration = '0s'
  node.style.animationName = 'none'
  const rect = node.getBoundingClientRect()
  if (!suppressed) {
    node.style.transitionDuration = motion.transitionDuration
    node.style.animationName = motion.animationName
  }
  return { motion, width: rect.width, height: rect.height }
}

export function isCollapsibleContentRendered(present: boolean, unmountOnHide: boolean) {
  return unmountOnHide ? present : true
}
