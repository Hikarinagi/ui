import { h } from 'vue'
import { ArrowUpRight, BookOpen, Code } from '@hina-ui/vue/../node_modules/@lucide/vue'
import {
  ArrowUpRight as ArrowUpRightReact,
  BookOpen as BookOpenReact,
  Code as CodeReact,
} from '@hina-ui/react/../node_modules/lucide-react'
import VNavigationMenu from '@hina-ui/vue/components/navigation-menu/NavigationMenu.vue'
import VNavigationMenuItem from '@hina-ui/vue/components/navigation-menu/NavigationMenuItem.vue'
import VNavigationMenuTrigger from '@hina-ui/vue/components/navigation-menu/NavigationMenuTrigger.vue'
import VNavigationMenuContent from '@hina-ui/vue/components/navigation-menu/NavigationMenuContent.vue'
import VNavigationMenuLink from '@hina-ui/vue/components/navigation-menu/NavigationMenuLink.vue'
import { NavigationMenu } from '@hina-ui/react/components/navigation-menu/NavigationMenu'
import { NavigationMenuItem } from '@hina-ui/react/components/navigation-menu/NavigationMenuItem'
import { NavigationMenuTrigger } from '@hina-ui/react/components/navigation-menu/NavigationMenuTrigger'
import { NavigationMenuContent } from '@hina-ui/react/components/navigation-menu/NavigationMenuContent'
import { NavigationMenuLink } from '@hina-ui/react/components/navigation-menu/NavigationMenuLink'
import { lucide } from '@hina-ui/react/lib/icon'
import { defineCases } from '../src/cases'

const BookOpenIcon = lucide(BookOpenReact)
const CodeIcon = lucide(CodeReact)
const ArrowUpRightIcon = lucide(ArrowUpRightReact)

const vueUnit =
  (props: Record<string, unknown> = {}) =>
  () =>
    h(VNavigationMenu, { label: 'Navigation', trigger: 'click', ...props }, () => [
      h(VNavigationMenuItem, { value: 'learn' }, () => [
        h(VNavigationMenuTrigger, {}, () => 'Learn'),
        h(VNavigationMenuContent, {}, () =>
          h(
            VNavigationMenuLink,
            { href: '#start', description: 'Start here' },
            () => 'Introduction',
          ),
        ),
      ]),
      h(VNavigationMenuItem, {}, () =>
        h(VNavigationMenuLink, { href: '#about', active: true }, () => 'About'),
      ),
      h(VNavigationMenuItem, {}, () =>
        h(VNavigationMenuTrigger, { disabled: true }, () => 'Disabled'),
      ),
    ])

const reactUnit =
  (props: Record<string, unknown> = {}) =>
  () => (
    <NavigationMenu label="Navigation" trigger="click" {...props}>
      <NavigationMenuItem value="learn">
        <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink href="#start" description="Start here">
            Introduction
          </NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#about" active>
          About
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger disabled>Disabled</NavigationMenuTrigger>
      </NavigationMenuItem>
    </NavigationMenu>
  )

const vueSsr = (value: string) => () =>
  h(VNavigationMenu, { label: 'Navigation', dir: 'rtl', modelValue: value }, () => [
    h(VNavigationMenuItem, { value: 'learn' }, () => [
      h(VNavigationMenuTrigger, {}, () => 'Learn'),
      h(VNavigationMenuContent, {}, () =>
        h(VNavigationMenuLink, { href: '#start' }, () => 'Start'),
      ),
    ]),
    h(VNavigationMenuItem, {}, () =>
      h(VNavigationMenuLink, { href: '#about', active: true }, () => 'About'),
    ),
  ])

const reactSsr = (value: string) => () => (
  <NavigationMenu label="Navigation" dir="rtl" value={value}>
    <NavigationMenuItem value="learn">
      <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="#start">Start</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="#about" active>
        About
      </NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenu>
)

const vueBrowser =
  (props: Record<string, unknown> = {}) =>
  () =>
    h(VNavigationMenu, { label: 'Navigation', trigger: 'click', ...props }, () => [
      ...['one', 'two'].map((name, index) =>
        h(VNavigationMenuItem, { value: name }, () => [
          h(VNavigationMenuTrigger, {}, { default: () => name, icon: () => h(BookOpen) }),
          h(VNavigationMenuContent, { class: index ? 'w-96' : 'w-72' }, () => [
            h(
              VNavigationMenuLink,
              { href: `#${name}-first` },
              {
                default: () => `${name} first`,
                icon: () => h(BookOpen),
                trailing: () => h(ArrowUpRight),
              },
            ),
            h(
              VNavigationMenuLink,
              { href: `#${name}-last`, description: 'Description' },
              () => `${name} last`,
            ),
          ]),
        ]),
      ),
      h(VNavigationMenuItem, {}, () =>
        h(VNavigationMenuTrigger, { disabled: true }, () => 'disabled'),
      ),
      h(VNavigationMenuItem, {}, () =>
        h(VNavigationMenuLink, { href: '#disabled', disabled: true }, () => 'disabled link'),
      ),
      h(VNavigationMenuItem, {}, () => h(VNavigationMenuLink, { href: '#about' }, () => 'about')),
    ])

const reactBrowser =
  (props: Record<string, unknown> = {}) =>
  () => (
    <NavigationMenu label="Navigation" trigger="click" {...props}>
      {['one', 'two'].map((name, index) => (
        <NavigationMenuItem key={name} value={name}>
          <NavigationMenuTrigger icon={<BookOpenIcon />}>{name}</NavigationMenuTrigger>
          <NavigationMenuContent className={index ? 'w-96' : 'w-72'}>
            <NavigationMenuLink
              href={`#${name}-first`}
              icon={<BookOpenIcon />}
              trailing={<ArrowUpRightIcon />}
            >
              {`${name} first`}
            </NavigationMenuLink>
            <NavigationMenuLink href={`#${name}-last`} description="Description">
              {`${name} last`}
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      ))}
      <NavigationMenuItem>
        <NavigationMenuTrigger disabled>disabled</NavigationMenuTrigger>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#disabled" disabled>
          disabled link
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#about">about</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenu>
  )

const sizes = ['sm', 'md', 'lg'] as const

export default defineCases('NavigationMenu', [
  {
    name: 'unit setup closed',
    vue: vueUnit(),
    react: reactUnit(),
  },
  {
    name: 'unit setup opened through the model',
    vue: vueUnit({ modelValue: 'learn' }),
    react: reactUnit({ value: 'learn' }),
  },
  ...['', 'learn'].map(value => ({
    name: `ssr export rendering with state "${value}" in rtl`,
    vue: vueSsr(value),
    react: reactSsr(value),
  })),
  ...(['horizontal', 'vertical'] as const).flatMap(orientation =>
    ['', 'one', 'two'].map(value => ({
      name: `browser setup ${orientation} with value "${value}"`,
      vue: vueBrowser({ orientation, modelValue: value }),
      react: reactBrowser({ orientation, value }),
    })),
  ),
  ...(['ltr', 'rtl'] as const).flatMap(dir =>
    (['start', 'center', 'end'] as const).map(align => ({
      name: `${dir} vertical aligned ${align}`,
      vue: vueBrowser({ orientation: 'vertical', dir, align, modelValue: 'one' }),
      react: reactBrowser({ orientation: 'vertical', dir, align, value: 'one' }),
    })),
  ),
  ...sizes.map(size => ({
    name: `${size} size with icon and trailing slots`,
    vue: () =>
      h(VNavigationMenu, { label: `${size} 导航`, size, modelValue: 'docs' }, () => [
        h(VNavigationMenuItem, { value: 'docs' }, () => [
          h(VNavigationMenuTrigger, {}, { icon: () => h(BookOpen), default: () => size }),
          h(VNavigationMenuContent, { class: 'w-64' }, () => [
            h(
              VNavigationMenuLink,
              { href: '#usage' },
              { icon: () => h(BookOpen), default: () => '用法' },
            ),
            h(
              VNavigationMenuLink,
              { href: '#api' },
              {
                icon: () => h(Code),
                default: () => 'API',
                trailing: () => h(ArrowUpRight),
              },
            ),
          ]),
        ]),
        h(VNavigationMenuItem, {}, () =>
          h(VNavigationMenuLink, { href: '#usage', active: true }, () => '用法'),
        ),
        h(VNavigationMenuItem, {}, () => h(VNavigationMenuLink, { href: '#api' }, () => 'API')),
      ]),
    react: () => (
      <NavigationMenu label={`${size} 导航`} size={size} value="docs">
        <NavigationMenuItem value="docs">
          <NavigationMenuTrigger icon={<BookOpenIcon />}>{size}</NavigationMenuTrigger>
          <NavigationMenuContent className="w-64">
            <NavigationMenuLink href="#usage" icon={<BookOpenIcon />}>
              用法
            </NavigationMenuLink>
            <NavigationMenuLink href="#api" icon={<CodeIcon />} trailing={<ArrowUpRightIcon />}>
              API
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#usage" active>
            用法
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#api">API</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenu>
    ),
  })),
  {
    name: 'basic links only',
    vue: () =>
      h(VNavigationMenu, { label: '页面导航' }, () => [
        h(VNavigationMenuItem, {}, () =>
          h(VNavigationMenuLink, { href: '#usage', active: true }, () => '用法'),
        ),
        h(VNavigationMenuItem, {}, () =>
          h(VNavigationMenuLink, { href: '#examples' }, () => '示例'),
        ),
      ]),
    react: () => (
      <NavigationMenu label="页面导航">
        <NavigationMenuItem>
          <NavigationMenuLink href="#usage" active>
            用法
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#examples">示例</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenu>
    ),
  },
  {
    name: 'states with disabled controls in small size',
    vue: () =>
      h(VNavigationMenu, { label: '导航状态', size: 'sm' }, () => [
        h(VNavigationMenuItem, {}, () =>
          h(VNavigationMenuLink, { href: '#states', active: true }, () => '当前页'),
        ),
        h(VNavigationMenuItem, {}, () =>
          h(VNavigationMenuTrigger, { disabled: true }, () => '禁用面板'),
        ),
        h(VNavigationMenuItem, {}, () =>
          h(VNavigationMenuLink, { href: '#states', disabled: true }, () => '禁用链接'),
        ),
      ]),
    react: () => (
      <NavigationMenu label="导航状态" size="sm">
        <NavigationMenuItem>
          <NavigationMenuLink href="#states" active>
            当前页
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger disabled>禁用面板</NavigationMenuTrigger>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#states" disabled>
            禁用链接
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenu>
    ),
  },
  ...['sm', 'lg'].map(size => ({
    name: `asChild link inherits ${size} size`,
    vue: () =>
      h(VNavigationMenu, { label: 'Links', size }, () =>
        h(VNavigationMenuItem, {}, () =>
          h(VNavigationMenuLink, { asChild: true, active: true }, () =>
            h('a', { href: '#custom' }, 'Custom'),
          ),
        ),
      ),
    react: () => (
      <NavigationMenu label="Links" size={size as 'sm' | 'lg'}>
        <NavigationMenuItem>
          <NavigationMenuLink asChild active>
            <a href="#custom">Custom</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenu>
    ),
  })),
  {
    name: 'open content without padding, custom tags, trailing slot and attributes',
    vue: () =>
      h(
        VNavigationMenu,
        {
          label: '自定义导航',
          modelValue: 'resources',
          class: 'mx-auto',
          listClass: 'gap-2',
          viewportClass: 'shadow-lg',
          id: 'site-nav',
          'data-testid': 'menu',
        },
        () => [
          h(VNavigationMenuItem, { value: 'resources', 'data-item': 'resources' }, () => [
            h(
              VNavigationMenuTrigger,
              { class: 'px-4', 'aria-haspopup': 'true' },
              {
                icon: () => h(BookOpen),
                default: () => '资源',
                trailing: () => h('span', { class: 'badge' }, 'New'),
              },
            ),
            h(
              VNavigationMenuContent,
              { padded: false, class: 'w-96', 'data-panel': 'resources' },
              () => [
                h('p', '设计与组件'),
                h(
                  VNavigationMenuLink,
                  { as: 'span', description: '语义色、表现色与主题切换', class: 'pe-4' },
                  {
                    default: () => '颜色规范',
                    trailing: () => h('span', '更新'),
                  },
                ),
                h(
                  VNavigationMenuLink,
                  { href: 'https://github.com', target: '_blank', rel: 'noopener noreferrer' },
                  { default: () => 'GitHub', trailing: () => h(ArrowUpRight) },
                ),
              ],
            ),
          ]),
        ],
      ),
    react: () => (
      <NavigationMenu
        label="自定义导航"
        value="resources"
        className="mx-auto"
        listClass="gap-2"
        viewportClass="shadow-lg"
        id="site-nav"
        data-testid="menu"
      >
        <NavigationMenuItem value="resources" data-item="resources">
          <NavigationMenuTrigger
            className="px-4"
            aria-haspopup="true"
            icon={<BookOpenIcon />}
            trailing={<span className="badge">New</span>}
          >
            资源
          </NavigationMenuTrigger>
          <NavigationMenuContent padded={false} className="w-96" data-panel="resources">
            <p>设计与组件</p>
            <NavigationMenuLink
              as="span"
              description="语义色、表现色与主题切换"
              className="pe-4"
              trailing={<span>更新</span>}
            >
              颜色规范
            </NavigationMenuLink>
            <NavigationMenuLink
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              trailing={<ArrowUpRightIcon />}
            >
              GitHub
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenu>
    ),
  },
  ...['', 'links'].map(value => ({
    name: `kept mounted content with value "${value}"`,
    vue: () =>
      h(
        VNavigationMenu,
        { label: '点击展开', trigger: 'click', unmountOnHide: false, modelValue: value },
        () => [
          h(VNavigationMenuItem, { value: 'links' }, () => [
            h(VNavigationMenuTrigger, {}, () => '链接'),
            h(VNavigationMenuContent, {}, () => [
              h(VNavigationMenuLink, { href: '#controlled' }, () => '选择后关闭'),
              h(VNavigationMenuLink, { href: '#controlled' }, () => '选择后保持打开'),
            ]),
          ]),
          h(VNavigationMenuItem, { value: 'more' }, () => [
            h(VNavigationMenuTrigger, {}, () => '更多'),
            h(VNavigationMenuContent, {}, () =>
              h(VNavigationMenuLink, { href: '#more' }, () => '更多链接'),
            ),
          ]),
        ],
      ),
    react: () => (
      <NavigationMenu label="点击展开" trigger="click" unmountOnHide={false} value={value}>
        <NavigationMenuItem value="links">
          <NavigationMenuTrigger>链接</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="#controlled">选择后关闭</NavigationMenuLink>
            <NavigationMenuLink href="#controlled">选择后保持打开</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="more">
          <NavigationMenuTrigger>更多</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="#more">更多链接</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenu>
    ),
  })),
  {
    name: 'default slot receives the model value',
    vue: () =>
      h(
        VNavigationMenu,
        { label: 'Scoped', modelValue: 'a' },
        {
          default: ({ value }: { value: string }) => [
            h(VNavigationMenuItem, { value: 'a' }, () => [
              h(VNavigationMenuTrigger, {}, () => `Open: ${value}`),
              h(VNavigationMenuContent, {}, () => h('p', value)),
            ]),
          ],
        },
      ),
    react: () => (
      <NavigationMenu label="Scoped" value="a">
        {({ value }) => (
          <NavigationMenuItem value="a">
            <NavigationMenuTrigger>{`Open: ${value}`}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <p>{value}</p>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenu>
    ),
  },
  {
    name: 'hover trigger with custom delays and end alignment',
    vue: () =>
      h(
        VNavigationMenu,
        { label: 'Hover', delayDuration: 0, skipDelayDuration: 100, align: 'end' },
        () =>
          h(VNavigationMenuItem, { value: 'x' }, () => [
            h(VNavigationMenuTrigger, {}, () => 'X'),
            h(VNavigationMenuContent, {}, () => 'Panel'),
          ]),
      ),
    react: () => (
      <NavigationMenu label="Hover" delayDuration={0} skipDelayDuration={100} align="end">
        <NavigationMenuItem value="x">
          <NavigationMenuTrigger>X</NavigationMenuTrigger>
          <NavigationMenuContent>Panel</NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenu>
    ),
  },
])
