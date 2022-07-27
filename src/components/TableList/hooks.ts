import { FilterRadioGroupOption } from 'components/FilterRadioGroup'
import type { TableListItem, TableListProps } from 'components/TableList/types'
import { useMemo } from 'react'

type MatchedListParams<T> = Pick<TableListProps<T>, 'list'> & {
  searchKeyword: string
  sortBy?: string
  isSortASC: boolean
  filterOption: FilterRadioGroupOption
}

export function useMatchedTableList<T extends TableListItem>({
  list,
  searchKeyword,
  sortBy,
  isSortASC,
  filterOption,
}: MatchedListParams<T>) {
  return useMemo(() => {
    // filtering
    const filteredList =
      filterOption.value === 'all'
        ? list
        : list.filter((item) => {
            return item.filter?.includes(filterOption.value)
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
