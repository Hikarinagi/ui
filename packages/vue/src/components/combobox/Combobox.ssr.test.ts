import { expect, it } from 'vitest'
import { createSSRApp, h, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Combobox from './Combobox.vue'

it.each([false, true])('renders the selected input label with virtualize=%s', async virtualize => {
  for (const remote of [false, true]) {
    const option = { value: 7890, label: 'Selected item' }
    const search = ref('')
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(Combobox, {
            options: remote ? [] : [option],
            selectedOption: remote ? option : undefined,
            virtualize,
            modelValue: option.value,
            search: search.value,
            'onUpdate:search': value => (search.value = value),
          }),
      }),
    )
    expect(html).toContain('value="Selected item"')
  }
})

it('keeps the placeholder when no item is selected', async () => {
  const html = await renderToString(
    createSSRApp({ render: () => h(Combobox, { options: [], placeholder: 'Select an item' }) }),
  )
  expect(html).toContain('placeholder="Select an item"')
  expect(html).not.toContain('value="undefined"')
})
