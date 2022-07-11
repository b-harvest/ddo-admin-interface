import BigNumber from 'bignumber.js'
import SearchInput from 'components/Inputs/SearchInput'
import Tag from 'components/Tag'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import type { STATUS } from 'types/status'

// field  typing
interface ListFieldHTML {
  label: string
  value: string
  widthRatio?: number
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

type ListField = ListFieldHTML | ListFieldImgUrl | ListFieldBignumber | ListFieldUSD

// item typing
interface TableListItem {
  status?: STATUS
  exponent?: number
  [key: string]: any
}

interface TableListProps {
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
}

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
}: TableListProps) {
  // search input keyword
  const [colWidthRatio, setColWidthRatio] = useState(100)

  useLayoutEffect(() => {
    setColWidthRatio(100 / fields.length)
  }, [fields])

  // list filtering
  const [searchKeyword, setSearchKeyword] = useState('')
  const [sortBy, setSortBy] = useState<string | undefined>()
  const [isSortASC, setIsSortASC] = useState<boolean>(IS_SORT_ASC_DEFAULT)

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

  // mapping table list
  const matchedList = useMemo(() => {
    const filteredList = list.filter((listItem) =>
      Object.values(listItem).toString().toUpperCase().includes(searchKeyword.toUpperCase())
    ) // tmp

    return sortBy
      ? filteredList.sort((a, b) => {
          return isSortASC ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
        })
      : filteredList
  }, [list, searchKeyword, sortBy, isSortASC])

  useEffect(() => {
    if (defaultSortBy) {
      handleSorting(defaultSortBy)
    }
    if (defaultIsSortASC !== undefined && defaultIsSortASC !== isSortASC) {
      setIsSortASC(defaultIsSortASC)
    }
  }, [])

  return (
    <div>
      {/* list header */}
      {showTitle ? (
        <header className="flex flex-col justify-between align-start space-y-6 mb-4 md:flex-row md:space-y-0 md:space-x-6">
          <h3 className="flex justify-start items-center TYPO-H3 text-black text-left">{title}</h3>
          {useSearch ? (
            <div>
              <SearchInput keyword={searchKeyword} onChange={setSearchKeyword} />{' '}
            </div>
          ) : null}
        </header>
      ) : null}

      <div>
        {/* list fields */}
        {showFieldsBar ? (
          <div aria-hidden="true" className={`transition-all ${useNarrow ? 'mb-2' : 'mb-4'}`}>
            <ul
              className={`flex justify-between items-center bg-lightCRE px-4 py-1 transition-all ${
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
                    className="grow shrink flex justify-start items-center TYPO-BODY-XS text-grayCRE-400 !font-medium cursor-pointer md:TYPO-BODY-S"
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
          {list.length <= 0 ? (
            <div
              className={`w-full  bg-grayCRE-200 TYPO-BODY-S text-grayCRE-400 !font-bold transition-all ${
                useNarrow ? 'rounded-sm p-2' : 'rounded-xl p-4'
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
}: {
  data: TableListItem
  fields: ListField[]
  mergedFields: string[]
  useNarrow?: boolean
  colWidthRatio: number
}) {
  const merged = fields.filter((field) => mergedFields.includes(field.value))
  const nonMerged = fields.filter((field) => !mergedFields.includes(field.value))
  const cellClass = `grow shrink flex items-center TYPO-BODY-S text-black !font-medium overflow-hidden md:TYPO-BODY-M`

  return (
    <li className="relative block w-full">
      <ul
        className={`${data.status ? getListItemClass(data.status) : ''} ${
          useNarrow ? 'rounded-lg space-y-1 px-4 md:space-x-2' : 'rounded-xl space-y-2 p-4 md:space-x-4'
        } flex flex-col justify-between items-stretch w-full bg-lightCRE py-3 transition-all md:flex-row md:items-start md:space-y-0`}
      >
        {nonMerged.map((field, i) => {
          return (
            <li
              key={i}
              style={{
                flexBasis: `${field.widthRatio ?? colWidthRatio}%`,
                flexShrink: field.type === 'imgUrl' ? '0' : '1',
                justifyContent: field.type === 'bignumber' || field.type === 'usd' ? 'flex-end' : 'flex-start',
                color: field.color ?? 'inherit',
              }}
              className={cellClass}
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
                  className={`${cellClass} flex space-x-2`}
                  style={{
                    flexShrink: field.type === 'imgUrl' ? '0' : '1',
                    justifyContent: field.type === 'bignumber' || field.type === 'usd' ? 'flex-end' : 'flex-start',
                    color: field.color ?? 'inherit',
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
        ? value.toFormat(field.toFixedFallback ?? 0, BigNumber.ROUND_HALF_UP)
        : value.toFormat(data.exponent ?? field.toFixedFallback ?? 0)

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

function getListItemClass(status: STATUS): string {
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
