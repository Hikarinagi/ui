export default {
  '*.{js,cjs,mjs,ts,tsx,vue,json,jsonc,md,yml,yaml,css}': files =>
    files.length ? [`prettier --write ${files.map(file => JSON.stringify(file)).join(' ')}`] : [],
}
