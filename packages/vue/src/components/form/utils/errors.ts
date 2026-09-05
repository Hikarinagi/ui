import {
  isStandardSchema,
  type FormErrors,
  type FormRules,
  type FormValues,
  type StandardSchemaIssue,
} from '../standard-schema'

export const ROOT = ''

export function issueKey(issue: StandardSchemaIssue) {
  return (issue.path ?? [])
    .map(part => String(typeof part === 'object' && part !== null ? part.key : part))
    .join('.')
}

export function issuesToErrors(issues: ReadonlyArray<StandardSchemaIssue>): FormErrors {
  const errors: FormErrors = {}
  for (const issue of issues) {
    const key = issueKey(issue)
    if (!(key in errors)) errors[key] = issue.message
  }
  return errors
}

export function readPath(values: FormValues, key: string): unknown {
  return key
    .split('.')
    .reduce<unknown>(
      (current, part) =>
        current && typeof current === 'object'
          ? (current as Record<string, unknown>)[part]
          : undefined,
      values,
    )
}

export async function runRules(
  rules: FormRules | undefined,
  values: FormValues,
): Promise<FormErrors> {
  if (!rules) return {}
  if (isStandardSchema(rules)) {
    const result = await rules['~standard'].validate(values)
    return result.issues ? issuesToErrors(result.issues) : {}
  }
  return await rules(values)
}
