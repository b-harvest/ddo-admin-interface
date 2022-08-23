import Icon from 'components/Icon'
import Tooltip from 'components/Tooltip'

export default function QuestionTooltip({ desc }: { desc: string }) {
  return (
    <Tooltip content={desc}>
      <Icon type="question" className="text-grayCRE-300 hover:text-grayCRE-200 dark:hover:text-grayCRE-400" />
    </Tooltip>
  )
}
