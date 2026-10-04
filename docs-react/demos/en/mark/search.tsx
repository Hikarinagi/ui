import { Fragment } from 'react'
import { Mark, Stack, Text } from '@hina-ui/react'

const keyword = 'course'
const paragraph =
  'Volume one of Spice and Wolf follows a travelling merchant and a girl who calls herself a harvest deity.'
const parts = paragraph.split(keyword)

export default function Demo() {
  return (
    <Stack className="max-w-lg">
      <Text size="sm" tone="muted">
        Keyword: {keyword}
      </Text>
      <Text>
        {parts.map((part, index) => (
          <Fragment key={index}>
            {part} {index < parts.length - 1 && <Mark>{keyword}</Mark>}
          </Fragment>
        ))}
      </Text>
    </Stack>
  )
}
