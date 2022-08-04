export const openExplorerByHeight = (height?: string) => {
  const tail = height ? `/${height}` : ''
  window.open(`https://www.mintscan.io/crescent/blocks${tail}`, '_blank')
}

export const openExplorerByAccount = (address: string) => {
  window.open(`https://www.mintscan.io/crescent/account/${address}`, '_blank')
}

export const openProposalById = (proposalId: number) => {
  window.open(`https://www.mintscan.io/crescent/proposals/${proposalId}`, '_blank')
}
