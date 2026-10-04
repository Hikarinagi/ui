import { h } from 'vue'
import VLoadingOverlay from '@hina-ui/vue/components/loading-overlay/LoadingOverlay.vue'
import { LoadingOverlay } from '@hina-ui/react/components/loading-overlay/LoadingOverlay'
import { defineCases } from '../src/cases'

const host = { class: 'relative h-40' }

export default defineCases('LoadingOverlay', [
  {
    name: 'hidden renders nothing',
    vue: () => h('div', host, [h(VLoadingOverlay)]),
    react: () => (
      <div className="relative h-40">
        <LoadingOverlay />
      </div>
    ),
  },
  {
    name: 'visible inside the delay renders only the blocker',
    vue: () => h('div', host, [h(VLoadingOverlay, { visible: true })]),
    react: () => (
      <div className="relative h-40">
        <LoadingOverlay visible />
      </div>
    ),
  },
  {
    name: 'fixed blocker',
    vue: () => h('div', host, [h(VLoadingOverlay, { visible: true, fixed: true })]),
    react: () => (
      <div className="relative h-40">
        <LoadingOverlay visible fixed />
      </div>
    ),
  },
  {
    name: 'zero delay shows the overlay with the default spinner',
    vue: () => h('div', host, [h(VLoadingOverlay, { visible: true, delay: 0 })]),
    react: () => (
      <div className="relative h-40">
        <LoadingOverlay visible delay={0} />
      </div>
    ),
  },
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `text, size ${size} and class`,
    vue: () =>
      h('div', host, [
        h(VLoadingOverlay, {
          visible: true,
          delay: 0,
          text: '正在保存',
          size,
          class: 'rounded-lg',
        }),
      ]),
    react: () => (
      <div className="relative h-40">
        <LoadingOverlay visible delay={0} text="正在保存" size={size} className="rounded-lg" />
      </div>
    ),
  })),
  {
    name: 'fixed overlay',
    vue: () => h('div', host, [h(VLoadingOverlay, { visible: true, delay: 0, fixed: true })]),
    react: () => (
      <div className="relative h-40">
        <LoadingOverlay visible delay={0} fixed />
      </div>
    ),
  },
  {
    name: 'default slot replaces the spinner and text',
    vue: () =>
      h('div', host, [
        h(
          VLoadingOverlay,
          { visible: true, delay: 0, text: '忽略' },
          { default: () => h('span', { 'data-custom': '' }, '整理中') },
        ),
      ]),
    react: () => (
      <div className="relative h-40">
        <LoadingOverlay visible delay={0} text="忽略">
          <span data-custom="">整理中</span>
        </LoadingOverlay>
      </div>
    ),
  },
])
