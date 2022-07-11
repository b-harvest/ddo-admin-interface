import SearchInput from 'components/Inputs/SearchInput'
import Tag from 'components/Tag'
import React, { useLayoutEffect, useMemo, useState } from 'react'
import type { STATUS } from 'types/status'

interface ListFieldHTML {
  label: string
  value: string
  widthRatio?: number
  tag?: string
  type?: 'html'
}

interface ListFieldImgUrl extends Omit<ListFieldHTML, 'type'> {
  type: 'imgUrl'
  size?: number // only for imgUrl type
}

interface ListFieldBignumber extends Omit<ListFieldHTML, 'type'> {
  type: 'bignumber'
  toFixedFallback?: number
}

type ListField = ListFieldHTML | ListFieldImgUrl | ListFieldBignumber

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
  emptyListLabel?: string
}

export default function TableList({
  title,
  list,
  fields,
  useSearch = true,
  mergedFields = [],
  showTitle = true,
  showFieldsBar = true,
  emptyListLabel = 'No data',
}: TableListProps) {
  // search input keyword
  const [searchKeyword, setSearchKeyword] = useState('')
  const [colWidthRatio, setColWidthRatio] = useState(100)

  useLayoutEffect(() => {
    setColWidthRatio(100 / fields.length)
  }, [fields])

  // list filtering
  const matchedList = useMemo(() => {
    return list.filter((listItem) =>
      Object.values(listItem).toString().toUpperCase().includes(searchKeyword.toUpperCase())
    ) // tmp
  }, [list, searchKeyword])

  //   ListItem
  function ListItem({ data, fields }: { data: TableListItem; fields: ListField[] }) {
    const merged = fields.filter((field) => mergedFields.includes(field.value))
    const nonMerged = fields.filter((field) => !mergedFields.includes(field.value))
    const cellClass = `grow shrink flex items-center TYPO-BODY-S text-black !font-medium overflow-hidden md:TYPO-BODY-M`

    return (
      <li className="relative block w-full">
        <ul
          className={`${
            data.status ? getListItemClass(data.status) : ''
          } flex flex-col justify-between items-stretch space-y-2 w-full rounded-xl bg-grayCRE-200 p-4 md:flex-row md:items-start md:space-x-4 md:space-y-0`}
        >
          {nonMerged.map((field, i) => {
            return (
              <li
                key={i}
                style={{
                  flexBasis: `${field.widthRatio ?? colWidthRatio}%`,
                  flexShrink: field.type === 'imgUrl' ? '0' : '1',
                  justifyContent: field.type === 'bignumber' ? 'flex-end' : 'flex-start',
                }}
                className={cellClass}
              >
                {getListItemCell(data, field)}
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
                      justifyContent: field.type === 'bignumber' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {getListItemCell(data, field)}
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
          <div aria-hidden="true" className="mb-4">
            <ul className="flex justify-between items-center bg-grayCRE-100 px-4 py-2 rounded-xl">
              {fields.map((field, i) => {
                return (
                  <li
                    key={i}
                    style={{ flexBasis: `${field.widthRatio ?? colWidthRatio}%` }}
                    className="grow shrink flex justify-start items-center TYPO-BODY-XS text-grayCRE-400 md:TYPO-BODY-S"
                  >
                    {field.label}
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}

        {/* data list */}
        <div>
          {list.length <= 0 ? (
            <div className="w-full rounded-xl bg-grayCRE-200 p-4 TYPO-BODY-S text-grayCRE-400 !font-bold">
              {emptyListLabel}
            </div>
          ) : (
            <ul className="flex flex-col justify-start items-stretch space-y-2">
              {matchedList.map((item, i) => {
                return <ListItem key={i} data={item} fields={fields} />
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function getListItemCell(data: TableListItem, field: ListField) {
  const value = data[field.value]

  if (field.type === 'imgUrl' && typeof value === 'string') {
    return value.length > 0 ? (
      <img src={value} alt="" style={{ width: `${field.size ?? 24}px`, height: `${field.size ?? 24}px` }} />
    ) : null
  } else if (field.type === 'bignumber') {
    const formattedVal = value.toFormat(data.exponent ?? field.toFixedFallback ?? 0)
    return (
      <div title={formattedVal} className="font-mono">
        {formattedVal}
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
