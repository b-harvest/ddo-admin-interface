import AppPage from 'components/AppPage'
import TableList from 'components/TableList'
import useChain from 'hooks/useChain'
import useValidators from 'hooks/useValidators'
import { useEffect, useMemo, useState } from 'react'

export default function Validators() {
  const { backendBlockHeight } = useChain()

  const [height, setHeight] = useState<string | undefined>()

  const { validatorsetsLCD } = useValidators(height)

  const validatorsTableList = useMemo(() => {
    return validatorsetsLCD?.validators ?? []
  }, [validatorsetsLCD])

  useEffect(() => setHeight(backendBlockHeight), [])

  return (
    <AppPage>
      <TableList
        title="Validators"
        showTitle={false}
        useSearch={false}
        showFieldsBar={true}
        list={validatorsTableList}
        // mergedFields={['stakedAmount', 'onchainStakedAmount']}
        // mergedFieldLabel="Staked amount"
        defaultSortBy="voting_power"
        defaultIsSortASC={false}
        nowrap={false}
        fields={[
          {
            label: 'Address',
            value: 'address',
            abbrOver: 10,
            widthRatio: 30,
            // responsive: true,
          },
          // {
          //   label: 'Onchain queued amount',
          //   value: 'onchainQueuedAmount',
          //   tag: 'On-chain',
          //   type: 'bignumber',
          //   toFixedFallback: 6,
          //   responsive: true,
          // },
          {
            label: 'Proposer priority',
            value: 'proposer_priority',
            // tag: 'Back-end',
            // type: 'bignumber',
            // toFixedFallback: 6,
          },
          {
            label: 'Voting power',
            value: 'voting_power',
            // tag: 'On-chain',
            // type: 'bignumber',
            // toFixedFallback: 6,
          },
        ]}
      />
    </AppPage>
  )
}
