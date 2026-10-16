import { expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { Tour } from './Tour'

const steps = [{ target: '#create', title: '新建', description: '从这里开始。' }]

it('renders nothing until the client mounts, open or closed', () => {
  for (const open of [false, true])
    expect(renderToString(<Tour steps={steps} open={open} />).replace(/<!--[\s\S]*?-->/g, '')).toBe(
      '',
    )
})
