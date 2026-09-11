import { Fragment, type VNode } from 'vue'

export function flattenChildren(nodes: VNode[] | undefined): VNode[] {
  return (nodes ?? []).flatMap(node =>
    node.type === Fragment ? flattenChildren(node.children as VNode[]) : [node],
  )
}
