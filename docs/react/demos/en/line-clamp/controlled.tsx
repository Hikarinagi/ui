'use client'

import { useState } from 'react'
import { Button, LineClamp, Stack } from '@hina-ui/react'

export default function Demo() {
  const [expanded, setExpanded] = useState(false)

  return (
    <Stack className="w-full max-w-md">
      <Button
        variant="outline"
        tone="neutral"
        size="sm"
        className="self-start"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Fold the synopsis' : 'Expand the synopsis'}
      </Button>
      <LineClamp expanded={expanded} onExpandedChange={setExpanded} lines={2}>
        Only one observer is left at the weather station on the summit. At six every morning he
        copies the night's wind speed and pressure into the log, then radios them down to the town
        below. The first snow of winter closes the mountain road, and the voice at the other end of
        the radio is replaced by a stranger's, claiming to speak from the same station thirty years
        ago.
      </LineClamp>
    </Stack>
  )
}
