# Hina UI

包名 `@hikarinagi/ui`,token 前缀 `--hn-`。产物是源码,不出构建产物 —— 消费方的 Tailwind 直接扫描本包。

基调、取值依据与禁用清单见基调纲领;分层、完成定义与里程碑见技术路线文档。本文只写接入方式与本包内的事实。

## 接入

```css
@import 'tailwindcss';
@import '@hikarinagi/ui/styles/tokens.css';

@source '../../node_modules/@hikarinagi/ui/src/**/*.{vue,ts}';
```

`@source` 是强制项。Tailwind v4 默认不扫描 `node_modules`,漏了这行的症状是**组件渲染出来但完全没样式,且构建不报错**。pnpm 的软链会让路径解析更微妙,以实际 `node_modules` 下的解析结果为准。

深色模式走 `.dark` 类选择器,由消费方在根元素上切换。

调 token 之后如果页面没变化,**先 `curl` 一次 dev server 的 CSS,确认发出去的到底是不是新值**,再判断是样式写错了还是没生效。曾经遇到过长时间运行的 dev server 发出陈旧 CSS(源码是新值、服务端是旧值),重启即恢复;但新起的服务器反复编辑都能正常热更新,原因未查明,不要据此认为 HMR 不可靠。

## Token 三层

| 层         | 位置              | 说明                                                                |
| ---------- | ----------------- | ------------------------------------------------------------------- |
| 原色阶     | `@theme static`   | `--color-neutral-*` `--color-brand-*` `--color-expr-*`,不随主题变化 |
| 语义角色   | `:root` / `.dark` | `--hn-*`,深浅模式**只在这一层**翻转                                 |
| 组件 token | 各组件内          | 按需添加,只在确实需要对外旋钮时才建                                 |

语义角色 → Tailwind utility 的映射写在 `@theme inline` 里。**必须是 `inline`**:用 `@theme static` 会让 Tailwind 在构建期固化取值,深色模式与密度都不再翻转。

几条不可协商的约束:

- 中性色阶三通道严格相等(R = G = B),整条不掺色相。浅色底 `#ffffff`,深色底 `#000000`。
- 深色主文字取 `--color-neutral-150`,不用纯白 —— 21:1 会在 OLED 上产生光晕。背景纯度不做让步,让文字退一档。
- 界面色相只来自 `brand` 与 `expr`,其余全部无彩。
- 表现色(`--color-expr-*`)只用于「需要区分」,不承担功能语义;状态色(`success` / `warning` / `danger` / `info`)含义固定,两者不可互换。
- **组件源码中不得出现 `dark:`**。需要它就说明语义层漏了一个角色,应回到 `tokens.css` 补角色,而不是就地打补丁。
- **一个名字只能在一处定义。**`@theme static` 的调色板与 `@theme inline` 的语义映射**不得重名** —— 否则 `--color-x: var(--hn-x)` 与 `--hn-x: var(--color-x)` 形成 CSS 变量环,解析为无效值,表现是**该颜色整个失效变透明**,而且构建不报错。状态色因此只存在于语义层,没有固定调色板。
- **实心填充对比度不够时,翻转文字颜色,不要压暗填充。**品牌青 `#39c5bb` 配白字只有 2.13:1,但配近黑是 9.31:1;压暗到能配白字得走到 `#1f827b`,那已经不是品牌色了。压暗填充 = 丢辨识度 + 颜色变脏,与「底子干净、颜色集中释放」相悖。accent 与 warning 都按这条走深色文字。
- **交互态不换填充。**实心角色没有 `-hover` / `-active` 色阶 token —— hover / press 是叠在填充上的 on-color 薄墨(见「hover 与 press」)。机检守着「底色叠上 hover 薄墨后对比度仍 ≥ 4.5:1」,所以实心基色必须留出这份余量;success 浅色与 danger 深色都为此校深/校亮过一档。

## 密度

密度是容器上的 `data-density`,不是组件的 prop:

```html
<div data-density="compact">…</div>
```

组件只读 `--hn-control-h-*` / `--hn-row-h` 这类尺寸 token,完全不感知密度。这样密度可在页面或区块级切换,也不会让每个组件多一个维度的变体。

`size`(`sm` / `md` / `lg`)与密度正交:`size` 选档位,密度整体缩放。

粗指针设备下(`@media (pointer: coarse)`)两档都会被强制拉回可点尺寸,`compact` 只服务鼠标键盘场景 —— 触摸目标 ≥ 44px 不因密度让步。

## surface 与阴影

页底是 **bg**(canvas,纯白 / 纯黑),元件的底色是 **surface**,两者必须两色(机检)。区分主角是**精心设计的分层阴影**,发丝线只是配角勾边。

阴影是**共享资产**,三档语义,组件不得自造配方:

| 档          | 语义         | 用在                                                    |
| ----------- | ------------ | ------------------------------------------------------- |
| `shadow-sm` | surface 阴影 | 静止 surface:Card、primary Input,一切直接放在 bg 上的件 |
| `shadow-md` | 浮层阴影     | Popover / Menu / Tooltip 等小浮层                       |
| `shadow-lg` | 对话框阴影   | Dialog / Drawer 等大浮层                                |

surface 的光学系统有三个部件:

- **边缘 = alpha 发丝线**:`--hn-border` 是 `rgb(0 0 0 / 0.08)`(深色 `rgb(255 255 255 / 0.1)`)而非实心灰 —— alpha 线落在任何地面都自适应,surface 叠 surface、浮层叠卡片时线自动加深,这是它撑得起广泛使用的原因。实心灰只在单一底色上正确。
- **抬升 = 几何级数 key 光**:每档三层,距离 1→2→4 倍增、alpha 递减、负 spread 收住侧漏 —— 近处一层锐利贴地,远处没有糊晕。小到 36px 的输入件、大到整块对话框都成立。
- **深色 = 顶部内高光**:纯黑上投影物理上不可见,深色 surface 的受光感来自 `inset 0 1px 0` 的顶缘白高光 + alpha 亮线;外投影只负责与下层堆叠时的层次。

**border 与 shadow 是一体的**:surface 的视觉定义是一个总量,两者共同构成轮廓,不是两个独立装饰。由此推出**视觉接替**规则:focus 时**边框加粗,视觉上盖住原 border+shadow 那条边缘带** —— 阴影全程纹丝不动,接替是纯视觉的,粗边主导了眼睛对轮廓的读取。实现零位移且**向外长**(阴影画在外面,接替它的加厚当然朝外):1px 彩色边框 + 贴边 `outline: 1px solid`(零偏移,常驻透明、focus 染色)= 视觉 2px 外扩粗边;`outline-color` 是普通长手属性,transparent → 彩色的插值可靠,浏览器测试取样过渡中间帧守着这一点。错法记录在案:彩色细线叠在中性定义上(太弱,打架出第三种效果)、阴影退场(surface 掉下去)、阴影换彩色(霓虹)、向内加粗(长错了方向)、Tailwind 阴影槽变量(插值不可靠,粗边跳变)。

**双形态通则**(会出现在两种地面上的组件都适用,这是设计语言,不是组件特例):**直接放在 bg 上的形态是 surface 件** —— surface 填充 + surface 阴影 + 发丝线;**放在 surface 之内的形态是扁平件** —— inset 填充、无阴影、无边框。同一组件的 `primary` / `secondary` 变体就是这两种出身:primary 上 bg,secondary 上 surface。

## 动效

通用时长四档、曲线六条,组件不得写字面量值。**曲线不够用时补 token,不允许就地写 `cubic-bezier(...)`** —— 各写各的是动效失控最主要的来源。唯一的例外是**物理体组件 token**:持续旋转的 `--hn-spin-duration`、波纹的 `--hn-ripple-in` / `--hn-ripple-out` 这类描述一个独立物理过程的值,不硬套通用档,但必须落在 tokens.css、接受 reduced-motion 降级,且每个都要有存在理由 —— 它们是「补 token」路径的产物,不是逃逸口。

### 场景对照表

先查这张表,不要自己判断。查不到的场景说明缺 token,提出来补,不要现编:

| 场景                                         | 时长                        | 曲线                           |
| -------------------------------------------- | --------------------------- | ------------------------------ |
| hover / focus / 颜色 / 边框                  | `fast` 120                  | `move`                         |
| 按压 / 开关拨动 / 勾选                       | `fast` 120                  | `press`                        |
| 小浮层进场(Tooltip / Popover / Menu / Toast) | `base` 180                  | `enter`                        |
| **大面积浮层进场**(Dialog / Drawer / Sheet)  | `slow` 240                  | **`enter-strong`**             |
| 一切浮层出场                                 | `exit` 110                  | `exit`                         |
| 标签切换 / 手风琴展开 / 尺寸变化             | `base` 180                  | `move`                         |
| 列表错峰进场                                 | `base` 180                  | `enter` + `stagger` 24         |
| **确定性进度 / 加载环 / 滚动联动**           | 由数据驱动                  | **`linear`**                   |
| 波纹生长 / 浮现 / 退场                       | 150 / 75 / 375(fork 保真值) | `linear` / `move`,见「ripple」 |
| **布局重排 / 共享元素 / 拖拽**               | —                           | **走 motion-v,不用 CSS 曲线**  |

两条容易踩的:**大面积浮层不能用 `enter`** —— 大位移配普通减速曲线会显得平、拖沓,`enter-strong` 前段更快、末段更缓,同样时长里读起来更利落;**确定性进度不能用缓动** —— 进度条走的是真实数值,加了缓动会让 40% 看起来不像 40%。

### 曲线表

| token                    | 值                          | 用途                            |
| ------------------------ | --------------------------- | ------------------------------- |
| `--hn-ease-enter`        | `cubic-bezier(0,0,.2,1)`    | 小元素进场,减速落位             |
| `--hn-ease-enter-strong` | `cubic-bezier(.05,.7,.1,1)` | 大面积进场,更强的减速           |
| `--hn-ease-exit`         | `cubic-bezier(.4,0,1,1)`    | 出场,加速撤离                   |
| `--hn-ease-move`         | `cubic-bezier(.4,0,.2,1)`   | 元素始终可见时的位置 / 尺寸变化 |
| `--hn-ease-press`        | `cubic-bezier(.3,1.2,.6,1)` | 唯一允许的弹簧,约 4% overshoot  |
| `--hn-ease-linear`       | `linear`                    | 连续 / 受控进度                 |

出场只有一条曲线:出场时长 110ms,曲线形状在这个尺度上不可感知,再分大小是无意义的档位膨胀。

### 时长表

组件不得写字面量值:

| token                | 值    | 用途                 |
| -------------------- | ----- | -------------------- |
| `--hn-duration-fast` | 120ms | hover / focus / 开关 |
| `--hn-duration-base` | 180ms | 默认                 |
| `--hn-duration-slow` | 240ms | 大面积浮层           |
| `--hn-duration-exit` | 110ms | 出场,约进场的 0.6 倍 |

出场比进场快约 0.4 倍,并且用相反方向的曲线 —— 「利落」主要来自这条不对称,不来自更短的总时长。

`--hn-ease-press` 只用于按压、开关、勾选 —— 即用户直接施力的那一下。非用户直接触发的位置一律用非对称缓动。它是 CSS 近似;需要真实弹簧时用 motion-v。

### JS 侧取同一份值

motion-v 接受的是数组与秒,不是 CSS 字符串。如果让写布局动画的人手敲 `[0.4, 0, 0.2, 1]`,必然和 CSS 侧漂移。所以同一份值在 `src/motion.ts` 里另有 TS 形态,从包根导出:

```ts
import { TRANSITION, EASE, DURATION, STAGGER } from '@hikarinagi/ui'

<motion.div :layout :transition="TRANSITION.layout" />
```

`TRANSITION` 是预置组合(`fast` / `base` / `enter` / `enterStrong` / `exit` / `press` / `layout`),优先用它;`EASE` / `DURATION` 只在需要自行组合时用。**两侧的值必须一致,改一处要改两处** —— 这是目前唯一的重复,后续可由构建期生成消除。

CSS 侧的 `prefers-reduced-motion` 在 token 层统一降级,组件不得各写各的媒体查询;但 **JS 侧不经过 CSS 变量,不会自动降级**,motion-v 组件必须自行判断后跳过动画。

### CSS 与 motion-v 的分工

并列摆着会让每个人随机选,边界定死:

| 场景                                | 用什么                                                | 原因                                         |
| ----------------------------------- | ----------------------------------------------------- | -------------------------------------------- |
| 浮层进出场                          | CSS keyframes,挂在 Reka `Presence` 的 `data-state` 上 | motion-v 无法参与 Reka 的卸载时机,这是硬限制 |
| 高度展开 / 折叠                     | CSS,消费 Reka 给出的高度变量                          | 同属 `Presence` 生命周期                     |
| hover / focus / 颜色 / 单元素小位移 | CSS transition + 动效 token                           | 合成层,零 JS 开销                            |
| **一切布局动画**                    | **motion-v**                                          | 见下                                         |

**涉及布局的动画一律走 motion-v,不要用 CSS 过渡去模拟。** motion-v 的 layout 动画基于 FLIP 且**可打断** —— 连续触发时从当前位置继续,而不是跳回起点重放;`layoutId` 负责共享元素的跨位置过渡;手势与惯性有物理模型。这三件事 CSS 都做不到,勉强模拟出来的版本在快速连续交互下必然错位。

落到具体组件:列表增删与重排、Tabs 指示条位移、Toast 堆叠时的位置推移、可拖拽排序、Drawer 的拖拽关闭、卡片尺寸变化。

注意 Accordion / Collapsible **不在**此列 —— 它们的高度变化属于 `Presence` 生命周期,用 CSS 消费 Reka 的高度变量,混用会和卸载时机打架。

## hover 与 press

**公理:一次交互,一个视觉主体,沿它唯一的强度轴走定长的步** —— 静止 → hover 一步 → press 两步,松开原路返回。焦点环独立于此,永远是外环,不参与强度轴。**主体指元素,不指属性**:一步之内允许这个元素的墨、填充、边框、阴影、按压缩放一起动(它们是同一主体对同一次施力的响应),但只能动一次、同一方向;第二个元素跟着动 —— icon 位移、相邻元素让位、颜色反转之类 —— 才是第二主体。

交互反馈只有一种介质:**薄墨**(状态层)。hover 是平铺的墨,press 是从触点生长的墨(波纹,见下),选中是着色的墨 —— 一次交互从头到尾都在同一介质里,没有机制切换。**容器组件(Card 等)不带任何可点样式**:怎么做可点是调用方的事,「边框升档 / 阴影升档」这类容器 hover 效果被明令禁止(曾有 `hn-elevate` 高度轴,已拍板删除)。调用方要做可点容器时,用公开件自己组合:

```html
<Card as="button" class="hn-interactive hn-state-layer hn-press-lg text-start">
  <Ripple />
  …
</Card>
```

| surface                                                           | hover                           | press                          | 墨色              |
| ----------------------------------------------------------------- | ------------------------------- | ------------------------------ | ----------------- |
| 实心(solid,含状态色)                                              | 平墨                            | 波纹                           | 该角色的 on-color |
| 无填充 / 弱填充:soft / outline / ghost、菜单项、行、tab、未知底色 | 平墨                            | 波纹                           | 中性 `fg`         |
| 文字链接:`variant="link"`、未来的 Link / NavLink                  | 字色向墨极压 25%                | 压 40%                         | 墨直接落在字上    |
| 输入面:Input / Textarea / Select 触发器(`hn-field`)               | 填充落墨一步                    | focus:墨退净 + accent 粗边接替 | 墨落在填充里      |
| 容器:card / panel                                                 | 无(组件不带可点样式,调用方自组) | 无                             | —                 |

**判定程序(机械可答):**

1. 薄墨,solid 取 on-color(变体层经 `--hn-state-color` 指定),其余中性。
2. 是独立按压目标吗?小控件 → 默认缩放 `0.98`;大面积目标 → `hn-press-lg`;列表/菜单里的行项 → `hn-press-none`(成列的东西不弹)。
3. 是聚焦目标而非按压目标吗(表单输入件)?是 → `hn-field`,**墨的第三种落法:落在填充里**(`<input>` 是替换元素,没有伪元素可用)。hover = fill 向 fg 混一档(同一个 `--hn-state-hover-opacity`,深色自动升档);**focus = 墨退净、fill 回本色 + accent 粗边视觉接替**(见「surface 与阴影」):加粗的 accent 边框在视觉上盖住静止态的边缘带,阴影不动;secondary 平时无边,focus 时粗边从无到有。**hover / press 不做 border 文章,focus ring 弃用**(`outline: none`)—— border 是 focus 专属通道。invalid 是状态不是交互:静止时是**常规粗细**的 danger 线 + danger 淡墨(颜色标状态,定义不变);**粗边只属于 focus** —— invalid 聚焦时才加粗为 danger 粗边,且不被 accent 抢走。
4. 例外判定:是行内文字动作(prose surface)吗?是 → **墨直接落在字上**。没有盒可叠覆盖层,波纹没有几何可生长,但操作是同一个:盒面的墨是把填充向 fg 压一档(经 `::after`),文字的墨就是把字色向墨极(`--hn-fg-max`:浅色纯黑、深色纯白)做定比混合(经 `color-mix`)—— hover 压 25%,press 压 40%,方向随主题自动翻转,对 canvas 的对比只升不降,AA 永不跌。**不换色相、不建 `-hover` token**:混合是算出来的,不是配出来的。文字介质浓度比盒面高一个量级(25/40 vs 6/10),因为细笔画的面积不足以放大低浓度差异 —— 与深色 9/13、粗指针 16 同属「同一原则、按介质调浓度」。hover / press 行为封在 `hn-link` utility 里,不经组件 `hover:` 类,机检无需开口;无缩放、无波纹。

**裁定(含一次推翻):**

- **solid 并入薄墨** —— 推翻早先「solid 走色阶轴」的裁定。那条裁定先于 ripple 拍板;波纹进来后,hover 换填充、press 叠墨就是两种语言接在一次交互里,断层。六个色阶交互 token(`accent / danger / neutral-solid` 的 `-hover` / `-active`)已删除,状态色 solid(success / warning / info)因此免费获得交互态。代价是明暗不再由「远离文字」定律控制:薄墨永远朝 on-color 方向,幅度小到不构成方向感,机检守住叠墨后 ≥ 4.5:1。
- **非实心 surface 的墨永远无色**(中性 `fg` 薄层),**选中态才引入 accent**。位置反馈不带颜色,颜色留给状态含义 —— danger ghost 的 hover 也是灰墨,红色只在文字上。
- **档位数字只存在于 tokens.css**:浅色 6% / 10% / 选中 14%,深色 9% / 13% / 选中 20%;粗指针下 press 提到 16%、缩放减弱到 `0.99`。hover 墨在按压期间不撤,波纹叠在其上,所以鼠标按压的合成浓度 ≈ 15%(1 − 0.94 × 0.90),与触摸的 16% 单档大致等强 —— 各输入方式的按压观感不脱节。

守护写进 constraints.test:`hover:` / `active:` 一律不许改填充 —— 仅 `hover:border-*-strong` 合法,其余视觉类直接报错;组件源码禁止 `after:` 类(墨只能来自 utility);全库禁止 `brightness-` / `saturate-` 滤镜 hack;实心角色叠上 hover 薄墨后的对比度由 token 层测试计算把关。

状态层是一个 `::after` 覆盖层,墨色取 `--hn-state-color`(默认 `--hn-fg-default`,solid 变体覆写为 on-color,选中态取 accent),靠 **opacity** 表达强弱。因此浅色下是深色薄墨、深色下是浅色薄墨,自动适配;深色感知阈值更高,所以档位整体上浮。

**为什么是 `::after` + opacity,不是 `background-image`。**曾经用 `background-image: linear-gradient(层色, 层色)` 叠加 —— 它确实能盖住任意底色,但 **CSS 无法在 `none` 与渐变之间插值**,于是状态层是瞬变的,没有过渡。结果就是实心变体(改 `background-color`)有过渡、其余变体没有,hover 手感不统一,而且薄层瞬变看起来像「根本没有 hover 效果」。

`::after` 方案两边都占:`opacity` 可以完美过渡,覆盖层又独立于宿主背景。配合 `isolation: isolate` + `z-index: -1`,它落在**元素背景之上、内容之下**,所以不会给文字蒙一层灰。`border-radius: inherit` 让它自动贴合圆角。

**曲线也要分开。**`hn-interactive` 的过渡按属性拆:颜色、边框、阴影走 `ease-move`,只有 `transform` 走 `ease-press`。早先图省事给所有属性设了同一条弹簧曲线,结果 hover 变色也在弹 —— 弹簧只该出现在按压松手那一下。

### utility 清单

- **`hn-interactive`** —— 交互机制:指针样式、过渡、`focus-visible` 焦点环、按压缩放、禁用态。任何可交互元素都挂它。
- **`hn-state-layer`** —— 叠加轴:`::after` 层,含 hover / press / `data-highlighted` / 选中态。
- **`hn-press-lg` / `hn-press-none`** —— 按压缩放的两档改写。
- **`hn-link`** —— prose surface 的墨:字色经 `--hn-link-color` 注入,hover / press 向 `--hn-fg-max` 压 25% / 40%。
- **`hn-ripple` / `hn-ripple-surface`** —— 波纹的结构样式,只被 `Ripple` 组件使用,不直接挂。
- **`hn-field`** —— 输入面:fill 经 `--hn-field-bg` 注入(primary = surface,secondary = inset),hover 在填充里落墨一档、focus 墨退净 + 粗边视觉接替(1px 边框 + 1.5px 贴边 outline 染色,向外长、零位移、纯色插值);invalid 静止是常规粗细 danger 线 + 淡墨,聚焦才加粗且 danger 优先。caret 保持浏览器默认(宽度与颜色均不做文章)。表单输入件都挂它。

按压缩放默认 `0.98`,大面积用 `hn-press-lg`(`0.995`),不需要则 `hn-press-none`。缩放的过渡方向是不对称的:**按下用 `ease-move` 干脆收缩,松开回落到基础过渡的 `ease-press` 弹回** —— 弹簧只在释放那一下,按下时弹会显得黏。

**`will-change: transform` 常驻在 `hn-interactive` 基础声明里,不做条件化。**只要文字所在的元素参与 transform,合成层的建立/撤销那一刻文字就会切换抗锯齿方式重新栅格化(低 DPI 屏上可见为字形抖动)。不加 will-change,翻转发生在每次按压动画的首尾;hover 期才加,翻转挪到 hover 进出的瞬间 —— 条件化只能挪时机,消不掉翻转。稳定态只有「永远提升」一个(另一个是文字不参与 transform,但那要求把 bg/border/shadow 移到伪元素底板,会破坏 tv() 类覆盖契约)。代价可控:合成层显存按元素面积算,小控件每个几十 KB;文字常年灰度抗锯齿在高 DPI 屏和 macOS(Mojave 起系统级取消亚像素抗锯齿)上无感。HeroUI v3 在 button / menu-item / close-button 上是同样的做法(`transform-gpu` + `will-change-transform` 常驻基类)。

hover 一律包在 `@media (hover: hover)` 里。触摸设备没有真 hover,不加这层守卫会留下粘滞的 hover 态。

### ripple

**拍板:做**(推翻早先「不做」的结论)。实现 fork 自 [m3-ripple](https://github.com/SaltyAom/m3-ripple)(MIT,React 移植为 Vue,上游许可证在 `src/components/ripple/LICENSE`),即 material-web 的波纹算法:pointer 状态机(触摸延迟 150ms 判定滑动、最短可见 225ms、contextmenu 边界回查)+ WAAPI 在 `::after` 上做生长动画。

fork 时的本土化,全部为了不破坏三轴模型:

- **hover 归状态层,波纹只管 press。**上游自带的 hover 薄层(`::before`)整个删除,`hn-state-layer` 已经负责 hover。
- **波纹就是薄墨的 press 形态,不是第二主体。**颜色取 `--hn-state-color`(默认中性 `fg`,solid 上是 on-color),透明度取 `--hn-state-press-opacity`。存在波纹时 `hn-state-layer` 的平面 press 档通过 `:has(.hn-ripple)` 自动让位,不叠加。
- **运动学 1:1 保留上游,不套通用时长档。**波纹是独立的物理体,手感就编码在这几个数里:生长 150ms **linear**(上游源码 `easing` prop 无默认值,WAAPI 落到 linear —— 演示页的手感就是线性生长,不是注释里写的 M3 标准曲线)、墨浮现 75ms、墨退场 375ms。曾把它们硬套成 `fast/base/slow` 三档,浮现慢了近一倍 —— 墨还没显出来生长已走完大半,读起来像软糊的一闪而不是行进的波。CSS 侧落地为组件 token `--hn-ripple-in` / `--hn-ripple-out`(reduced-motion 一并降级),JS 侧生长时长是 fork 内常量。
- **solid 与其它变体走同一介质**:hover 平墨、press 波纹 + 缩放,交互全程不换填充。`:ripple="false"` 只是把 press 从波纹退回平墨(`:has` 让位失效,状态层的平面 press 档自动回来),介质不变,没有断层。
- **reduced-motion 跳过 WAAPI**,退化为整面软边薄层的淡入淡出(JS 侧不经过 CSS 变量,必须自行判断,见动效一节)。
- `forced-colors` 下整个隐藏;容器 `aria-hidden` 且自带 `overflow: hidden`,焦点环是宿主 outline,不受裁剪。
- 与上游其余的刻意差异:墨走在**文字之下**(`z-index: -1` + 宿主 `isolate`,上游盖在文字上);press 透明度用我们的档位(浅 10% / 深 13% / 粗指针 16%),不是上游的 0.12。

关闭方式是调用方传 `ripple: false`,Button 默认开启。粗指针下的补偿(press 16%、缩放 0.99)保留,与波纹叠住同一套 token。

## 滚动

**组件的容器滚动全部由 `ScrollArea` 负责**,内部是 OverlayScrollbars。原生滚动条跨平台不一致、挤占布局宽度,CSS 修不干净 —— 它基本是「不优雅」的单点最大来源。

**全库只有 `ScrollArea` 持有这个依赖**,其余需要内部滚动的组件一律组合它:下拉列表、菜单、Dialog / Drawer 内容区、Tree、表体、虚拟列表视口。不允许各组件分别 import 滚动库,否则滚动条行为会分叉,这个依赖将来也换不掉。

**边界:只管组件内的容器滚动,不含文档级滚动。**把 `body` 交给它会牵扯滚动锚定、浏览器页内查找、移动端地址栏收放,并与浮层的 body-scroll-lock 打架。

### 它接管后,真正滚动的不是宿主元素

OverlayScrollbars 会在宿主内部造一个 viewport,滚动发生在那上面。所有依赖「谁在滚动」的集成都必须拿到它:

```ts
const area = ref<InstanceType<typeof ScrollArea>>()
const virtualizer = useVirtualizer({ getScrollElement: () => area.value?.viewport ?? null })
```

`ScrollArea` 通过 `defineExpose` 暴露 `viewport` 与 `instance`。四项集成风险都已用真实浏览器验证(`ScrollArea.browser.test.ts`):

| spike        | 验证内容                                                     |
| ------------ | ------------------------------------------------------------ |
| 键盘导航跟随 | 聚焦视口外的条目时,自定义视口滚动到该项完全可见              |
| 虚拟滚动     | TanStack Virtual 绑到 viewport 后,滚动能推进渲染窗口         |
| 浮层跟随定位 | 滚动容器时 Floating UI 的 `autoUpdate` 重新定位              |
| SSR          | 服务端渲染出内容与地标语义,不触碰 `window`(`renderToString`) |

### 写这类测试的一个陷阱

**`overflow: hidden` 的元素仍然可以被程序化滚动** —— `scrollTop` 赋值和焦点驱动的滚动都不受影响,只有用户手势被挡。所以上面三个浏览器 spike 全部用程序化滚动,**测不出 `direction` 是否真的生效**;第一版把 `overflow: auto` 写在宿主上时,即使 OverlayScrollbars 完全没初始化,四个 spike 也照样全绿。

现在宿主不再自带 `overflow`,并且断言链里明确要求 `viewport !== 宿主元素`、`instance` 已存在;`direction` 另有三条用例直接读视口的计算 `overflow-x/y`。

## 有进必有出

**任意组件、任意位置,严格禁止无过渡的出现与消失,禁止无过渡的状态变更。**

最常见的破法不是忘了写动效,而是**只写了进场**:`v-if` 一撤,节点当场消失,进场做得再好也白做。所以本库不提供单向动画 —— **动效以「进出成对」为最小单位提供,一个 utility 同时定义两个方向**,让「只写进场」在物理上写不出来。

| utility                                 | 进场                    | 用于                                                     |
| --------------------------------------- | ----------------------- | -------------------------------------------------------- |
| `hn-anim-fade`                          | `base` + `enter`        | 遮罩、简单显隐                                           |
| `hn-anim-pop`                           | `base` + `enter`        | Tooltip / Popover / Menu,自动读 `data-side` 决定位移方向 |
| `hn-anim-modal`                         | `slow` + `enter-strong` | Dialog / AlertDialog                                     |
| `hn-anim-sheet-{top,bottom,left,right}` | `slow` + `enter-strong` | Drawer / Sheet                                           |
| `hn-anim-collapse`                      | `base` + `move`         | 高度展开,读 `--hn-collapse-h`                            |
| `hn-transition` / `hn-transition-base`  | —                       | 持久元素的状态变更                                       |

出场一律 `exit` 110ms + `ease-exit`,由 utility 自己带上,调用方不需要也不能单独指定。

三条配套规则:

- **条件渲染必须经过 presence 边界。**裸 `v-if` 不允许直接作用于可见元素 —— 用 Reka `Presence`(其 `Content` 组件已内置)、Vue `<Transition>`,或 motion-v `AnimatePresence`。没有它,`data-state="closed"` 根本来不及渲染,出场动画不会播。
- **`hn-anim-collapse` 需要宿主提供高度。**Reka 的 Accordion 与 Collapsible 暴露的变量名不同,所以本库统一读 `--hn-collapse-h`,由组件把对应的 Reka 变量赋给它。
- **持久元素的任何状态变更都要挂 `hn-transition`** —— 颜色、边框、阴影、透明度、位移。它是显式属性列表,不是 `transition-all`(后者在禁用清单里)。

### loading 的图标交接

`Button` 是这条规则第一个吃透的场景,后续所有带 loading 的组件按同样的模型做:

- **spinner 只顶掉主图标位** —— 有 `#icon` 用前置,否则用 `#trailing`。**其余图标位保持不变**:后置图标(→ ▾ ↗)是「这个按钮去哪」的语义标记,不是状态标记;spinner 已经表达了「进行中」,再抹掉一个无关指示不增加信息,只留下像渲染 bug 的空洞。
- **没有图标位时** spinner 居中覆盖,正文淡出。
- 图标位是**固定尺寸的盒子**,图标与 spinner 在其中绝对定位交叉淡入 —— 按钮宽度全程不变。
- 交接遵守非对称:进 `base` 180 + `scale-90`,出 `exit` 120。spinner 卸载走 `<Transition>`,能播完出场而不是直接消失。

### 唯一的例外

- **文本内容替换不做交叉淡入** —— 那看起来像故障而不是过渡。若容器尺寸随之变化,尺寸走 motion-v layout。
- **`prefers-reduced-motion` 下时长降到 1ms**,规则依然成立:仍然是过渡,只是不可感知,不是硬切。
- **首屏与水合导致的出现不属于「进场」,属于缺陷** —— 应当由 SSR 正确渲染消除,而不是补一个淡入去遮掩。

## 字体

西文 Plus Jakarta Sans,中文回落 Noto Sans SC。字体栈把西文放前面,西文字形命中 PJS,未覆盖的汉字自动落到 Noto。换字体只需改 `--hn-font-sans` 一处。

同一 `font-size` 下汉字几乎填满字身框、西文小写只占约一半,混排时西文看起来偏小。修正需要消费方控制 `@font-face`,因此不在本包内生效:

```css
@font-face {
  font-family: 'Plus Jakarta Sans';
  src: url('/fonts/plus-jakarta-sans.woff2') format('woff2');
  font-weight: 400 600;
  font-display: swap;
  size-adjust: 104%;
  ascent-override: 96%;
  descent-override: 24%;
}
```

`104%` 取自 `--hn-latin-size-adjust`,是起点值,需在预览工作台上用真实中英混排段落目视校准后定稿。`@nuxt/fonts` 默认把 Google Fonts 下载到本地自托管,正好满足控制 `@font-face` 的前提。

## 单例

`REQUIRED_SINGLETONS` 列明必须全局唯一的模块。浮层栈、焦点栈这类全局协调状态是模块级单例,多份实例并存时会各自维护一份栈,表现为**嵌套浮层无法按正确顺序关闭**。这类问题只在多实例场景暴露,单应用开发期完全看不到。

消费方据此配置构建即可,不需要去猜。

`src/lib/dev.ts` 的告警去重缓存是模块级 `Set`,但**不在单例清单内**:它只在 dev 生效、只影响告警是否重复打印,不参与任何运行时行为。多实例下最坏结果是同一条告警打印两次。行为性的全局状态(浮层栈、焦点栈)才必须登记。

## 开发期告警

a11y 缺陷在运行时静默失败 —— 图标按钮没有可访问名,视觉上完全正常,只有屏幕阅读器用户受影响。所以库在 dev 主动告警:

```ts
import { useAccessibleName } from '../../lib/a11y'

useAccessibleName('Button', () => !!props.iconOnly)
```

- `devWarn(scope, message, key?)` —— 统一前缀、**按 scope + key 去重**(一个 `v-for` 里 50 个无名图标按钮只报一次,不刷屏)。
- `useAccessibleName(scope, required)` —— 检查 `aria-label` / `aria-labelledby` / `title`,缺失即告警。
- `useRequiredLabel(scope, has, what)` —— 更一般的缺失检查,给 Dialog 标题、Select 标签这类用。

两者都以 `if (!import.meta.env.DEV) return` 开头,生产构建下整个函数体是死代码,`watchEffect` 不会注册。**已知消费方**:IconButton、CloseButton、CopyButton、Dialog、Select、Combobox、Image、Tabs —— 这是它上提到 `src/lib` 的依据。

两者都不从包根导出,属于实现细节。

## L0 约定

- **`Primitive`**(reka-ui)是多态渲染的唯一通道:需要 `as` / `asChild` 的组件都经它渲染,不手写标签分支。Reka 不出现在公共 API 里,保持可替换。
- **`VisuallyHidden`** 从本包导出(内部包 reka 的实现):需要给读屏器补充上下文时用它,不手写 `sr-only` 类堆。
- **Portal 约定:组件源码禁止裸 `<Teleport>`**(constraints 有机检)。浮层一律经 Reka 各组件自带的 Portal 部件,目标默认 `body`;统一的浮层栈模型(z-index、嵌套关闭顺序)在 S3 建立并登记进单例清单,在那之前不自造。

## 导出边界

`exports` 只暴露 `.` 与 `styles/tokens.css`。子域的 `composables/` 与 `utils/` **一律不导出** —— 它们是实现细节,一旦被通配导出就成了对外公共 API,以后改签名就是破坏性变更。需要公开的能力从 `src/index.ts` 显式导出。

## 测试

两层,分开跑:

| 命令                | 环境                 | 覆盖                                                      |
| ------------------- | -------------------- | --------------------------------------------------------- |
| `pnpm test`         | happy-dom            | 契约、变体映射、状态逻辑、开发期告警、`axe-core` 静态断言 |
| `pnpm test:browser` | Chromium(Playwright) | 真实焦点与键盘、tab 序列、计算样式、hover 状态层          |

分开是因为 **happy-dom 测不了焦点**:它没有真实的 tab 序列,`:focus-visible` 与 `getComputedStyle` 的结果都不可信。凡是断言这些的测试必须进 `*.browser.test.ts`,单测配置显式排除该后缀,避免误跑出假绿。

`axe-core` 关掉了 `color-contrast` 与 `region` 两条规则:前者在无布局的 happy-dom 下算不准(对比度由第 2 节的 token 设计与人工核算保证),后者是页面级规则,对孤立组件无意义。

**测试要能抓到回归才算数。**Button 的用例做过变异验证:移除点击守卫、篡改 spinner 位置逻辑、去掉告警去重,三处都能被对应用例抓出。写完新用例建议照此自查一次。

### 约束检查

`test/constraints.test.ts` 把前面所有规则编译成机器可查的断言,随 `pnpm test` 一起跑。**基调靠评审维持不住 —— 人会累、新人不知道、赶工期时第一个被牺牲;唯一可靠的做法是让跑调的写法在 CI 上直接红。**

| 检查                                                             | 来自              |
| ---------------------------------------------------------------- | ----------------- |
| 组件源码无字面量时长                                             | 动效 · 场景对照表 |
| 组件源码无字面量缓动曲线                                         | 动效 · 曲线表     |
| 禁止 `transition-all`                                            | 禁用清单          |
| 组件源码无硬编码颜色                                             | Token 三层        |
| 组件源码无字面量圆角                                             | Token 三层        |
| **组件源码零 `dark:`**                                           | Token 三层        |
| 字重不超过 600                                                   | 排版              |
| **无方向性物理属性**                                             | i18n · RTL        |
| 模块顶层不访问 `window`/`document`                               | SSR               |
| **CSS 变量引用无环**(DFS 全图)                                   | Token 三层        |
| 中性色阶三通道严格相等                                           | Token 三层        |
| 浅色底纯白 / 深色底纯黑                                          | Token 三层        |
| **实心 surface 文字对比度 ≥ 4.5:1**(12 组,解析 `var()` 链后实算) | Token 三层        |

最后一条不是查字面量,而是**解析 `var()` 引用链到具体色值再算对比度** —— 之前手工发现「浅色 accent 实心是 2.13:1」那个 bug,现在会自动红。

写检查时它立刻抓到了自身两处违规:`Spinner` 的 `border-r-transparent`(物理方向)和 `700ms`(字面量时长)。后者的正解不是加豁免,而是**补 `--hn-spin-duration` token** —— 规则说「查不到的场景说明缺 token」,这就是第一个实例。

### 浏览器测试的一次性准备

`vitest` 与 `@vitest/browser` **版本必须完全一致**(不是同 major,是同版本号),否则报 `does not provide an export named ...`。两者当前都钉在 `3.2.7`。

Chromium 需要系统库,首次在新机器 / CI 上执行一次:

```bash
npx playwright install chromium
sudo npx playwright install-deps chromium
```

缺库时的报错是 `libnspr4.so: cannot open shared object file`。**没有 root 时**可以把库解到本地目录再指路,不需要装进系统:

```bash
mkdir -p /tmp/pwlibs && cd /tmp/pwlibs
apt-get download libnspr4 libnss3
for f in *.deb; do dpkg -x "$f" x; done
mkdir -p lib && find x -name '*.so*' -exec cp -P {} lib/ \;

LD_LIBRARY_PATH=/tmp/pwlibs/lib pnpm test:browser
```

### 写浏览器测试的两个坑

**测试入口必须引 `test/browser.css`,不能直接引 `src/styles/tokens.css`。**后者不含 `@import 'tailwindcss'`,`@utility` 不会被编译成类 —— `hn-state-layer`、`hn-interactive`、`bg-accent` 全部不存在,而测试只会报"样式对不上",不会告诉你类根本没生成。

**读过渡中的属性要 `vi.waitFor`。**`userEvent.hover()` 一返回就 `getComputedStyle`,读到的是过渡起点(仍是 0),不是终值。这类断言必须轮询。

## S0 未完项

- ~~`tailwind-merge` 自定义 scale 扩展~~ 已完成并运行时验证:注册了 `text-md` 与五条 `ease-*`,以及 `hn-anim-*` / `hn-transition-*` 两个自定义 class group。`text-md` 是关键 —— 不注册会被归类成颜色,`text-sm text-md` 两个都留着。
- `--hn-latin-size-adjust` 的目视校准 —— 工作台已就绪(`pnpm --filter @hikarinagi/ui dev`,端口 3720)。
- ~~L0 剩余项:`Portal` / `VisuallyHidden` 约定~~ 已完成,见「L0 约定」;裸 `<Teleport>` 有机检。
- ~~Input / Card 两个设计探针~~ 已落地(`hn-field` utility 随之实装),与 Button 一起等设计语言签字。
- ~~浏览器测试~~ 已跑通,9/9,并做过 3 项变异验证。无 root 环境的运行方式见「测试」一节。
- ~~`ScrollArea` 与四项集成 spike~~ 已完成,四项全部在真实浏览器 / SSR 下验证通过,并做过 3 项变异验证。
- ~~CI 约束检查~~ 已完成:13 条断言在 `test/constraints.test.ts`,随 `pnpm test` 跑,做过 6 项变异验证。
