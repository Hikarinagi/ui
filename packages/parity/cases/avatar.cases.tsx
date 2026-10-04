import { h } from 'vue'
import { Bot } from '@hina-ui/vue/../node_modules/@lucide/vue'
import { Bot as BotIcon } from '@hina-ui/react/../node_modules/lucide-react'
import VAvatar from '@hina-ui/vue/components/avatar/Avatar.vue'
import VAvatarGroup from '@hina-ui/vue/components/avatar/AvatarGroup.vue'
import { Avatar } from '@hina-ui/react/components/avatar/Avatar'
import { AvatarGroup } from '@hina-ui/react/components/avatar/AvatarGroup'
import { lucide } from '@hina-ui/react/lib/icon'
import { defineCases } from '../src/cases'

const Robot = lucide(BotIcon)
const sizes = ['sm', 'md', 'lg'] as const
const names = ['甲', '乙', '丙', '丁', '戊']

export default defineCases('Avatar', [
  {
    name: 'icon fallback without a name',
    vue: () => h(VAvatar),
    react: () => <Avatar />,
  },
  ...sizes.map(size => ({
    name: `size ${size}`,
    vue: () => h(VAvatar, { size, name: 'Shion Hoshimi' }),
    react: () => <Avatar size={size} name="Shion Hoshimi" />,
  })),
  {
    name: 'latin single word takes two letters',
    vue: () => h(VAvatar, { name: 'ringyuki' }),
    react: () => <Avatar name="ringyuki" />,
  },
  {
    name: 'han name takes the first character',
    vue: () => h(VAvatar, { name: '星见书音' }),
    react: () => <Avatar name="星见书音" />,
  },
  {
    name: 'kana name takes the first character',
    vue: () => h(VAvatar, { name: 'ほしみ' }),
    react: () => <Avatar name="ほしみ" />,
  },
  {
    name: 'image source with name as alt',
    vue: () => h(VAvatar, { src: '/avatars/paper.webp', name: '星见书音' }),
    react: () => <Avatar src="/avatars/paper.webp" name="星见书音" />,
  },
  {
    name: 'explicit alt and class',
    vue: () => h(VAvatar, { src: '/avatars/peek.webp', alt: '偷瞄', size: 'lg', class: 'ring-2' }),
    react: () => <Avatar src="/avatars/peek.webp" alt="偷瞄" size="lg" className="ring-2" />,
  },
  {
    name: 'eager image source',
    vue: () => h(VAvatar, { src: '/avatars/peek.webp', alt: '偷瞄', lazy: false, loading: 'lazy' }),
    react: () => <Avatar src="/avatars/peek.webp" alt="偷瞄" lazy={false} loading="lazy" />,
  },
  {
    name: 'default slot replaces the fallback',
    vue: () => h(VAvatar, { name: '星见书音' }, () => '★'),
    react: () => <Avatar name="星见书音">★</Avatar>,
  },
  {
    name: 'custom icon',
    vue: () => h(VAvatar, null, () => h(Bot)),
    react: () => (
      <Avatar>
        <Robot />
      </Avatar>
    ),
  },
  {
    name: 'group shows all without max',
    vue: () => h(VAvatarGroup, null, () => names.slice(0, 3).map(name => h(VAvatar, { name }))),
    react: () => (
      <AvatarGroup>
        {names.slice(0, 3).map(name => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>
    ),
  },
  {
    name: 'group folds overflow into a count',
    vue: () =>
      h(VAvatarGroup, { max: 2, size: 'lg', class: 'gap-0' }, () =>
        names.map(name => h(VAvatar, { name })),
      ),
    react: () => (
      <AvatarGroup max={2} size="lg" className="gap-0">
        {names.map(name => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>
    ),
  },
  {
    name: 'group size yields to an explicit avatar size',
    vue: () =>
      h(VAvatarGroup, { size: 'sm', 'data-test': 'group' }, () => [
        h(VAvatar, { name: '甲' }),
        h(VAvatar, { name: '乙', size: 'lg' }),
      ]),
    react: () => (
      <AvatarGroup size="sm" data-test="group">
        <Avatar name="甲" />
        <Avatar name="乙" size="lg" />
      </AvatarGroup>
    ),
  },
  {
    name: 'group counts fragment children',
    vue: () =>
      h(VAvatarGroup, { max: 2 }, () => [
        h(VAvatar, { name: '甲' }),
        ['乙', '丙', '丁'].map(name => h(VAvatar, { key: name, name })),
      ]),
    react: () => (
      <AvatarGroup max={2}>
        <Avatar name="甲" />
        <>
          {['乙', '丙', '丁'].map(name => (
            <Avatar key={name} name={name} />
          ))}
        </>
      </AvatarGroup>
    ),
  },
])
