export interface StandardSchemaIssue {
  message: string
  path?: ReadonlyArray<PropertyKey | { key: PropertyKey }>
}

export interface StandardSchemaResult {
  value?: unknown
  issues?: ReadonlyArray<StandardSchemaIssue>
}

export interface StandardSchema {
  '~standard': {
    version: 1
    vendor: string
    validate: (value: unknown) => StandardSchemaResult | Promise<StandardSchemaResult>
  }
}

export type FormValues = Record<string, unknown>
export type FormErrors = Record<string, string>
export type FormValidator = (values: FormValues) => FormErrors | Promise<FormErrors>
export type FormRules = StandardSchema | FormValidator

export function isStandardSchema(rules: FormRules): rules is StandardSchema {
  return typeof rules === 'object' && rules !== null && '~standard' in rules
}
