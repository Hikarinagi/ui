import { Stack, Switch } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="sm">
      <Switch invalid>必须开启才能继续</Switch>
      <Switch disabled>已禁用</Switch>
      <Switch disabled checked>
        已禁用且开启
      </Switch>
    </Stack>
  )
}
