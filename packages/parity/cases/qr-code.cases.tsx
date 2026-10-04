import { h } from 'vue'
import VQRCode from '@hina-ui/vue/components/qr-code/QRCode.vue'
import { QRCode } from '@hina-ui/react/components/qr-code/QRCode'
import type { QRCodeStatusSlot } from '@hina-ui/react/components/qr-code/types'
import { defineCases } from '../src/cases'

const value = 'https://hinaui.dev/guide/installation'
const logo = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%2F%3E'
const statusView = ({ status, error }: QRCodeStatusSlot) => `${status}/${!!error}`

export default defineCases('QRCode', [
  {
    name: 'active code with label and size',
    vue: () => h(VQRCode, { value, label: 'Share link', size: 240 }),
    react: () => <QRCode value={value} label="Share link" size={240} />,
  },
  {
    name: 'default label and size',
    vue: () => h(VQRCode, { value }),
    react: () => <QRCode value={value} />,
  },
  ...(['L', 'M', 'Q', 'H'] as const).map(level => ({
    name: `correction level ${level}`,
    vue: () => h(VQRCode, { value: 'https://hinaui.dev/搜索?q=光', level }),
    react: () => <QRCode value="https://hinaui.dev/搜索?q=光" level={level} />,
  })),
  {
    name: 'margin, colors and no border',
    vue: () =>
      h(VQRCode, {
        value,
        margin: 0,
        color: 'var(--hn-accent-text)',
        background: 'white',
        bordered: false,
      }),
    react: () => (
      <QRCode
        value={value}
        margin={0}
        color="var(--hn-accent-text)"
        background="white"
        bordered={false}
      />
    ),
  },
  {
    name: 'invalid size falls back',
    vue: () => h(VQRCode, { value, size: -1 }),
    react: () => <QRCode value={value} size={-1} />,
  },
  {
    name: 'logo raises the correction level and clears its area',
    vue: () => h(VQRCode, { value, logo }),
    react: () => <QRCode value={value} logo={logo} />,
  },
  {
    name: 'logo with custom size and margin',
    vue: () => h(VQRCode, { value, logo, logoSize: 48, logoMargin: 6, size: 256, level: 'Q' }),
    react: () => (
      <QRCode value={value} logo={logo} logoSize={48} logoMargin={6} size={256} level="Q" />
    ),
  },
  {
    name: 'zero logo size omits the logo',
    vue: () => h(VQRCode, { value, logo, logoSize: 0 }),
    react: () => <QRCode value={value} logo={logo} logoSize={0} />,
  },
  {
    name: 'unsafe payload is encoded, not injected',
    vue: () => h(VQRCode, { value: '<script>alert("unsafe")</script>' }),
    react: () => <QRCode value={'<script>alert("unsafe")</script>'} />,
  },
  {
    name: 'loading status',
    vue: () => h(VQRCode, { value, status: 'loading' }),
    react: () => <QRCode value={value} status="loading" />,
  },
  ...(['expired', 'scanned'] as const).map(status => ({
    name: `${status} status with default content`,
    vue: () => h(VQRCode, { value, status }),
    react: () => <QRCode value={value} status={status} />,
  })),
  {
    name: 'empty value with default content',
    vue: () => h(VQRCode, { value: '' }),
    react: () => <QRCode value="" />,
  },
  {
    name: 'oversized value with default content',
    vue: () => h(VQRCode, { value: 'a'.repeat(4000) }),
    react: () => <QRCode value={'a'.repeat(4000)} />,
  },
  ...(['loading', 'expired', 'scanned'] as const).map(status => ({
    name: `custom status content for ${status}`,
    vue: () =>
      h(
        VQRCode,
        { value, status },
        { status: (props: QRCodeStatusSlot) => h('button', statusView(props)) },
      ),
    react: () => (
      <QRCode
        value={value}
        status={status}
        renderStatus={props => <button>{statusView(props)}</button>}
      />
    ),
  })),
  {
    name: 'custom status content for empty',
    vue: () =>
      h(
        VQRCode,
        { value: '' },
        { status: (props: QRCodeStatusSlot) => h('button', statusView(props)) },
      ),
    react: () => <QRCode value="" renderStatus={props => <button>{statusView(props)}</button>} />,
  },
  {
    name: 'custom status content for error',
    vue: () =>
      h(
        VQRCode,
        { value: 'a'.repeat(4000) },
        { status: (props: QRCodeStatusSlot) => h('button', statusView(props)) },
      ),
    react: () => (
      <QRCode
        value={'a'.repeat(4000)}
        renderStatus={props => <button>{statusView(props)}</button>}
      />
    ),
  },
  {
    name: 'class merge and attributes, caller style wins',
    vue: () =>
      h(VQRCode, {
        value,
        class: 'rounded-none',
        id: 'qr',
        'data-x': '1',
        style: 'margin: 4px; --hn-qr-size: 10px',
      }),
    react: () => (
      <QRCode
        value={value}
        className="rounded-none"
        id="qr"
        data-x="1"
        style={{ margin: '4px', ['--hn-qr-size' as string]: '10px' }}
      />
    ),
  },
])
