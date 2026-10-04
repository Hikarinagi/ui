import { Button, Inline, Tooltip, TooltipProvider } from '@hina-ui/react'

export default function Demo() {
  return (
    <TooltipProvider delayDuration={600} skipDelayDuration={0}>
      <Inline align="center" className="gap-6">
        <Tooltip content="Appears after 600 milliseconds">
          <Button variant="outline" tone="neutral">
            Slower
          </Button>
        </Tooltip>
        <Tooltip content="Also waits 600 milliseconds">
          <Button variant="outline" tone="neutral">
            Another one
          </Button>
        </Tooltip>
      </Inline>
    </TooltipProvider>
  )
}
