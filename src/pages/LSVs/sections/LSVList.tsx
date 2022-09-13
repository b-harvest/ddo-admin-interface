import BigNumber from 'bignumber.js'
import TableList from 'components/TableList'
import TimestampMemo from 'components/TimestampMemo'
import Tooltip from 'components/Tooltip'
import { SAFE_VOTING_RATE } from 'constants/lsv'
import useLSVPenalty from 'hooks/useLSVPenalty'
import LSVPenaltyIcon from 'pages/components/LSVPenaltyIcon'
import { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { LSV, Penalty, PENALTY_STATUS, PENALTY_TYPE } from 'types/lsv'

type LSVAdditional = {
  blockCommitTime: BigNumber | undefined
  blockCommitTimeLabel: string
  aliasLabel: JSX.Element
  statusTag: JSX.Element | null
  filter?: string[]
}

export default function LSVList({
  timestamp,
  list,
  isLoading,
}: {
  timestamp?: number
  list: LSV[]
  isLoading: boolean
}) {
  const allLSVTableList = useMemo<(LSV & LSVAdditional)[]>(() => {
    return list.map((item) => {
      const blockCommitTime = item.lastProposingBlock
        ? new BigNumber(item.lastProposingBlock.blockCommitTime)
        : undefined
      const blockCommitTimeLabel = blockCommitTime?.toFormat() ?? '-'

      const aliasLabel = <div className="TYPO-BODY-S !font-bold">{item.alias}</div>
      const statusTag = <LSVStatusIcon lsv={item} />

      return {
        ...item,
        blockCommitTime,
        blockCommitTimeLabel,
        aliasLabel,
        statusTag,
        filter: item.immediateKickout ? ['kickout'] : ['safe'],
      }
    })
  }, [list])

  const history = useHistory()
  const onRowClick = (item: LSV & LSVAdditional) => {
    history.push(`/lsv/${item.valOperAddr}`)
  }

  return (
    <TableList<LSV & LSVAdditional>
      title="All LSV"
      isLoading={isLoading}
      showTitle={false}
      useNarrow={true}
      useSearch={true}
      memo={<TimestampMemo timestamp={timestamp} />}
      list={allLSVTableList}
      defaultSortBy={'kickout'}
      defaultIsSortASC={false}
      onRowClick={onRowClick}
      fields={[
        {
          label: 'Validator',
          value: 'aliasLabel',
          sortValue: 'alias',
          type: 'html',
          widthRatio: 10,
        },
        {
          label: 'Jail time',
          value: 'jailUntilTimestamp',
          type: 'number',
          gt: 0,
          gtCSS: 'text-error',
          widthRatio: 2,
          responsive: true,
          assertThoughResponsive: true,
        },
        {
          label: 'Commission',
          value: 'commission',
          type: 'change',
          gt: 20,
          gtCSS: 'text-error',
          neutral: true,
          widthRatio: 2,
          responsive: true,
          assertThoughResponsive: true,
        },
        {
          label: 'Missed blocks',
          value: 'missingBlockCounter',
          type: 'number',
          gt: 0,
          gtCSS: 'text-warning',
          widthRatio: 2,
          responsive: true,
          assertThoughResponsive: true,
        },
        {
          label: 'Block commit time (ms)',
          value: 'blockCommitTimeLabel',
          sortValue: 'blockCommitTime',
          type: 'number',
          gt: 5000,
          gtCSS: 'text-error dark:text-warning',
          widthRatio: 6,
          responsive: true,
          assertThoughResponsive: true,
        },
        {
          label: 'Voting rate',
          value: 'votingRate',
          type: 'change',
          neutral: true,
          lt: SAFE_VOTING_RATE,
          ltCSS: 'text-warning',
          toFixedFallback: 0,
          widthRatio: 2,
          responsive: true,
          assertThoughResponsive: true,
        },
        {
          label: 'Penalty',
          value: 'penaltyTotal',
          type: 'number',
          gt: 2,
          gtCSS: 'text-error',
          widthRatio: 2,
          responsive: true,
          assertThoughResponsive: true,
        },
        {
          label: 'Penalty status',
          value: 'statusTag',
          type: 'html',
          align: 'right',
          widthRatio: 4,
          responsive: true,
        },
      ]}
    />
  )
}

function LSVStatusIcon({ lsv }: { lsv: LSV }) {
  const { allPenalties } = useLSVPenalty(lsv.addr)
  const notConfirmedPenalties = useMemo<Penalty[]>(
    () => allPenalties.filter((penalty) => penalty.status === PENALTY_STATUS.NotConfirmed),
    [allPenalties]
  )

  const notConfirmedRepPenalty = useMemo<Penalty | undefined>(() => {
    const penalty = allPenalties.filter((penalty) => penalty.status === PENALTY_STATUS.NotConfirmed)
    const im = penalty.find((penalty) => penalty.type === PENALTY_TYPE.immediateKickout)
    const strike = penalty.find((penalty) => penalty.type === PENALTY_TYPE.Strike)
    const warning = penalty.find((penalty) => penalty.type === PENALTY_TYPE.Warning)
    return im ?? strike ?? warning
  }, [allPenalties])

  const confirmedRepPenalty = useMemo<Penalty | undefined>(() => {
    const penalty = allPenalties.filter((penalty) => penalty.status === PENALTY_STATUS.Confirmed)
    const im = penalty.find((penalty) => penalty.type === PENALTY_TYPE.immediateKickout)
    const strike = penalty.find((penalty) => penalty.type === PENALTY_TYPE.Strike)
    const warning = penalty.find((penalty) => penalty.type === PENALTY_TYPE.Warning)
    return im ?? strike ?? warning
  }, [allPenalties])

  return (
    <div className="pr-6">
      {notConfirmedRepPenalty ? (
        <Tooltip content={`${notConfirmedPenalties.length} not confirmed`}>
          <LSVPenaltyIcon key={notConfirmedRepPenalty.eid} penalty={notConfirmedRepPenalty} />
        </Tooltip>
      ) : confirmedRepPenalty ? (
        <LSVPenaltyIcon key={confirmedRepPenalty.eid} penalty={confirmedRepPenalty} />
      ) : null}
    </div>
  )
}
