import BigNumber from 'bignumber.js'
import CopyHelper from 'components/CopyHelper'
import EmptyData from 'components/EmptyData'
import FilterRadioGroup, { FilterRadioGroupOption, TAB_RADIO_GROUP_DEFAULT_OPTION } from 'components/FilterRadioGroup'
import SearchInput from 'components/Inputs/SearchInput'
import { useMatchedTableList } from 'components/TableList/hooks'
import type {
  ListField,
  ListFieldBignumber,
  ListFieldUSD,
  TableListItem,
  TableListProps,
} from 'components/TableList/types'
import Tag from 'components/Tag'
import { useLayoutEffect, useMemo, useState } from 'react'
import type { AlertStatus } from 'types/alert'
import { formatUSDAmount } from 'utils/amount'

const IS_SORT_ASC_DEFAULT = false
const FIELD_CSS_CLASS = `grow shrink justify-start items-center TYPO-BODY-XS text-grayCRE-400 dark:text-grayCRE-300 !font-medium cursor-pointer md:flex md:TYPO-BODY-S`

export default function TableList({
  title,
  list,
  fields,
  useSearch = true,
  mergedFields = [],
  mergedFieldLabel,
  totalField,
  totalLabel,
  totalPrefixDesc,
  totalDesc,
  totalStatus,
  showTitle = true,
  showFieldsBar = true,
  useNarrow = false,
  emptyListLabel = 'No data',
  defaultSortBy,
  defaultIsSortASC,
  nowrap = false,
  filterOptions,
}: TableListProps) {
  // fields
  const merged = useMemo(() => fields.filter((field) => mergedFields.includes(field.value)), [fields, mergedFields])
  const nonMerged = useMemo(() => fields.filter((field) => !mergedFields.includes(field.value)), [fields, mergedFields])

  // col width ratio
  const [colWidthRatio, setColWidthRatio] = useState(100)

  useLayoutEffect(() => {
    setColWidthRatio(100 / (nonMerged.length + 1))
  }, [nonMerged])

  // table search keyword
  const [searchKeyword, setSearchKeyword] = useState<string>('')

  // table sorting setting
  const [sortBy, setSortBy] = useState<string | undefined>(defaultSortBy)
  const [isSortASC, setIsSortASC] = useState<boolean>(defaultIsSortASC ?? IS_SORT_ASC_DEFAULT)

  const onFieldClick = (field: ListField) => handleSorting(field.value)

  const handleSorting = (field: ListField['value']) => {
    const isSameFieldClicked = sortBy === field
    if (isSameFieldClicked) {
      setIsSortASC(!isSortASC)
    } else {
      setIsSortASC(IS_SORT_ASC_DEFAULT)
      setSortBy(field)
    }
  }

  // table filter option
  const [filterOption, setFilterOption] = useState<FilterRadioGroupOption>(TAB_RADIO_GROUP_DEFAULT_OPTION)

  // final table list to display
  const matchedList = useMatchedTableList({ list, searchKeyword, sortBy, isSortASC, filterOption })

  // total derieved from the matched list only
  const validTotalField = useMemo(() => {
    return fields.find(
      (field) => field.value === totalField && (field.type === 'bignumber' || field.type === 'usd')
    ) as ListFieldBignumber | ListFieldUSD | undefined
  }, [totalField, fields])

  const total = useMemo(() => {
    if (!validTotalField) return undefined
    else return matchedList.reduce((accm, item) => accm.plus(item[validTotalField.value]), new BigNumber(0))
  }, [validTotalField, matchedList])

  return (
    <div>
      {/* list header */}
      {showTitle ? (
        <header className="flex flex-col justify-start align-stretch space-y-6 mb-4">
          <h3 className="flex justify-start items-center TYPO-H3 text-black dark:text-white text-left">{title}</h3>
          <div className="flex flex-col justify-between items-stretch space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-2">
            {filterOptions ? (
              <FilterRadioGroup options={filterOptions} defaultIndex={1} onSelect={setFilterOption} />
            ) : null}
            {useSearch ? (
              <div>
                <SearchInput keyword={searchKeyword} onChange={setSearchKeyword} />{' '}
              </div>
            ) : null}
          </div>
        </header>
      ) : null}

      <div>
        {/* list fields */}
        {showFieldsBar ? (
          <div aria-hidden="true" className={`transition-all ${useNarrow ? 'mb-1' : 'mb-2'}`}>
            <ul
              className={`flex justify-between items-center bg-grayCRE-50 dark:bg-neutral-800 px-4 py-1 hover:shadow-md transition-all ${
                useNarrow ? 'md:py-1 rounded-md md:space-x-2' : 'rounded-lg md:space-x-4'
                // useNarrow ? 'rounded-lg px-4 md:space-x-2' : 'rounded-xl p-4 md:space-x-4'
              }`}
            >
              {nonMerged.map((field, i) => {
                return (
                  <li
                    key={i}
                    style={{
                      flexBasis: `${field.widthRatio ?? colWidthRatio}%`,
                      justifyContent: field.type === 'bignumber' || field.type === 'usd' ? 'flex-end' : 'flex-start',
                    }}
                    className={`${field.responsive ? 'hidden' : 'flex'} ${FIELD_CSS_CLASS}`}
                    onClick={() => onFieldClick(field)}
                  >
                    {field.label}
                    {sortBy === field.value ? <span className="ml-2">{isSortASC ? '↓' : '↑'}</span> : null}
                  </li>
                )
              })}
              {merged.map((field, i) =>
                i === 0 ? (
                  <li
                    key={i}
                    className={`flex ${FIELD_CSS_CLASS}`}
                    style={{
                      flexBasis: `${
                        merged.reduce((m, item) => m + (field.widthRatio ?? colWidthRatio), 0) ?? colWidthRatio
                      }%`,
                      justifyContent: field.type === 'bignumber' || field.type === 'usd' ? 'flex-end' : 'flex-start',
                    }}
                    onClick={() => onFieldClick(field)}
                  >
                    {mergedFieldLabel ?? ''}
                    {sortBy === field.value ? <span className="ml-2">{isSortASC ? '↓' : '↑'}</span> : null}
                  </li>
                ) : null
              )}
            </ul>
          </div>
        ) : null}

        {/* data list */}
        <div>
          {matchedList.length <= 0 ? (
            <EmptyData useNarrow={useNarrow} label={emptyListLabel} />
          ) : (
            <ul
              className={`flex flex-col justify-start items-stretch transition-all ${
                useNarrow ? 'space-y-1' : 'space-y-2'
              }`}
            >
              {matchedList.map((item, i) => {
                return (
                  <ListItem
                    key={i}
                    data={item}
                    merged={merged}
                    nonMerged={nonMerged}
                    useNarrow={useNarrow}
                    colWidthRatio={colWidthRatio}
                    nowrap={nowrap}
                  />
                )
              })}
            </ul>
          )}
        </div>

        {/* total */}
        <div className="relative block w-full">
          {validTotalField && total ? (
            <div
              className={`flex flex-col md:flex-row justify-between items-stretch w-full bg-grayCRE-50 dark:bg-neutral-800 py-3 transition-all hover:bg-lightCRE dark:hover:bg-neutral-700 hover:-translate-y-[1px] hover:shadow-md md:space-y-0 ${
                useNarrow ? 'rounded-lg px-4 space-y-1 md:space-x-2 mt-1' : 'rounded-xl p-4 space-y-2 md:space-x-4 mt-2'
              } ${cellClass(validTotalField)} border border-grayCRE-200 dark:border-grayCRE-400 ${
                totalStatus ? getListItemClassByStatus(totalStatus) : ''
              }`}
            >
              <div className="text-left !font-black">
                <span>{totalLabel ?? `Total ${validTotalField.label}`}</span>
              </div>
              <div className="flex flex-col justify-start items-end space-y-2">
                <div className="flex space-x-2 !font-black !font-mono">
                  <div className="mr-2">{totalPrefixDesc ?? null}</div>
                  <div>{bignumberToFormat({ value: total, field: validTotalField })}</div>
                  {validTotalField.tag ? <Tag>{validTotalField.tag}</Tag> : null}
                </div>
                {totalDesc ?? null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

//   ListItem
function ListItem({
  data,
  // fields,
  merged,
  nonMerged,
  useNarrow,
  colWidthRatio,
  nowrap,
}: {
  data: TableListItem
  // fields: ListField[]
  merged: ListField[]
  nonMerged: ListField[]
  useNarrow?: boolean
  colWidthRatio: number
  nowrap: boolean
}) {
  // const merged = fields.filter((field) => mergedFields.includes(field.value))
  // const nonMerged = fields.filter((field) => !mergedFields.includes(field.value))

  return (
    <li className="relative block w-full">
      <ul
        className={`${data.status ? getListItemClassByStatus(data.status) : ''} ${
          useNarrow ? 'rounded-lg px-4 md:space-x-2' : 'rounded-xl p-4 md:space-x-4'
        } ${
          nowrap
            ? 'flex-row items-center space-x-2'
            : 'flex-col md:flex-row items-strecth md:items-center space-y-1 md:space-y-0 space-x-0 md:space-x-2'
        } flex  justify-between w-full bg-grayCRE-50 dark:bg-neutral-800 py-3 transition-all hover:bg-lightCRE dark:hover:bg-neutral-700 hover:-translate-y-[1px] hover:shadow-md`}
      >
        {nonMerged.map((field, i) => {
          return (
            <li
              key={i}
              style={{
                flexBasis: `${field.widthRatio ?? colWidthRatio}%`,
                flexShrink: field.type === 'imgUrl' ? '0' : '1',
                justifyContent: field.type === 'bignumber' || field.type === 'usd' ? 'flex-end' : 'flex-start',
                // color: field.color ?? 'inherit',
              }}
              className={`${cellClass(field)} flex space-x-2`}
            >
              {ListItemCell({ data, field })}
              {field.tag ? <Tag>{field.tag}</Tag> : null}
            </li>
          )
        })}
        {merged.length > 0 ? (
          <li
            className="grow shrink flex flex-col justify-start items-stretch space-y-1 md:space-y-2"
            style={{
              flexBasis: `${merged.reduce((m, item) => m + (item.widthRatio ?? colWidthRatio), 0) ?? colWidthRatio}%`,
            }}
          >
            {merged.map((field, i) => {
              return (
                <div
                  key={i}
                  className={`${cellClass(field)} flex space-x-2`}
                  style={{
                    flexShrink: field.type === 'imgUrl' ? '0' : '1',
                    justifyContent: field.type === 'bignumber' || field.type === 'usd' ? 'flex-end' : 'flex-start',
                    // color: field.color ?? 'inherit',
                  }}
                >
                  {ListItemCell({ data, field })}
                  {field.tag ? <Tag>{field.tag}</Tag> : null}
                </div>
              )
            })}
          </li>
        ) : null}
      </ul>
    </li>
  )
}

function ListItemCell({ data, field }: { data: TableListItem; field: ListField }) {
  const value = data[field.value]

  if (field.type === 'imgUrl' && typeof value === 'string') {
    return value.length > 0 ? (
      <img src={value} alt="" style={{ width: `${field.size ?? 24}px`, height: `${field.size ?? 24}px` }} />
    ) : null
  } else if (field.type === 'bignumber' || field.type === 'usd') {
    const numberVal =
      value === null || value === undefined ? '-' : bignumberToFormat({ value, exponent: data.exponent, field })

    return (
      <div title={numberVal} className="font-mono">
        {numberVal}
      </div>
    )
  } else if (field.abbrOver && typeof value === 'string') {
    const abbrLength = field.abbrOver ?? value.length
    const abbrVal = value.length > abbrLength ? `${value.slice(0, abbrLength)}・・・${value.slice(-3)}` : value
    return (
      <CopyHelper toCopy={value} iconPosition="left">
        {' '}
        <div title={value}>{abbrVal}</div>
      </CopyHelper>
    )
  } else if (typeof value === 'string') {
    return <div title={value}>{value}</div>
  } else {
    return <div title={value}>{value}</div>
  }
}
const cellClass = (field: ListField) =>
  `${
    field.responsive ? 'hidden' : 'flex'
  } grow shrink items-center TYPO-BODY-S text-black dark:text-white !font-medium overflow-hidden md:flex md:TYPO-BODY-M`

function getListItemClassByStatus(status: AlertStatus): string {
  switch (status) {
    case 'success':
      return '!bg-success-light !dark:bg-success-o !border-2 !border-success-o !shadow-md !shadow-success-o'
      break
    case 'warning':
      return '!bg-warning-light dark:!bg-warning-o !border-2 !border-warning-o !shadow-md !shadow-warning-o'
      break
    case 'error':
      return '!bg-error-light dark:!bg-error-o !border-2 !border-error-o !shadow-md !shadow-error-o'
      break
    case 'info':
      return '!bg-info-light dark:!bg-info-o !border-2 !border-info-o !shadow-md !shadow-info-o'
      break
    default:
      return ''
  }
}

export function bignumberToFormat({
  value,
  exponent,
  field,
}: {
  value: BigNumber
  exponent?: number
  field: ListFieldBignumber | ListFieldUSD
}): string {
  return field.type === 'usd'
    ? formatUSDAmount({ value, mantissa: 0 })
    : value.isZero()
    ? '0'
    : value.toFormat(exponent ?? field.toFixedFallback ?? 0)
}
