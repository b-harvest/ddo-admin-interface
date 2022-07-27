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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setHeight(backendBlockHeight), [])

  return (
    <AppPage>
      <TableList
        title="Validators"
        showTitle={false}
        useSearch={false}
        showFieldsBar={true}
        list={validatorsTableList}
        defaultSortBy="voting_power"
        defaultIsSortASC={false}
        nowrap={false}
        fields={[
          {
            label: 'Address',
            value: 'address',
            abbrOver: 10,
            widthRatio: 30,
          },
          {
            label: 'Proposer priority',
            value: 'proposer_priority',
          },
          {
            label: 'Voting power',
            value: 'voting_power',
          },
        ]}
      />
    </AppPage>
  )
}
