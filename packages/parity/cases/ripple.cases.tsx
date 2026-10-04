import { h } from 'vue'
import VRipple from '@hina-ui/vue/components/ripple/Ripple.vue'
import { Ripple } from '@hina-ui/react/components/ripple/Ripple'
import { defineCases } from '../src/cases'

export default defineCases('Ripple', [
  {
    name: 'defaults',
    vue: () => h(VRipple),
    react: () => <Ripple />,
  },
  {
    name: 'class, style and attributes fall through to the root',
    vue: () =>
      h(VRipple, {
        disabled: true,
        class: 'rounded-full',
        style: { opacity: 0.5 },
        id: 'ripple',
        'data-testid': 'ripple',
        'aria-hidden': 'false',
      }),
    react: () => (
      <Ripple
        disabled
        className="rounded-full"
        style={{ opacity: 0.5 }}
        id="ripple"
        data-testid="ripple"
        aria-hidden="false"
      />
    ),
  },
])
