import { MINTSCAN_LOGO_IMG_URL } from 'constants/resources'
import { MINTSCAN_DOMAIN } from 'constants/url'
import { useMemo } from 'react'

type ExplorerLinkProps = {
  address?: string
  denom?: string
}

export default function ExplorerLink({ address, denom }: ExplorerLinkProps) {
  const href = useMemo<string>(() => {
    if (address) return `${MINTSCAN_DOMAIN}/crescent/account/${address}`
    if (denom) return `${MINTSCAN_DOMAIN}/crescent/assets`
    return `${MINTSCAN_DOMAIN}/crescent`
  }, [address, denom])

  return (
    <a
      href={href}
      target="_blank"
      className="inline-flex flex-row items-center TYPO-BODY-XS underline text-black hover:text-grayCRE-400 dark:text-white dark:hover:text-grayCRE-200 text-left"
      rel="noreferrer"
    >
      <img src={MINTSCAN_LOGO_IMG_URL} alt="" className="w-3 h-3 mr-1" />
      <div>Mintscan →</div>
    </a>
  )
}
