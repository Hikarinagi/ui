import { h } from 'vue'
import VToaster from '@hina-ui/vue/components/toast/Toaster.vue'
import * as vueStore from '@hina-ui/vue/components/toast/store'
import { Toaster } from '@hina-ui/react/components/toast/Toaster'
import * as reactStore from '@hina-ui/react/components/toast/store'
import { defineCases } from '../src/cases'

const positions = [
  'top-start',
  'top-center',
  'top-end',
  'bottom-start',
  'bottom-center',
  'bottom-end',
] as const

export default defineCases('Toast', [
  {
    name: 'toaster renders nothing on the server',
    vue: () => h('div', { 'data-host': '' }, [h(VToaster)]),
    react: () => (
      <div data-host="">
        <Toaster />
      </div>
    ),
  },
  ...positions.map(position => ({
    name: `toaster at ${position} renders nothing on the server`,
    vue: () => h('div', { 'data-host': '' }, [h(VToaster, { position, label: 'Alerts' })]),
    react: () => (
      <div data-host="">
        <Toaster position={position} label="Alerts" />
      </div>
    ),
  })),
  {
    name: 'queued toasts stay client-only',
    vue: () => {
      vueStore.toastState.items.splice(0)
      vueStore.toast.success('已保存', { id: 'ssr', duration: 0, description: '服务端不渲染' })
      return h('div', { 'data-host': '' }, [h(VToaster)])
    },
    react: () => {
      reactStore.toastState.items.splice(0)
      reactStore.toast.success('已保存', { id: 'ssr', duration: 0, description: '服务端不渲染' })
      return (
        <div data-host="">
          <Toaster />
        </div>
      )
    },
  },
])
