const POST_CSS = `flex items-stretch gap-1 TYPO-BODY-XS`
const POST_FIELD_CSS = `grow shrink text-grayCRE-300 dark:text-grayCRE-400 whitespace-nowrap`

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
      <div className="grow shrink w-full">{value}</div>
    </div>
  )
}
