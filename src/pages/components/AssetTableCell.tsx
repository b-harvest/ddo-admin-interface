export default function AssetTableCell({ ticker, logoUrl }: { ticker: string; logoUrl: string }) {
  return (
    <div className="flex justify-start items-center" title={ticker}>
      {logoUrl.length > 0 ? (
        <div className="flex justify-center items-center w-6 h-6 mr-2">
          <img src={logoUrl} alt={ticker} className="w-full object-contain"></img>
        </div>
      ) : null}
      <span className="TYPO-BODY-XS !font-black">{ticker}</span>
    </div>
  )
}
