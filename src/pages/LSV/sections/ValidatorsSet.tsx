import TableList from 'components/TableList'
import { useMemo } from 'react'
import type { ValidatorsByHeightLCD } from 'types/validator'

export default function ValidatorsSet({ validatorsSet }: { validatorsSet: ValidatorsByHeightLCD }) {
  const validatorsTableList = useMemo(() => {
    return validatorsSet?.validators ?? []
  }, [validatorsSet])

  return (
    <TableList
      title="On-chain Validators"
      showTitle={true}
      useNarrow={true}
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
          // abbrOver: 10,
        },
        {
          label: 'Proposer priority',
          value: 'proposer_priority',
          widthRatio: 10,
        },
        {
          label: 'Voting power',
          value: 'voting_power',
          widthRatio: 10,
        },
      ]}
    />
  )
}
