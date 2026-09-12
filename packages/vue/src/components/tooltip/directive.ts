import { h, render, type AppContext, type DirectiveBinding, type ObjectDirective } from 'vue'
import TooltipDirectiveRoot from './TooltipDirectiveRoot'
import { directiveContext } from './utils/directiveContext'
import type { TooltipDirectiveOptions, TooltipDirectiveValue } from './types'

interface TooltipMount {
  container: HTMLElement
  context: AppContext
  revision: number
}

const mounts = new WeakMap<HTMLElement, TooltipMount>()
let nextId = 0

function options(value: TooltipDirectiveValue): TooltipDirectiveOptions {
  return typeof value === 'string' ? { content: value } : value ? { ...value } : { content: '' }
}

function update(target: HTMLElement, binding: DirectiveBinding<TooltipDirectiveValue>) {
  const mount = mounts.get(target)
  if (!mount) return
  const vnode = h(TooltipDirectiveRoot, {
    target,
    options: options(binding.value),
    revision: ++mount.revision,
  })
  vnode.appContext = mount.context
  render(vnode, mount.container)
}

export const vTooltip: ObjectDirective<HTMLElement, TooltipDirectiveValue> = {
  deep: true,
  mounted(target, binding) {
    const owner = binding.instance?.$
    if (!owner) return
    const context = directiveContext(owner, target)
    context.config = Object.create(context.config) as AppContext['config']
    context.config.idPrefix = 'hn-tooltip-' + ++nextId
    mounts.set(target, {
      container: target.ownerDocument.createElement('div'),
      context,
      revision: 0,
    })
    update(target, binding)
  },
  updated: update,
  beforeUnmount(target) {
    const mount = mounts.get(target)
    if (!mount) return
    render(null, mount.container)
    mounts.delete(target)
  },
  getSSRProps: () => ({}),
}
