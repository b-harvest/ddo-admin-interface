import { FilterRadioGroupOption } from 'components/FilterRadioGroup'
import type { TableListProps } from 'components/TableList/types'
import { useMemo } from 'react'

type MatchedListParams = Pick<TableListProps, 'list'> & {
  searchKeyword: string
  sortBy?: string
  isSortASC: boolean
  filterOption: FilterRadioGroupOption
}

export const useMatchedTableList = ({ list, searchKeyword, sortBy, isSortASC, filterOption }: MatchedListParams) => {
  return useMemo(() => {
    // filtering
    const filteredList =
      filterOption.value === 'all'
        ? list
        : list.filter((item) => {
            return item.filter === filterOption.value
          })

    // searching
    const searchedList = filteredList.filter((item) =>
      Object.values(item).toString().toUpperCase().includes(searchKeyword.toUpperCase())
    )

    // sorting
    return sortBy
      ? searchedList.sort((a, b) => {
          return isSortASC ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
        })
      : searchedList
  }, [list, searchKeyword, sortBy, isSortASC, filterOption])
}
