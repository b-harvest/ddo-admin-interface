const POST_CSS = `space-x-1 TYPO-BODY-S md:TYPO-BODY-XS`
const POST_FIELD_CSS = `inline text-grayCRE-300 dark:text-grayCRE-400 whitespace-nowrap`
const POST_VALUE_CSS = `inline w-full whitespace-pre-line`

export default function PostMetaDataLine({
  field,
  value,
  fieldSizeRatio = 'auto',
}: {
  field: string
  value: string | JSX.Element
  fieldSizeRatio?: number | 'auto'
}) {
  return (
    <div className={POST_CSS}>
      <div
        className={POST_FIELD_CSS}
        style={{ flexBasis: fieldSizeRatio === 'auto' ? fieldSizeRatio : `${fieldSizeRatio}%` }}
      >
        {field}
      </div>
      <div className={POST_VALUE_CSS} style={{ wordBreak: 'keep-all' }}>
        {value}
      </div>
    </div>
  )
}
