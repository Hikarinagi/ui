export function assert(
  expectedCondition: unknown,
  message = 'Assertion failed!',
): asserts expectedCondition {
  if (!expectedCondition) {
    console.error(message)
    throw new Error(message)
  }
}
