import { MINTSCAN_LOGO_IMG_URL } from 'constants/resources'
import { MINTSCAN_DOMAIN } from 'constants/url'
import { useMemo } from 'react'

type ExplorerLinkProps = {
  short?: boolean
  address?: string
  denom?: string
  validator?: string
}

export default function ExplorerLink({ short, address, denom, validator }: ExplorerLinkProps) {
  const href = useMemo<string>(() => {
    if (address) return `${MINTSCAN_DOMAIN}/crescent/account/${address}`
    if (denom) return `${MINTSCAN_DOMAIN}/crescent/assets`
    if (validator) return `${MINTSCAN_DOMAIN}/crescent/validators/${validator}`
    return `${MINTSCAN_DOMAIN}/crescent`
  }, [address, denom, validator])

  return (
    <a
      href={href}
      target="_blank"
      className="inline-flex flex-row items-center TYPO-BODY-XS underline text-black hover:text-grayCRE-400 dark:text-white dark:hover:text-grayCRE-200 text-left"
      rel="noreferrer"
    >
      <img src={MINTSCAN_LOGO_IMG_URL} alt="" className="w-3 h-3 mr-1" />
      {!short && <div>Mintscan →</div>}
    </a>
  )
}
