import { FilterRadioGroupOption } from 'components/FilterRadioGroup'
import type { AlertStatus } from 'types/alert'

// field  typing
interface ListFieldHTML {
  label: string
  value: string
  widthRatio?: number
  responsive?: boolean // default => false
  tag?: string
  color?: string
  type?: 'html'
}

interface ListFieldImgUrl extends Omit<ListFieldHTML, 'type'> {
  type: 'imgUrl'
  size?: number
}

interface ListFieldBignumber extends Omit<ListFieldHTML, 'type'> {
  type: 'bignumber'
  toFixedFallback?: number
}

interface ListFieldUSD extends Omit<ListFieldHTML, 'type'> {
  type: 'usd'
  toFixedFallback?: number
}

export type ListField = ListFieldHTML | ListFieldImgUrl | ListFieldBignumber | ListFieldUSD

// item typing
export interface TableListItem {
  status?: AlertStatus
  exponent?: number
  filter?: string
  [key: string]: any
}

export interface TableListProps {
  title?: string
  list: TableListItem[]
  fields: ListField[]
  useSearch?: boolean
  mergedFields?: string[]
  showTitle?: boolean
  showFieldsBar?: boolean
  useNarrow?: boolean
  emptyListLabel?: string
  defaultSortBy?: ListField['value']
  defaultIsSortASC?: boolean
  showItemsVertically?: boolean
  filterOptions?: FilterRadioGroupOption[]
}
