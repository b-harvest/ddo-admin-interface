import { TokenTypes } from 'constants/asset'
import type { AssetTicker } from 'types/asset'

type AssetLogoLabelTextSize = 'sm' | 'md' | 'lg'

interface AssetLogoLabelProps {
  assets: AssetTicker[]
  poolDenom?: string
  isSingleAssetAutoSpaced?: boolean
  hideTicker?: boolean
  nowrap?: boolean
  textSize?: AssetLogoLabelTextSize
  tokenType?: TokenTypes
}

export default function AssetLogoLabel({
  assets,
  poolDenom,
  isSingleAssetAutoSpaced = false,
  hideTicker = false,
  nowrap = false,
  textSize = 'sm',
  tokenType,
}: AssetLogoLabelProps) {
  const title =
    assets.length > 0 ? assets.reduce((accm, asset) => `${accm}${accm.length ? '/' : ''}${asset.ticker}`, '') : '-'

  const isLFToken = tokenType === TokenTypes.LF

  return (
    <div
      className={`flex ${
        nowrap ? 'items-center space-x-2 space-y-0' : 'flex-col items-start space-x-0 space-y-1'
      } md:flex-row justify-start md:items-center md:space-y-0 md:space-x-2 text-black dark:text-white`}
      title={title}
    >
      <div
        className={`flex justify-start items-center rounded-full overflow-hidden ${
          isSingleAssetAutoSpaced || hideTicker ? 'w-fit' : 'w-12'
        } ${isLFToken && assets.length === 2 ? 'bg-LF p-[1px]' : ''}`}
      >
        {assets.length < 1 && (
          <div className="w-6 h-6 rounded-full overflow-hidden bg-grayCRE-50 dark:bg-neutral-900"></div>
        )}
        {assets.map((asset) => (
          <div key={asset.ticker} className="flex justify-center items-center w-6 h-6 rounded-full overflow-hidden">
            <img src={asset.logoUrl} alt={asset.ticker} className="w-full object-contain"></img>
          </div>
        ))}
      </div>
      {hideTicker ? null : (
        <span
          style={{ wordBreak: 'keep-all' }}
          className={`block text-left !font-black whitespace-pre-line md:whitespace-normal ${getTypoClassBySize(
            textSize
          )}`}
        >
          <span className="block md:hidden">{poolDenom}</span>
          <span className={`${poolDenom ? 'hidden md:block' : ''}`}>{title}</span>
        </span>
      )}
    </div>
  )
}

function getTypoClassBySize(textSize: AssetLogoLabelTextSize) {
  switch (textSize) {
    case 'sm':
      return `TYPO-BODY-XS md:TYPO-BODY-S`
    case 'md':
      return `TYPO-BODY-S md:TYPO-BODY-M`
    case 'lg':
      return `TYPO-BODY-M md:TYPO-BODY-L`
    default:
      return ``
  }
}
