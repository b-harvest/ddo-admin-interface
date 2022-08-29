import IconButton from 'components/IconButton'
import { PENALTY_STATUS, WARNING_STATUS_ICON_TYPE_MAP } from 'constants/lsv'

const WARN_BUTTON_CSS = `TYPO-BODY-M w-[40px] flex justify-center`

export default function LSVWarningButton({ onClick, status }: { onClick: () => void; status: PENALTY_STATUS }) {
  return (
    <>
      <IconButton
        type={WARNING_STATUS_ICON_TYPE_MAP[status]}
        onClick={onClick}
        className={`${WARN_BUTTON_CSS} ${getButtonCSS(status)}`}
      />
    </>
  )
}

function getButtonCSS(status: PENALTY_STATUS) {
  switch (status) {
    case PENALTY_STATUS.NotYet:
      return 'text-grayCRE-300 hover:text-grayCRE-200'
    default:
      return 'text-warning'
  }
}
