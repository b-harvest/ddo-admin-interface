import IconButton from 'components/IconButton'
import { PENALTY_TYPE_ICON_MAP } from 'constants/lsv'
import { PENALTY_STATUS } from 'types/lsv'

const WARN_BUTTON_CSS = `TYPO-BODY-M w-[40px] flex justify-center`

export default function LSVWarningButton({ onClick, status }: { onClick: () => void; status: PENALTY_STATUS }) {
  return (
    <>
      <IconButton
        type={PENALTY_TYPE_ICON_MAP[status]}
        onClick={onClick}
        className={`${WARN_BUTTON_CSS} ${getButtonCSS(status)}`}
      />
    </>
  )
}

function getButtonCSS(status: PENALTY_STATUS) {
  switch (status) {
    case PENALTY_STATUS.NotConfirmed:
      return 'text-grayCRE-300 hover:text-grayCRE-200'
    default:
      return 'text-warning'
  }
}
