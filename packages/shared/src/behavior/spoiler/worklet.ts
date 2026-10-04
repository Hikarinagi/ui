declare function registerPaint(name: string, painter: unknown): void

const workletMain = () => {
  const M = Math

  const lcgrand =
    (seed = 1) =>
    (a = 0, b = 1) =>
      a +
      (M.abs(b - a) * (M.imul(48271, (seed = M.imul(214013, seed) + 2531011)) & 0x7fffffff)) /
        0x7fffffff

  const pol2vec = (l: number, a = 0) => [l * M.cos(a), l * M.sin(a)] as const
  const vecmag = ([x, y]: readonly number[]) => M.sqrt(x! * x! + y! * y!)
  const vecnorm = ([x, y]: readonly number[], l = vecmag([x!, y!])) =>
    l === 0 ? ([0, 0] as const) : ([x! / l, y! / l] as const)

  const trapezoidalWave = (l: number, a: number, b: number) => {
    const s = M.max(a, l - b)
    return (t: number) => {
      if (t < a) return M.max(0, t / a)
      if (t > s) return M.max(0, 1 - (t - s) / (l - s))
      return 1
    }
  }

  const cycle = (x: number, n: number) => ((x % n) + n) % n
  const mirror = (x: number, n: number, r: number) => (x < r ? n + x : x > n - r ? x - n : x)
  const clamp = (min: number, x: number, max: number) => M.max(min, M.min(x, max))

  const cycleBounds = ([x, y]: readonly number[], [w, h]: readonly number[], r: number) => {
    const tx = cycle(x!, w!)
    const ty = cycle(y!, h!)
    return [
      [tx, ty],
      [mirror(tx, w!, r), mirror(ty, h!, r)],
    ] as const
  }

  const easeOutCubic = (t: number) => --t * t * t + 1

  type World = { t: number; tStop: number; tStart: number; n: number }

  const animateFadeInOut = (world: World, idx: number, duration: number) => {
    const direction = world.tStop <= world.t ? 'out' : 'in'
    const animationStartT = direction === 'in' ? world.tStart : world.tStop
    const t = animationStartT + ((2 / 3) * duration * idx) / world.n
    const fadeFor = (1 / 3) * duration

    let progress = 0
    if (direction === 'in') {
      progress = (fadeFor + t - world.t) / fadeFor || 0
    } else {
      progress = (world.t - t) / fadeFor || 1
    }

    return easeOutCubic(1 - clamp(0, progress, 1))
  }

  const FAKE_WORDS = [5, 3, 4, 4, 2, 4, 7, 6, 8, 6, 3, 1, 6]

  const makeWordDistribution = (line: number, em: number, space: number) => {
    let marker = 0
    let i = 0
    let wordslen = 0
    const chunks: [number, number][] = []

    do {
      const endOfWord = M.min(line, marker + FAKE_WORDS[i++ % FAKE_WORDS.length]! * em)
      wordslen += endOfWord - marker
      chunks.push([marker, (marker = endOfWord)])
    } while ((marker += space) < line)

    if (chunks.length >= 0) chunks[chunks.length - 1]![1] = line

    return (t: number) => {
      const w = t * wordslen
      let m = 0
      for (const [start, end] of chunks) {
        const wordLength = end - start
        if (m < w && w <= m + wordLength) return start + w - m
        m += wordLength
      }
      return 0
    }
  }

  const getVar = (props: { get(name: string): unknown }, name: string) => {
    const val = props.get(name)
    if (typeof val === 'string') return val
    return String(val ?? '')
  }

  class HnSpoilerWorklet {
    static get contextOptions() {
      return { alpha: true }
    }

    static get inputProperties() {
      return [
        '--hn-nz-t',
        '--hn-nz-stop',
        '--hn-nz-fade',
        '--hn-nz-gap',
        '--hn-nz-accent',
        '--hn-nz-words',
        '--hn-nz-density',
      ]
    }

    paint(
      ctx: CanvasRenderingContext2D,
      size: { width: number; height: number },
      props: { get(name: string): unknown },
    ) {
      const rand = lcgrand(4011505)

      const accent = (getVar(props, '--hn-nz-accent') || '0 0% 0%').split(' ')
      const mimicWords = getVar(props, '--hn-nz-words').trim() === 'true'
      const vmin = 2
      const vmax = 12
      const width = size.width
      const height = size.height
      const gaps = (getVar(props, '--hn-nz-gap') || '0px 0px').split(' ').map(parseFloat)
      const hgap = gaps[0] ?? 0
      const vgap = gaps[1] ?? 0
      const density = parseFloat(getVar(props, '--hn-nz-density')) || 0.08
      const sizedev = (globalThis as { devicePixelRatio?: number }).devicePixelRatio! > 1 ? 0.5 : 0
      const fadeDuration = parseFloat(getVar(props, '--hn-nz-fade')) || 0

      const world: World = {
        t: parseFloat(getVar(props, '--hn-nz-t') || '0'),
        tStop: parseFloat(getVar(props, '--hn-nz-stop') || 'Infinity'),
        tStart: 0,
        n: M.round(M.min(5000, density * (width - 2 * hgap) * (height - 2 * vgap))),
      }

      const lineWidth = width - 2 * hgap
      const lineHeight = height - 2 * vgap

      const wordDist = mimicWords
        ? makeWordDistribution(lineWidth, lineHeight, M.max(12, lineHeight / 4))
        : (x: number) => x * (width - 2 * hgap)

      ctx.clearRect(0, 0, size.width, size.height)

      for (let i = 0; i < world.n; ++i) {
        const x0 = hgap + wordDist(rand())
        const y0 = rand(vgap, height - vgap)
        const v0mag = rand(vmin, vmax)
        const size0 = rand(1, 1 + sizedev)

        const l = parseInt(accent[2] ?? '0')
        const ldir = l > 50 ? -1 : 1
        const lightness = M.floor(clamp(0, l + ldir * rand(0, 30), 100))

        const v0 = pol2vec(v0mag, rand(0, M.PI * 2))
        const vx0 = v0[0]
        const vy0 = v0[1]
        vecnorm(v0)

        const shape = rand() > 0.5 ? 'square' : 'circle'
        const lifetime = rand(0.3, 1.5)
        const respawn = rand(0, 1)
        const visibilityFn = trapezoidalWave(lifetime, 0.15, 0.3)
        const phase = rand(0, lifetime + respawn)

        const cantSpawnNoMore =
          M.floor((world.tStop + phase) / (lifetime + respawn)) <
          M.floor((world.t + phase) / (lifetime + respawn))
        if (cantSpawnNoMore) continue

        const t = M.min(lifetime, (world.t + phase) % (lifetime + respawn))
        const x = x0 + vx0 * t
        const y = y0 + vy0 * t

        const fade = animateFadeInOut(world, i, fadeDuration)
        const alpha = fade * (1 - t / lifetime)
        const psize = fade * (size0 * visibilityFn(t))

        for (const [wx, wy] of cycleBounds([x, y], [width, height], psize / 2)) {
          ctx.beginPath()
          ctx.fillStyle = `hsl(${accent[0]} ${accent[1]} ${lightness}% / ${M.round(alpha * 100)}%)`
          if (shape === 'square') {
            ctx.rect(wx!, wy!, psize, psize)
          } else {
            ctx.arc(wx!, wy!, psize / 2, 0, M.PI * 2)
          }
          ctx.closePath()
          ctx.fill()
        }
      }
    }
  }

  registerPaint('hn-spoiler', HnSpoilerWorklet)
}

export const workletSource = `(${workletMain.toString()})()`
