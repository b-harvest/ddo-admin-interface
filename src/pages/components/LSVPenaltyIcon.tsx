import Icon from 'components/Icon'
import { PENALTY_TYPE_COLOR_MAP, PENALTY_TYPE_ICON_MAP } from 'constants/lsv'
import { Penalty, PENALTY_STATUS } from 'types/lsv'

export default function LSVPenaltyIcon({
  penalty,
  ignoreDiscarded = true,
}: {
  penalty: Penalty
  ignoreDiscarded?: boolean
}) {
  return (
    <Icon
      type={PENALTY_TYPE_ICON_MAP[penalty.type]}
      className={`${PENALTY_TYPE_COLOR_MAP[penalty.type]} ${
        penalty.status === PENALTY_STATUS.Discarded
          ? ignoreDiscarded
            ? 'hidden'
            : 'opacity-50 !text-grayCRE-400'
          : penalty.status === PENALTY_STATUS.NotConfirmed
          ? ''
          : 'opacity-50'
      }`}
    />
  )
}
