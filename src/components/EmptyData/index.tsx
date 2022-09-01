import Card from 'components/Card'
import LoadingRows from 'components/LoadingRows'

export default function EmptyData({
  label,
  isLoading = false,
  loadingRowsCnt = 4,
  useNarrow = false,
  useGlassEffect = false,
}: {
  label?: string | JSX.Element
  isLoading?: boolean
  loadingRowsCnt?: number
  useNarrow?: boolean
  useGlassEffect?: boolean
}) {
  return (
    <Card
      className={`w-full text-center TYPO-BODY-S text-grayCRE-400 !font-bold transition-all ${useNarrow ? 'p-2' : ''}`}
      useNarrow={useNarrow}
      useGlassEffect={useGlassEffect}
    >
      {isLoading ? <LoadingRows rowsCnt={loadingRowsCnt} /> : label}
    </Card>
  )
}
