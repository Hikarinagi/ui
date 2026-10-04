import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { contentTypes, sharedAssets, sharedPublic } from '~/lib/assets'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return sharedAssets().map(file => ({ path: file.split('/') }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const file = (await params).path.join('/')
  if (!sharedAssets().includes(file)) return new Response('Not found', { status: 404 })
  const body = await readFile(join(sharedPublic, file))
  return new Response(new Uint8Array(body), {
    headers: {
      'content-type': contentTypes[file.split('.').pop()!]!,
      'cache-control': 'public, max-age=86400',
    },
  })
}
