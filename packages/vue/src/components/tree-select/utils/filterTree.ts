import type { TreeSelectNode } from '../types'

export function filterTree(nodes: TreeSelectNode[], matches: (node: TreeSelectNode) => boolean) {
  const children = new Map<TreeSelectNode, TreeSelectNode[]>()
  const expanded: string[] = []

  function visit(items: TreeSelectNode[]): TreeSelectNode[] {
    return items.filter(node => {
      const descendants = visit(node.children ?? [])
      if (descendants.length) {
        children.set(node, descendants)
        expanded.push(String(node.value))
      }
      return descendants.length > 0 || matches(node)
    })
  }

  return { items: visit(nodes), children, expanded }
}
