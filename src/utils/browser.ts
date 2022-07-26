export const openExplorerByHeight = (height?: string) => {
  const tail = height ? `/${height}` : ''
  window.open(`https://www.mintscan.io/crescent/blocks${tail}`, '_blank')
}
