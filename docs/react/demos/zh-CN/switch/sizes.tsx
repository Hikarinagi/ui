import { Stack, Switch } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="sm">
      <Switch size="sm" checked>
        小号
      </Switch>
      <Switch size="md" checked>
        中号
      </Switch>
      <Switch size="lg" checked>
        大号
      </Switch>
    </Stack>
  )
}
