import { h } from 'vue'
import type { FunctionalComponent } from 'vue'
import type { SimpleIcon } from 'simple-icons'

const BrandIcon: FunctionalComponent<{ icon: SimpleIcon }> = props =>
  h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true' }, [
    h('path', { d: props.icon.path }),
  ])

BrandIcon.props = { icon: { type: Object, required: true } }

export default BrandIcon
