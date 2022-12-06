import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { isDarkModeAtomRef } from 'state/atoms'
import { isNthChild } from 'utils/css'

export default function LoadingRows({ rowsCnt }: { rowsCnt: number }) {
  const rows = useMemo<number[]>(() => {
    return new Array(rowsCnt < 0 || Number.isNaN(rowsCnt) ? 0 : rowsCnt).fill(0)
  }, [rowsCnt])

  const [isDarkModeAtom] = useAtom(isDarkModeAtomRef)

  return (
    <div className="min-w-[75%] max-w-[100%] grid grid-cols-3 gap-x-[0.5em] gap-y-[0.8em]">
      {rows.map((_, index) => (
        <div
          key={index}
          className={`rounded-xl h-[2.4em] animate-loading-bg ${
            rowsCnt === 1
              ? 'col-span-3'
              : isNthChild(index + 1, 4, 1)
              ? 'col-start-1 col-end-3'
              : isNthChild(index + 1, 4, 0)
              ? 'col-start-3 col-end-4'
              : ''
          }`}
          style={{
            willChange: 'background-position',
            background: isDarkModeAtom
              ? 'linear-gradient(to left, rgb(23 23 23) 25%, rgb(38 38 38) 50%, rgb(23 23 23) 75%)'
              : 'linear-gradient(to left, #EEEEEE 25%, #fff 50%, #EEEEEE 75%)',
            backgroundSize: '400%',
          }}
        ></div>
      ))}
    </div>
  )
}
