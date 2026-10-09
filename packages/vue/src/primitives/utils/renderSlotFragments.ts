import { Fragment, type VNode } from 'vue'

export function renderSlotFragments(children?: VNode[]): VNode[] {
  if (!children) return []
  return children.flatMap(child =>
    child.type === Fragment ? renderSlotFragments(child.children as VNode[]) : [child],
  )
}
