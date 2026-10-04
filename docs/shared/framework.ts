export type Framework = 'vue' | 'react'

const OPEN = /^\s*:::\s*(vue|react)\s*$/
const CLOSE = /^\s*:::\s*$/
const FENCE = /^\s*(`{3,}|~{3,})(.*)$/
const BLANK = /^\s*$/

export function frameworkView(source: string, framework: Framework): string {
  if (!source.includes(':::')) return source
  const output: string[] = []
  let block: { framework: Framework; line: number; start: number } | undefined
  let fence: string | undefined
  let dropBlank = false
  for (const [index, line] of source.split('\n').entries()) {
    if (dropBlank) {
      dropBlank = false
      if (BLANK.test(line)) continue
    }
    const marker = FENCE.exec(line)
    if (fence) {
      if (
        marker &&
        marker[1]![0] === fence[0] &&
        marker[1]!.length >= fence.length &&
        BLANK.test(marker[2]!)
      )
        fence = undefined
    } else if (marker) {
      fence = marker[1]
    } else {
      const open = OPEN.exec(line)
      if (open) {
        if (block)
          throw new Error(
            `::: ${open[1]} at line ${index + 1} opens inside the ::: ${block.framework} block from line ${block.line}`,
          )
        block = { framework: open[1] as Framework, line: index + 1, start: output.length }
        dropBlank = open[1] === framework
        continue
      }
      if (block && CLOSE.test(line)) {
        if (block.framework === framework) {
          if (output.length > block.start && BLANK.test(output[output.length - 1]!)) output.pop()
        } else dropBlank = !output.length || BLANK.test(output[output.length - 1]!)
        block = undefined
        continue
      }
    }
    if (block && block.framework !== framework) continue
    output.push(line)
  }
  if (block) throw new Error(`::: ${block.framework} block from line ${block.line} is never closed`)
  return output.join('\n')
}

interface Parser {
  parse(source: string, env?: object): unknown
}

export function frameworkBlocks(framework: Framework) {
  return (md: Parser) => {
    const parse = md.parse.bind(md)
    md.parse = (source: string, env?: object) => parse(frameworkView(source, framework), env)
  }
}
