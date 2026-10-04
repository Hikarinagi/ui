'use client'

import { Button, Inline, toast } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-3">
      <Button variant="outline" tone="neutral" onClick={() => toast('草稿已保存')}>
        默认
      </Button>
      <Button variant="outline" tone="neutral" onClick={() => toast.success('文章已发布')}>
        成功
      </Button>
      <Button
        variant="outline"
        tone="neutral"
        onClick={() => toast.danger('上传失败', { description: '文件超过 20 MB。' })}
      >
        失败
      </Button>
    </Inline>
  )
}
