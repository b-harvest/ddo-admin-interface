import { COMMONWEALTH_LOGO_IMG_URL } from 'constants/resources'
import { COMMONWEALTH_DOMAIN } from 'constants/url'
import { useMemo } from 'react'

type ExplorerLinkProps = {
  label?: string
  short?: boolean
  discussionId?: string | number
}

export default function CommonwealthLink({ label, short, discussionId }: ExplorerLinkProps) {
  const href = useMemo<string>(() => {
    if (discussionId) return `${COMMONWEALTH_DOMAIN}/crescent-forum/discussion/${discussionId}`
    return `${COMMONWEALTH_DOMAIN}/crescent-forum`
  }, [discussionId])

  return (
    <a
      href={href}
      target="_blank"
      className="inline-flex flex-row items-center TYPO-BODY-XS underline text-black hover:text-grayCRE-400 dark:text-white dark:hover:text-grayCRE-200 text-left"
      rel="noreferrer"
    >
      <img src={COMMONWEALTH_LOGO_IMG_URL} alt="" className="w-3 h-3 mr-1" />
      {!short && <div>{label ?? 'Commonwealth'} →</div>}
    </a>
  )
}
