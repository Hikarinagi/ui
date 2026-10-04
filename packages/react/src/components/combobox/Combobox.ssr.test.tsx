import { expect, it } from 'vitest'
import { useState } from 'react'
import { renderToString } from 'react-dom/server'
import { Combobox } from './Combobox'

it.each([false, true])('renders the selected input label with virtualize=%s', async virtualize => {
  for (const remote of [false, true]) {
    const option = { value: 7890, label: 'Selected item' }
    function Harness() {
      const [search, setSearch] = useState('')
      return (
        <Combobox
          options={remote ? [] : [option]}
          selectedOption={remote ? option : undefined}
          virtualize={virtualize}
          value={option.value}
          search={search}
          onSearchChange={setSearch}
        />
      )
    }
    const html = renderToString(<Harness />)
    expect(html).toContain('value="Selected item"')
  }
})

it('keeps the placeholder when no item is selected', async () => {
  const html = renderToString(<Combobox options={[]} placeholder="Select an item" />)
  expect(html).toContain('placeholder="Select an item"')
  expect(html).not.toContain('value="undefined"')
})
