import Card from 'components/Card'
import EmptyData from 'components/EmptyData'
import Icon from 'components/Icon'
import IconButton from 'components/IconButton'
import QuestionTooltip from 'components/QuestionTooltip'
import Tooltip from 'components/Tooltip'
import { FIELD_CSS } from 'constants/style'

type DynamicListProps = {
  title: string
  titleDesc?: string
  memo: JSX.Element | null
  allGood?: boolean
  onAddButtonClick?: () => void
  addButtonLabel?: string
  list: JSX.Element[]
  emptyLabel?: string
}

export default function DynamicList({
  title,
  titleDesc,
  memo,
  allGood = false,
  onAddButtonClick,
  addButtonLabel = 'Click to add',
  list,
  emptyLabel,
}: DynamicListProps) {
  return (
    <section>
      <header className="flex justify-between items-center gap-2 mb-2">
        <div className="flex justify-start items-stretch gap-2">
          <ListTitle title={title} desc={titleDesc}></ListTitle>
          <div className="flex justify-start items-center">
            <div className="flex items-center gap-4 px-4 border-l border-grayCRE-300 dark:border-grayCRE-500">
              {allGood && <Icon type="success" className="text-success" />}
              {memo}
            </div>
          </div>
        </div>

        {onAddButtonClick !== undefined ? (
          <Tooltip content={addButtonLabel}>
            <IconButton type="plus" className="px-2 hover:opacity-40" onClick={onAddButtonClick} />
          </Tooltip>
        ) : null}
      </header>

      {list.length > 0 ? (
        <Card useGlassEffect={true} useNarrow={true} className="flex flex-col gap-x-4 gap-y-4 md:gap-y-2">
          {list}
        </Card>
      ) : (
        <EmptyData label={emptyLabel} />
      )}

      {/* {body !== null && <div className={`flex flex-col items-stretch gap-2 transition-all`}>{body}</div>} */}
    </section>
  )
}

function ListTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="grow-0 shrink-0 basis-auto flex justify-start items-center gap-2">
      <div className={FIELD_CSS}>{title}</div>
      {desc ? <QuestionTooltip desc={desc} /> : null}
    </div>
  )
}
