import { Heading, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-lg">
      <Heading level={3} size="2xl">
        Level 3 tag, level 1 size
      </Heading>
      <Heading level={1} size="base">
        Level 1 tag, body size
      </Heading>
    </Stack>
  )
}
