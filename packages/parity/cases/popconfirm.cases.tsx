import { h } from 'vue'
import VPopconfirm from '@hina-ui/vue/components/popconfirm/Popconfirm.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import { Popconfirm } from '@hina-ui/react/components/popconfirm/Popconfirm'
import { Button } from '@hina-ui/react/components/button/Button'
import { defineCases, type ParityCase } from '../src/cases'

const sides = ['top', 'right', 'bottom', 'left'] as const
const aligns = ['start', 'center', 'end'] as const

const placements: ParityCase[] = sides.flatMap(side =>
  aligns.map(align => ({
    name: `trigger press origin for ${side} ${align}`,
    vue: () => h(VPopconfirm, { title: 'Delete?', side, align }, () => h(VButton, () => 'Delete')),
    react: () => (
      <Popconfirm title="Delete?" side={side} align={align}>
        <Button>Delete</Button>
      </Popconfirm>
    ),
  })),
)

export default defineCases('Popconfirm', [
  {
    name: 'closed trigger with dialog wiring',
    vue: () =>
      h(VPopconfirm, { title: 'Delete this comment?', description: 'This cannot be undone.' }, () =>
        h(VButton, { variant: 'outline', tone: 'neutral' }, () => 'Delete'),
      ),
    react: () => (
      <Popconfirm title="Delete this comment?" description="This cannot be undone.">
        <Button variant="outline" tone="neutral">
          Delete
        </Button>
      </Popconfirm>
    ),
  },
  ...placements,
  {
    name: 'danger tone with custom texts and class',
    vue: () =>
      h(
        VPopconfirm,
        {
          title: 'Delete?',
          tone: 'danger',
          confirmText: 'Delete',
          cancelText: 'Keep',
          class: 'w-80',
        },
        () => h(VButton, () => 'Delete'),
      ),
    react: () => (
      <Popconfirm
        title="Delete?"
        tone="danger"
        confirmText="Delete"
        cancelText="Keep"
        className="w-80"
      >
        <Button>Delete</Button>
      </Popconfirm>
    ),
  },
  {
    name: 'controlled open renders only the trigger on the server',
    vue: () => h(VPopconfirm, { title: 'Delete?', open: true }, () => h(VButton, () => 'Delete')),
    react: () => (
      <Popconfirm title="Delete?" open>
        <Button>Delete</Button>
      </Popconfirm>
    ),
  },
])
