import { Card, Inline, Skeleton, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="w-full max-w-sm">
      <Stack gap="sm">
        <Skeleton className="h-32 w-full rounded-lg" />
        <Inline gap="sm" align="center">
          <Skeleton className="size-10 rounded-full" />
          <Stack gap="xs" className="flex-1">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </Stack>
        </Inline>
      </Stack>
    </Card>
  )
}
