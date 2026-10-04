'use client'

import { Progress } from '@hina-ui/react'

const format = (value: number, max: number) => `${value} of ${max} files`

export default function Demo() {
  return <Progress value={3} max={8} label="Processed" showValue format={format} className="w-80" />
}
