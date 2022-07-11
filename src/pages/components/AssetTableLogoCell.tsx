interface AssetTableLogoCellProps {
  assets: { logoUrl: string; ticker: string }[]
}

export default function AssetTableLogoCell({ assets }: AssetTableLogoCellProps) {
  const title = assets.reduce((accm, asset) => `${accm}${accm.length ? '\n/' : ''}${asset.ticker}`, '')
  return (
    <div className="flex justify-start items-center space-x-2" title={title}>
      <div className="flex justify-start items-center w-12">
        {assets.map((asset) => (
          <div key={asset.ticker} className="flex justify-center items-center w-6 h-6">
            <img src={asset.logoUrl} alt={asset.ticker} className="w-full object-contain"></img>
          </div>
        ))}
      </div>
      <span className="block TYPO-BODY-XS !font-black whitespace-pre-line md:whitespace-normal md:TYPO-BODY-S">
        {title}
      </span>
    </div>
  )
}
