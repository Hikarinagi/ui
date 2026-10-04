export type TreeValue = string | number

export interface TreeNode {
  value: TreeValue
  label: string
  description?: string
  disabled?: boolean
  children?: TreeNode[]
}

export interface TreeNodeState {
  selected: boolean
  indeterminate: boolean
  disabled: boolean
}

export interface TreeNodeSlot extends TreeNodeState {
  node: TreeNode
  expanded: boolean
}
