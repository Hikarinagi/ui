declare const process: { env: { NODE_ENV?: string } }

export function isDevelopment() {
  return process.env.NODE_ENV !== 'production'
}
