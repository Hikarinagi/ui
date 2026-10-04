import { Button, Inline, Tooltip, TooltipProvider } from '@hina-ui/react'

export default function Demo() {
  return (
    <TooltipProvider delayDuration={600} skipDelayDuration={0}>
      <Inline align="center" className="gap-6">
        <Tooltip content="等待 600 毫秒后出现">
          <Button variant="outline" tone="neutral">
            慢一点
          </Button>
        </Tooltip>
        <Tooltip content="同样等待 600 毫秒">
          <Button variant="outline" tone="neutral">
            再一个
          </Button>
        </Tooltip>
      </Inline>
    </TooltipProvider>
  )
}
