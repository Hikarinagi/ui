'use client'

import { Button, toast } from '@hina-ui/react'

export default function Demo() {
  return (
    <Button
      variant="outline"
      tone="neutral"
      onClick={() =>
        toast.success('导入完成', {
          description: '共导入 128 本书，其中 3 本因格式不符被跳过。',
        })
      }
    >
      带说明的提示
    </Button>
  )
}
