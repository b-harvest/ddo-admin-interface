import BigNumber from 'bignumber.js'
import FilterRadioGroup, { FilterRadioGroupOption, TAB_RADIO_GROUP_DEFAULT_OPTION } from 'components/FilterRadioGroup'
import SearchInput from 'components/Inputs/SearchInput'
import { useMatchedTableList } from 'components/TableList/hooks'
import type { ListField, TableListItem, TableListProps } from 'components/TableList/types'
import Tag from 'components/Tag'
import { useLayoutEffect, useState } from 'react'
import type { AlertStatus } from 'types/alert'

const IS_SORT_ASC_DEFAULT = false

export default function TableList({
  title,
  list,
  fields,
  useSearch = true,
  mergedFields = [],
  showTitle = true,
  showFieldsBar = true,
  useNarrow = false,
  emptyListLabel = 'No data',
  defaultSortBy,
  defaultIsSortASC,
  showItemsVertically = false,
  filterOptions,
}: TableListProps) {
  // col width ratio
  const [colWidthRatio, setColWidthRatio] = useState(100)

  useLayoutEffect(() => {
    setColWidthRatio(100 / fields.length)
  }, [fields])

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
                useNarrow ? 'md:py-1 rounded-md' : 'rounded-lg'
              }`}
            >
              {fields.map((field, i) => {
                return (
                  <li
                    key={i}
                    style={{
                      flexBasis: `${field.widthRatio ?? colWidthRatio}%`,
                      justifyContent: field.type === 'bignumber' || field.type === 'usd' ? 'flex-end' : 'flex-start',
                    }}
                    className={`grow shrink ${
                      field.responsive ? 'hidden' : 'flex'
                    } justify-start items-center TYPO-BODY-XS text-grayCRE-400 dark:text-grayCRE-300 !font-medium cursor-pointer md:flex md:TYPO-BODY-S`}
                    onClick={() => onFieldClick(field)}
                  >
                    {field.label}
                    {sortBy === field.value ? <span className="ml-2">{isSortASC ? '↓' : '↑'}</span> : null}
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}

        {/* data list */}
        <div>
          {matchedList.length <= 0 ? (
            <div
              className={`w-full  bg-grayCRE-200 dark:bg-neutral-800 TYPO-BODY-S text-grayCRE-400 !font-bold transition-all ${
                useNarrow ? 'rounded-lg p-2' : 'rounded-xl p-4'
              }`}
            >
              {emptyListLabel}
            </div>
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
                    fields={fields}
                    mergedFields={mergedFields}
                    useNarrow={useNarrow}
                    colWidthRatio={colWidthRatio}
                    showItemsVertically={showItemsVertically}
                  />
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

//   ListItem
function ListItem({
  data,
  fields,
  mergedFields,
  useNarrow,
  colWidthRatio,
  showItemsVertically,
}: {
  data: TableListItem
  fields: ListField[]
  mergedFields: string[]
  useNarrow?: boolean
  colWidthRatio: number
  showItemsVertically: boolean
}) {
  const merged = fields.filter((field) => mergedFields.includes(field.value))
  const nonMerged = fields.filter((field) => !mergedFields.includes(field.value))
  const cellClass = (field: ListField) =>
    `${
      field.responsive ? 'hidden' : 'flex'
    } grow shrink items-center TYPO-BODY-S text-black dark:text-white !font-medium overflow-hidden md:flex md:TYPO-BODY-M`

  return (
    <li className="relative block w-full">
      <ul
        className={`${data.status ? getListItemClass(data.status) : ''} ${
          useNarrow ? 'rounded-lg space-y-1 px-4 md:space-x-2' : 'rounded-xl space-y-2 p-4 md:space-x-4'
        } ${
          showItemsVertically ? 'flex-col' : 'flex-row'
        } flex justify-between items-stretch w-full bg-grayCRE-50 dark:bg-neutral-800 py-3 transition-all hover:bg-lightCRE dark:hover:bg-neutral-700 hover:-translate-y-[1px] hover:shadow-md md:space-y-0`}
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
              className={cellClass(field)}
            >
              {ListItemCell({ data, field })}
              {field.tag ? <Tag>{field.tag}</Tag> : null}
            </li>
          )
        })}
        {merged.length > 0 ? (
          <li
            className="flex flex-col justify-start items-stretch space-y-2"
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
    if (value === null) return null

    const valueToFormat: string =
      field.type === 'usd'
        ? (value as BigNumber).toFormat(field.toFixedFallback ?? 0, BigNumber.ROUND_HALF_UP)
        : (value as BigNumber).toFormat(data.exponent ?? field.toFixedFallback ?? 0)

    const displayVal = new BigNumber(valueToFormat).isZero() ? '0' : valueToFormat

    return (
      <div title={displayVal} className="font-mono">
        {field.type === 'usd' ? <span className="pr-1">$</span> : null}
        {displayVal}
      </div>
    )
  } else {
    return <div title={value}>{value}</div>
  }
}

function getListItemClass(status: AlertStatus): string {
  switch (status) {
    case 'success':
      return 'border border-success'
      break
    case 'warning':
      return 'border border-warning'
      break
    case 'error':
      return 'bg-error-light border-2 border-error-o shadow-md shadow-error-o'
      break
    case 'info':
      return 'border border-info'
      break
    default:
      return ''
  }
}
