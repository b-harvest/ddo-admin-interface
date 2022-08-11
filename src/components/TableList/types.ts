import type { FilterRadioGroupOption } from 'components/FilterRadioGroup'
import type { AlertStatus } from 'types/alert'

export type ListFieldAlign = 'left' | 'right' | 'center'

// field  typing
export interface ListFieldHTML {
  label: string | JSX.Element
  value: string
  sortValue?: string
  abbrOver?: number
  widthRatio?: number
  responsive?: boolean // default => false
  assertThoughResponsive?: boolean // default => false
  tag?: string
  color?: string
  type?: 'html'
  align?: ListFieldAlign
  clickable?: boolean
  excludeMinWidth?: boolean
  tooltip?: boolean
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

export interface ListFieldChange extends Omit<ListFieldHTML, 'type'> {
  type: 'change'
  neutral?: boolean
  strong?: boolean
}

export interface ListFieldObj extends Omit<ListFieldHTML, 'type'> {
  type: 'object'
  displayValue: string
  displayType?: 'html' | 'imgUrl' | 'bignumber' | 'usd' | 'change'
  objSortValue: string
}

export interface ListFieldStringNumber extends Omit<ListFieldHTML, 'type'> {
  type: 'number'
}

export type ListField =
  | ListFieldHTML
  | ListFieldImgUrl
  | ListFieldBignumber
  | ListFieldUSD
  | ListFieldChange
  | ListFieldObj
  | ListFieldStringNumber

// item typing
export interface TableListItem {
  status?: AlertStatus
  exponent?: number
  filter?: string[]
  tooltip?: string | JSX.Element
  [key: string]: any
}

export interface TableListProps<T extends TableListItem> {
  title?: string
  isLoading?: boolean
  list: T[]
  fields: ListField[]
  overflow?: boolean
  cellMinWidthPx?: number
  useSearch?: boolean
  mergedFields?: string[][]
  mergedFieldLabels?: string[]
  totalField?: string
  totalLabel?: string | JSX.Element
  totalLabelSuffix?: string | JSX.Element
  totalDesc?: string | JSX.Element
  totalStatus?: AlertStatus
  showTitle?: boolean
  showFieldsBar?: boolean
  useNarrow?: boolean
  emptyListLabel?: string
  defaultSortBy?: ListField['value']
  defaultIsSortASC?: boolean
  nowrap?: boolean
  filterOptions?: FilterRadioGroupOption[]
  defaultFilterIndex?: number
  memo?: string | JSX.Element
  onRowClick?: (item: T) => void
  onCellClick?: (cell: any, field: string, item: T) => void
}
