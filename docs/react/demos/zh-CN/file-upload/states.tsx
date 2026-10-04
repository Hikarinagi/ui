import { ImagePlus } from 'lucide-react'
import { FileUpload, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack align="stretch" className="w-96">
      <FileUpload invalid aria-label="校验未通过" />
      <FileUpload disabled aria-label="已禁用" />
      <FileUpload loading aria-label="上传中">
        上传中
      </FileUpload>
      <FileUpload aria-label="上传图片" className="aspect-square w-40" icon={<ImagePlus />}>
        添加图片
      </FileUpload>
    </Stack>
  )
}
