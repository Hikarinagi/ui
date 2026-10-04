import { Checkbox, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="sm">
      <Checkbox size="sm" checked>
        Small
      </Checkbox>
      <Checkbox size="md" checked>
        Medium
      </Checkbox>
      <Checkbox size="lg" checked>
        Large
      </Checkbox>
    </Stack>
  )
}
