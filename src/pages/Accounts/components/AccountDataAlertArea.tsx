import BigNumber from 'bignumber.js'
import AlertBox from 'components/AlertBox'
import { ERROR_MSG_BACKEND_TIMESTAMP_DIFF, ERROR_MSG_DATA_DIFF, SUCCESS_MSG_ALL_DATA_MATCHED } from 'constants/msg'

export default function AccountDataAlertArea({
  isDataTimeDiff,
  isDataNotMatched,
  isAllDataMatched,
  significantTimeGap,
  isActive,
}: {
  isDataTimeDiff: boolean
  isDataNotMatched: boolean
  isAllDataMatched: boolean
  significantTimeGap: number
  isActive: boolean
}) {
  return (
    <div
      className={`${
        isActive ? 'block' : 'hidden opacity-0'
      } flex flex-col justify-start items-start transition-opacity`}
    >
      <div className="flex flex-col space-y-2 w-full">
        <AlertBox
          msg={`${ERROR_MSG_BACKEND_TIMESTAMP_DIFF} ≧ ${new BigNumber(significantTimeGap).toFormat(0)}ms`}
          status="error"
          isActive={isDataTimeDiff}
        />
        <AlertBox msg={ERROR_MSG_DATA_DIFF} status="error" isActive={isDataNotMatched} />
        <AlertBox msg={SUCCESS_MSG_ALL_DATA_MATCHED} status="success" isActive={isAllDataMatched} />
      </div>
    </div>
  )
}
