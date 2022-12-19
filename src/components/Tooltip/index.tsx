// eslint-disable-next-line no-restricted-imports
import 'tippy.js/dist/tippy.css'

import Tippy from '@tippyjs/react'
import { ReactNode } from 'react'

type TooltipProps = { children: ReactNode; content?: string | JSX.Element; wrapperClassName?: string }

export default function Tooltip({ children, content, wrapperClassName = '' }: TooltipProps) {
  return content ? (
    <Tippy
      arrow={false}
      content={content}
      className={`!w-max !max-w-md border border-grayCRE-50 dark:border-grayCRE-400 !bg-white-o dark:!bg-grayCRE-400-o backdrop-blur-[40px] TYPO-BODY-S !text-black dark:!text-white !whitespace-pre-line text-left`}
    >
      {/* <button type="button">{children}</button> */}
      <div className={wrapperClassName}>{children}</div>
    </Tippy>
  ) : (
    <>{children}</>
  )
}
