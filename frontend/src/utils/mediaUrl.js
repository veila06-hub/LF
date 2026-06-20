export function mediaUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  if (path.startsWith('/')) return path
  return `/${path}`
}
