import { Heading, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-lg">
      <Heading level={3} weight="semibold">
        Semibold, the default
      </Heading>
      <Heading level={3} weight="medium">
        Medium weight
      </Heading>
      <Heading level={3} weight="normal">
        Regular weight
      </Heading>
    </Stack>
  )
}
