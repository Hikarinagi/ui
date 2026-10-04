import { FileUpload } from '@hina-ui/react'

export default function Demo() {
  return (
    <FileUpload
      defaultValue={[]}
      multiple
      accept="image/*"
      aria-label="上传截图"
      className="w-96"
    />
  )
}
