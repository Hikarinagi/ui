import { h } from 'vue'
import type { FunctionalComponent } from 'vue'
import type { BrandGlyph } from '~/components/docs/brands'

const BrandIcon: FunctionalComponent<{ icon: BrandGlyph }> = props =>
  h(
    'svg',
    { viewBox: props.icon.viewBox ?? '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true' },
    [h('path', { d: props.icon.path })],
  )

BrandIcon.props = { icon: { type: Object, required: true } }

export default BrandIcon
