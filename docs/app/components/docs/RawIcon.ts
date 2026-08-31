import { h } from 'vue'
import type { FunctionalComponent } from 'vue'

const RawIcon: FunctionalComponent<{ svg: string }> = props =>
  h('span', { class: 'inline-flex shrink-0', 'aria-hidden': 'true', innerHTML: props.svg })

RawIcon.props = { svg: { type: String, required: true } }

export default RawIcon
