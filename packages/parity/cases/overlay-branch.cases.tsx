import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

export default defineCases('OverlayBranch', [
  {
    name: 'OverlayBranch renders a div',
    vue: () => h(V.OverlayBranch, { id: 'guide', class: 'fixed' }, () => 'Guide'),
    react: () => (
      <R.OverlayBranch id="guide" className="fixed">
        Guide
      </R.OverlayBranch>
    ),
  },
  {
    name: 'OverlayBranch as a section',
    vue: () => h(V.OverlayBranch, { as: 'section' }, () => 'Guide'),
    react: () => <R.OverlayBranch as="section">Guide</R.OverlayBranch>,
  },
  {
    name: 'OverlayBranch asChild renders the child only',
    vue: () => h(V.OverlayBranch, { asChild: true }, () => h('aside', { id: 'guide' }, 'Guide')),
    react: () => (
      <R.OverlayBranch asChild>
        <aside id="guide">Guide</aside>
      </R.OverlayBranch>
    ),
  },
])
