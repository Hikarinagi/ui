import { Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-lg">
      <Text size="sm">
        sm 父级文字，{' '}
        <Text as="span" size="inherit" tone="accent">
          继承字号和行高
        </Text>{' '}
        。
      </Text>
      <Text size="base">
        base 父级文字，{' '}
        <Text as="span" size="inherit" tone="accent">
          继承字号和行高
        </Text>{' '}
        。
      </Text>
      <Text size="xl">
        xl 父级文字，{' '}
        <Text as="span" size="inherit" tone="accent">
          继承字号和行高
        </Text>{' '}
        。
      </Text>
    </Stack>
  )
}
