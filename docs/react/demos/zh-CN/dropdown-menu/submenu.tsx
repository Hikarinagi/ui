import { Download, Share2 } from 'lucide-react'
import {
  Button,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
} from '@hina-ui/react'

export default function Demo() {
  return (
    <DropdownMenu
      label="文件操作"
      align="start"
      content={
        <>
          <DropdownMenuItem>重命名</DropdownMenuItem>
          <DropdownMenuSub label="分享给" icon={<Share2 />}>
            <DropdownMenuItem>复制链接</DropdownMenuItem>
            <DropdownMenuItem>发送到邮箱</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>邀请协作者</DropdownMenuItem>
          </DropdownMenuSub>
          <DropdownMenuSub label="导出为" icon={<Download />}>
            <DropdownMenuItem>PDF</DropdownMenuItem>
            <DropdownMenuItem>EPUB</DropdownMenuItem>
            <DropdownMenuItem>纯文本</DropdownMenuItem>
          </DropdownMenuSub>
        </>
      }
    >
      <Button variant="outline" tone="neutral">
        文件
      </Button>
    </DropdownMenu>
  )
}
