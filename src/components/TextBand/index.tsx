const DEFAULT_BAND_BG_COLOR_CLASS = 'bg-rose-600'
const DEFAULT_BAND_TEXT_COLOR_CLASS = 'text-white'

type TextBandProps = {
  label: string
  thin?: boolean
  bgColorClass?: string
  textColorClass?: string
}

export default function TextBand({ label, thin = false, bgColorClass, textColorClass }: TextBandProps) {
  return (
    <div
      className={`w-full h-6 flex justify-center items-center ${
        bgColorClass ?? DEFAULT_BAND_BG_COLOR_CLASS
      } TYPO-BODY-S ${textColorClass ?? DEFAULT_BAND_TEXT_COLOR_CLASS} ${thin ? '' : '!font-black'}`}
    >
      {label}
    </div>
  )
}
