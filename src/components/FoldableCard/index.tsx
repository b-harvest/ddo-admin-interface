import Card from 'components/Card'
import IconButton from 'components/IconButton'
import { ReactNode, useEffect, useState } from 'react'

export default function FoldableCard({
  children,
  folded,
  defaultShowFolded = true,
  showFoldButton = true,
}: {
  children: ReactNode
  folded: JSX.Element | null
  defaultShowFolded?: boolean
  showFoldButton?: boolean
}) {
  const [showFolded, setShowFolded] = useState<boolean>(false)
  const onFoldButtonClick = () => {
    setShowFolded(!showFolded)
  }

  useEffect(() => setShowFolded(defaultShowFolded), [defaultShowFolded])

  return (
    <div>
      <Card
        useGlassEffect={true}
        useNarrow={true}
        className={`${
          folded !== null
            ? `cursor-pointer hover:bg-grayCRE-100 dark:hover:bg-neutral-700 ${
                showFolded ? '!bg-grayCRE-100 dark:!bg-neutral-700' : ''
              }`
            : ''
        } ${showFoldButton ? 'pr-14' : ''} ${folded !== null && showFolded ? 'mt-4' : ''} transition-all`}
      >
        {children}
        {showFoldButton && (
          <IconButton
            type={showFolded ? 'expandless' : 'expandmore'}
            onClick={onFoldButtonClick}
            className="absolute right-4 w-6 h-6"
          />
        )}
      </Card>

      {/* foldable area */}
      {folded !== null && (
        <div
          className={`flex flex-col items-stretch gap-2 transition-all ${
            showFolded ? 'visible opacity-100 max-h-full mt-1 mb-4' : 'invisible opacity-0 max-h-0'
          }`}
        >
          {folded}
        </div>
      )}
    </div>
  )
}
