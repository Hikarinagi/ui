'use client'

import { Button, Editable, FormField, Stack, Tag } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-sm">
      <FormField label="发布版本">
        <Editable
          defaultValue="1.8.0"
          activationMode="manual"
          submitMode="manual"
          renderPreview={({ value }) => <Tag tone="info">v{value}</Tag>}
          renderActions={({ editing, saving, edit, submit, cancel }) =>
            editing ? (
              <>
                <Button size="sm" loading={saving} onClick={submit}>
                  保存版本
                </Button>
                <Button size="sm" variant="ghost" tone="neutral" disabled={saving} onClick={cancel}>
                  取消
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" tone="neutral" onClick={edit}>
                修改版本
              </Button>
            )
          }
        />
      </FormField>
    </Stack>
  )
}
