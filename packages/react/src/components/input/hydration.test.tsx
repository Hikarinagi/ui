import { expect, it } from 'vitest'
import { act } from 'react'
import { renderToString } from 'react-dom/server'
import { hydrateRoot } from 'react-dom/client'
import { Input } from './Input'
import { Textarea } from '../textarea/Textarea'

it('hydrated inputs keep the server-rendered value', async () => {
  const ui = (
    <div>
      <Input defaultValue="hina" />
      <Textarea defaultValue="shion" />
    </div>
  )
  const host = document.createElement('div')
  host.innerHTML = renderToString(ui)
  document.body.appendChild(host)
  await act(async () => {
    hydrateRoot(host, ui)
  })
  await act(async () => {})
  expect(host.querySelector('input')!.value).toBe('hina')
  expect(host.querySelector('textarea')!.value).toBe('shion')
})
