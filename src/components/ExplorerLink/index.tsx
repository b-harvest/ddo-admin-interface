import { MINTSCAN_LOGO_IMG_URL } from 'constants/resources'
import { MINTSCAN_DOMAIN } from 'constants/url'
import { useMemo } from 'react'

type ExplorerLinkProps = {
  label?: string
  short?: boolean
  address?: string
  denom?: string
  validator?: string
  proposalId?: number
}

export default function ExplorerLink({ label, short, address, denom, validator, proposalId }: ExplorerLinkProps) {
  const href = useMemo<string>(() => {
    if (address) return `${MINTSCAN_DOMAIN}/crescent/account/${address}`
    if (denom) return `${MINTSCAN_DOMAIN}/crescent/assets`
    if (validator && validator !== 'all') return `${MINTSCAN_DOMAIN}/crescent/validators/${validator}`
    if (validator) return `${MINTSCAN_DOMAIN}/crescent/validators`
    if (proposalId) return `${MINTSCAN_DOMAIN}/crescent/proposals/${proposalId}`
    return `${MINTSCAN_DOMAIN}/crescent`
  }, [address, denom, validator, proposalId])

  return (
    <a
      href={href}
      target="_blank"
      className="inline-flex flex-row items-center TYPO-BODY-XS underline text-black hover:text-grayCRE-400 dark:text-white dark:hover:text-grayCRE-200 text-left"
      rel="noreferrer"
    >
      <img src={MINTSCAN_LOGO_IMG_URL} alt="" className="w-3 h-3 mr-1" />
      {!short && <div>{label ?? 'Mintscan'} →</div>}
    </a>
  )
}
