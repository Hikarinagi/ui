import { createSSRApp, type VNode } from 'vue'
import { renderToString as renderVueToString } from 'vue/server-renderer'
import type { ReactElement } from 'react'
import { renderToString as renderReactToString } from 'react-dom/server'

export function renderVue(render: () => VNode) {
  return renderVueToString(createSSRApp({ render }))
}

const RESOURCE_HINTS = /^(?:<link rel="preload" as="image"[^>]*\/>)+/

export function renderReact(render: () => ReactElement) {
  return renderReactToString(render()).replace(RESOURCE_HINTS, '')
}
