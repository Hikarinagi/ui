'use client'

import { Progress } from '@hina-ui/react'

const format = (value: number, max: number) => `${value} / ${max} 个文件`

export default function Demo() {
  return <Progress value={3} max={8} label="已处理" showValue format={format} className="w-80" />
}
