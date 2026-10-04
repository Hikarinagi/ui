import ts from 'typescript'

export interface Member {
  name: string
  required: boolean
  type: string
  values?: string[]
  callable: boolean
}

export interface Slot {
  name: string
  scoped: boolean
}

export interface Attribute {
  name: string
  directory: string
}

export interface VueSurface {
  name: string
  directory: string
  props: Member[]
  models: string[]
  events: string[]
  slots: Slot[]
  exposed: string[]
  attributes: Attribute[]
}

export interface ReactMember extends Member {
  own: boolean
  node: boolean
}

export interface ReactSurface {
  name: string
  props: ReactMember[]
  handle?: { element: boolean; members: string[] }
}

export function valuesOf(checker: ts.TypeChecker, type: ts.Type | undefined) {
  if (!type) return undefined
  const parts = type.isUnion() ? type.types : [type]
  const values = new Set<string>()
  for (const part of parts) {
    const flags = part.flags
    if (flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null | ts.TypeFlags.Void)) continue
    if (part.isStringLiteral()) values.add(JSON.stringify(part.value))
    else if (part.isNumberLiteral()) values.add(String(part.value))
    else if (flags & ts.TypeFlags.BooleanLiteral) values.add(checker.typeToString(part))
    else if (flags & ts.TypeFlags.String) values.add('string')
    else if (flags & ts.TypeFlags.Number) values.add('number')
    else return undefined
  }
  if (values.has('true') && values.has('false')) {
    values.delete('true')
    values.delete('false')
    values.add('boolean')
  }
  return values.size ? [...values].sort() : undefined
}
