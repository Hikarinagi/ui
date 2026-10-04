import { ImagePlus } from 'lucide-react'
import { FileUpload, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack align="stretch" className="w-96">
      <FileUpload invalid aria-label="Invalid" />
      <FileUpload disabled aria-label="Disabled" />
      <FileUpload loading aria-label="Uploading">
        Uploading
      </FileUpload>
      <FileUpload aria-label="Add image" className="aspect-square w-40" icon={<ImagePlus />}>
        Add image
      </FileUpload>
    </Stack>
  )
}
