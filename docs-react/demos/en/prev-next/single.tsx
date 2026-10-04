import { PrevNext, PrevNextLink, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="lg" className="w-full max-w-2xl">
      <Stack gap="sm">
        <Text size="sm" tone="faint">
          Next only
        </Text>
        <PrevNext>
          <PrevNextLink direction="next" href="#">
            Chapter 1 The Summer Door
          </PrevNextLink>
        </PrevNext>
      </Stack>

      <Stack gap="sm">
        <Text size="sm" tone="faint">
          Previous only
        </Text>
        <PrevNext>
          <PrevNextLink direction="prev" href="#">
            Chapter 12 Finale
          </PrevNextLink>
        </PrevNext>
      </Stack>
    </Stack>
  )
}
