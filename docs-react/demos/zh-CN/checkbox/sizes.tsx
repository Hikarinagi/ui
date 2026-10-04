import { Checkbox, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="sm">
      <Checkbox size="sm" checked>
        小号
      </Checkbox>
      <Checkbox size="md" checked>
        中号
      </Checkbox>
      <Checkbox size="lg" checked>
        大号
      </Checkbox>
    </Stack>
  )
}
