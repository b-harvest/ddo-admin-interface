interface AssetTableLogoCellProps {
  assets: { logoUrl: string; ticker: string }[]
  poolDenom?: string
  isSingleAssetAutoSpaced?: boolean
  hideTicker?: boolean
  nowrap?: boolean
}

export default function AssetTableLogoCell({
  assets,
  poolDenom,
  isSingleAssetAutoSpaced = false,
  hideTicker = false,
  nowrap = false,
}: AssetTableLogoCellProps) {
  const title = assets.reduce((accm, asset) => `${accm}${accm.length ? '/' : ''}${asset.ticker}`, '')
  return (
    <div
      className={`flex ${
        nowrap ? 'space-x-2 space-y-0' : 'flex-col space-x-0 space-y-1'
      } md:flex-row justify-start items-start md:items-center md:space-y-0 md:space-x-2`}
      title={title}
    >
      <div className={`flex justify-start items-center ${isSingleAssetAutoSpaced || hideTicker ? 'w-fit' : 'w-12'}`}>
        {assets.map((asset) => (
          <div key={asset.ticker} className="flex justify-center items-center w-6 h-6">
            <img src={asset.logoUrl} alt={asset.ticker} className="w-full object-contain"></img>
          </div>
        ))}
      </div>
      {hideTicker ? null : (
        <span className="block TYPO-BODY-XS !font-black whitespace-pre-line md:whitespace-normal md:TYPO-BODY-S">
          <span className="block md:hidden">{poolDenom}</span>
          <span className={`${poolDenom ? 'hidden md:block' : ''}`}>{title}</span>
        </span>
      )}
    </div>
  )
}
