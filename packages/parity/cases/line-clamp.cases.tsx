import { h } from 'vue'
import VLineClamp from '@hina-ui/vue/components/line-clamp/LineClamp.vue'
import VText from '@hina-ui/vue/components/text/Text.vue'
import { LineClamp } from '@hina-ui/react/components/line-clamp/LineClamp'
import { Text } from '@hina-ui/react/components/text/Text'
import { defineCases } from '../src/cases'

const intro = '行商罗伦斯在马车上发现了一位自称贤狼的少女，两人结伴北上。'

export default defineCases('LineClamp', [
  {
    name: 'default',
    vue: () => h(VLineClamp, null, () => intro),
    react: () => <LineClamp>{intro}</LineClamp>,
  },
  {
    name: 'lines and class',
    vue: () => h(VLineClamp, { lines: 2, class: 'max-w-md' }, () => intro),
    react: () => (
      <LineClamp lines={2} className="max-w-md">
        {intro}
      </LineClamp>
    ),
  },
  {
    name: 'expanded',
    vue: () => h(VLineClamp, { expanded: true }, () => intro),
    react: () => <LineClamp expanded>{intro}</LineClamp>,
  },
  {
    name: 'block content',
    vue: () =>
      h(VLineClamp, { lines: 4 }, () => [
        h(VText, { tone: 'muted' }, () => intro),
        h(VText, { tone: 'muted' }, () => intro),
      ]),
    react: () => (
      <LineClamp lines={4}>
        <Text tone="muted">{intro}</Text>
        <Text tone="muted">{intro}</Text>
      </LineClamp>
    ),
  },
  {
    name: 'invalid lines fall back',
    vue: () => h(VLineClamp, { lines: 0 }, () => intro),
    react: () => <LineClamp lines={0}>{intro}</LineClamp>,
  },
  {
    name: 'fallthrough attributes',
    vue: () => h(VLineClamp, { id: 'intro', 'data-test': 'x' }, () => intro),
    react: () => (
      <LineClamp id="intro" data-test="x">
        {intro}
      </LineClamp>
    ),
  },
])
