export interface TreeSelectNode {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
  children?: TreeSelectNode[]
}

export function findNode(
  nodes: TreeSelectNode[],
  value: string | number | null | undefined,
): TreeSelectNode | undefined {
  for (const node of nodes) {
    if (node.value === value) return node
    const hit = node.children && findNode(node.children, value)
    if (hit) return hit
  }
  return undefined
}

export function pathTo(
  nodes: TreeSelectNode[],
  value: string | number | null | undefined,
  trail: Array<string | number> = [],
): Array<string | number> | null {
  for (const node of nodes) {
    if (node.value === value) return trail
    if (node.children) {
      const hit = pathTo(node.children, value, [...trail, node.value])
      if (hit) return hit
    }
  }
  return null
}
