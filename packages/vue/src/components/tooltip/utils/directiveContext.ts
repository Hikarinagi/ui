import { isVNode, type AppContext, type ComponentInternalInstance, type VNode } from 'vue'

type ContextOwner = ComponentInternalInstance & { provides: AppContext['provides'] }

function findOwner(
  node: VNode,
  target: HTMLElement,
  owner: ComponentInternalInstance,
): ComponentInternalInstance | undefined {
  if (node.component) {
    return findOwner(node.component.subTree, target, node.component)
  }
  if (node.suspense) {
    for (const branch of [node.suspense.activeBranch, node.suspense.pendingBranch]) {
      const match = branch && findOwner(branch, target, owner)
      if (match) return match
    }
  }
  if (node.el === target) return owner
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      if (!isVNode(child)) continue
      const match = findOwner(child, target, owner)
      if (match) return match
    }
  }
}

export function directiveContext(owner: ComponentInternalInstance, target: HTMLElement) {
  const parent = (findOwner(owner.subTree, target, owner) ?? owner) as ContextOwner
  return { ...parent.appContext, provides: parent.provides }
}
