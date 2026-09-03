export default defineEventHandler(event =>
  proxyRequest(event, `https://www.hikarinagi.org/api/v3/tags${getRequestURL(event).search}`),
)
