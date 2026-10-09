export function areEqual<T>(arrayA: T[], arrayB: T[]): boolean {
  if (arrayA.length !== arrayB.length) return false
  for (let index = 0; index < arrayA.length; index++)
    if (arrayA[index] !== arrayB[index]) return false
  return true
}
