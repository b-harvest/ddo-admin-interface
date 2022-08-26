const POST_CSS = `flex items-center gap-1 TYPO-BODY-XS`
const POST_FIELD_CSS = `text-grayCRE-300 dark:text-grayCRE-400`

export default function PostMetaDataLine({ field, value }: { field: string; value: string | JSX.Element }) {
  return (
    <div className={`${POST_CSS}`}>
      <div className={POST_FIELD_CSS}>{field}</div>
      <div>{value}</div>
    </div>
  )
}
