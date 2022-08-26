// eslint-disable-next-line no-restricted-imports
import 'tippy.js/dist/tippy.css'

import Tippy from '@tippyjs/react'
import { ReactNode } from 'react'

export default function Tooltip({ children, content }: { children: ReactNode; content?: string | JSX.Element }) {
  return content ? (
    <Tippy
      arrow={false}
      content={content}
      className="!w-max !max-w-md border border-grayCRE-50 dark:border-grayCRE-400 !bg-white-o dark:!bg-grayCRE-400-o backdrop-blur-[40px] TYPO-BODY-S !text-black dark:!text-white !whitespace-pre text-left"
    >
      <button type="button">{children}</button>
    </Tippy>
  ) : (
    <>{children}</>
  )
}
