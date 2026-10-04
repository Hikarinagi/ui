import { HoverCard, Inline, Link, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="lg">
      <HoverCard
        openDelay={0}
        closeDelay={0}
        content={<Text size="sm">没有延时，指针一到就出现。</Text>}
      >
        <Link href="#">立即浮出</Link>
      </HoverCard>
      <HoverCard
        openDelay={800}
        closeDelay={400}
        content={<Text size="sm">停留 800 毫秒才出现，移开 400 毫秒后收回。</Text>}
      >
        <Link href="#">停留久一点</Link>
      </HoverCard>
    </Inline>
  )
}
