import { h } from 'vue'
import { vi } from 'vitest'
import VAvatar from '@hina-ui/vue/components/avatar/Avatar.vue'
import VAvatarGroup from '@hina-ui/vue/components/avatar/AvatarGroup.vue'
import { Avatar } from '@hina-ui/react/components/avatar/Avatar'
import { AvatarGroup } from '@hina-ui/react/components/avatar/AvatarGroup'
import { defineLiveCases } from '../src/live'
import { picture, quiet } from './lightbox.live'

const face = picture(64, 64)
const broken = 'data:image/png;base64,bm90LWFuLWltYWdl'

function settled(check: () => boolean) {
  return async () => {
    await vi.waitFor(
      () => {
        if (!check()) throw new Error('pending')
      },
      { timeout: 5000 },
    )
    await quiet()
  }
}

const imageLoaded = () =>
  [...document.querySelectorAll('img')].every(img => img.naturalWidth > 0) &&
  !document.querySelector('.hn-skeleton')

export default defineLiveCases('avatar', [
  {
    name: 'loaded image replaces the initials',
    vue: () => h(VAvatar, { src: face, name: '星见书音' }),
    react: () => <Avatar src={face} name="星见书音" />,
    settle: settled(imageLoaded),
  },
  {
    name: 'failed image falls back to initials',
    vue: () => h(VAvatar, { src: broken, name: '星见书音', size: 'lg' }),
    react: () => <Avatar src={broken} name="星见书音" size="lg" />,
    settle: settled(() => !document.querySelector('img')),
  },
  {
    name: 'failed image without a name falls back to the icon',
    vue: () => h(VAvatar, { src: broken }),
    react: () => <Avatar src={broken} />,
    settle: settled(() => !document.querySelector('img')),
  },
  {
    name: 'failed image keeps custom content',
    vue: () => h(VAvatar, { src: broken, name: '星见书音' }, () => '★'),
    react: () => (
      <Avatar src={broken} name="星见书音">
        ★
      </Avatar>
    ),
    settle: settled(() => !document.querySelector('img')),
  },
  {
    name: 'group with loaded images and an overflow count',
    vue: () =>
      h('div', { style: 'padding: 40px' }, [
        h(VAvatarGroup, { max: 3, size: 'lg' }, () =>
          ['甲', '乙', '丙', '丁', '戊'].map(name =>
            h(VAvatar, { key: name, src: face, alt: name }),
          ),
        ),
      ]),
    react: () => (
      <div style={{ padding: '40px' }}>
        <AvatarGroup max={3} size="lg">
          {['甲', '乙', '丙', '丁', '戊'].map(name => (
            <Avatar key={name} src={face} alt={name} />
          ))}
        </AvatarGroup>
      </div>
    ),
    settle: settled(imageLoaded),
  },
])
