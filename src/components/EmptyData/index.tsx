import LoadingRows from 'components/LoadingRows'
export default function EmptyData({
  label,
  isLoading = false,
  loadingRowsCnt = 4,
  useNarrow = false,
}: {
  label?: string | JSX.Element
  isLoading?: boolean
  loadingRowsCnt?: number
  useNarrow?: boolean
}) {
  return (
    <div
      className={`w-full text-center bg-grayCRE-200 dark:bg-neutral-800 TYPO-BODY-S text-grayCRE-400 !font-bold transition-all ${
        useNarrow ? 'rounded-lg p-2' : 'rounded-xl p-4'
      }`}
    >
      {isLoading ? <LoadingRows rowsCnt={loadingRowsCnt} /> : label}
    </div>
  )
}
