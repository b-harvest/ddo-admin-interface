import { FilterRadioGroupOption } from 'components/FilterRadioGroup'
import type { AlertStatus } from 'types/alert'

// field  typing
export interface ListFieldHTML {
  label: string
  value: string
  abbrOver?: number
  widthRatio?: number
  responsive?: boolean // default => false
  tag?: string
  color?: string
  type?: 'html'
}

export interface ListFieldImgUrl extends Omit<ListFieldHTML, 'type'> {
  type: 'imgUrl'
  size?: number
}

export interface ListFieldBignumber extends Omit<ListFieldHTML, 'type'> {
  type: 'bignumber'
  toFixedFallback?: number
}

export interface ListFieldUSD extends Omit<ListFieldHTML, 'type'> {
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
  mergedFieldLabel?: string
  totalField?: string
  totalLabel?: string | JSX.Element
  totalPrefixDesc?: string | JSX.Element
  totalDesc?: string | JSX.Element
  totalStatus?: AlertStatus
  showTitle?: boolean
  showFieldsBar?: boolean
  useNarrow?: boolean
  emptyListLabel?: string
  defaultSortBy?: ListField['value']
  defaultIsSortASC?: boolean
  showItemsVertically?: boolean
  filterOptions?: FilterRadioGroupOption[]
}
