import { Skeleton, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="sm" className="w-full max-w-sm">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </Stack>
  )
}
