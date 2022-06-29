import SearchInput from 'components/Inputs/SearchInput'
import { useLayoutEffect, useMemo, useState } from 'react'

export type ListFieldType = undefined | 'imgUrl'

interface ListField {
  label: string
  value: string
  type?: ListFieldType
  size?: number // only for imgUrl type
  widthRatio?: number
}

interface TableListProps {
  title?: string
  list: { [key: string]: any }[]
  fields: ListField[]
  useSearch?: boolean
}

const getListItemDisplay = (value: any, type?: string, size?: number) => {
  if (type === 'imgUrl' && typeof value === 'string') {
    return value.length > 0 ? <img src={value} alt="" style={{ width: `${size}px`, height: `${size}px` }} /> : null
  } else {
    return value
  }
}

export default function TableList({ title, list, fields, useSearch = true }: TableListProps) {
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
  function ListItem({ data, fields }: { data: any; fields: ListField[] }) {
    return (
      <li className="relative block w-full">
        <ul className="flex justify-between items-center space-x-4 w-full rounded-xl bg-grayCRE-200 p-4">
          {fields.map((field, i) => {
            return (
              <li
                key={i}
                style={{
                  flexBasis: `${field.widthRatio ?? colWidthRatio}%`,
                  flexShrink: field.type === 'imgUrl' ? '0' : '1',
                }}
                className="grow shrink flex justify-start items-center TYPO-BODY-S text-black !font-medium overflow-hidden md:TYPO-BODY-M"
                title={getListItemDisplay(data[field.value], field.type, field.size)}
              >
                {getListItemDisplay(data[field.value], field.type, field.size)}
              </li>
            )
          })}
        </ul>
      </li>
    )
  }

  return (
    <div>
      {/* list header */}
      <header className="flex flex-col justify-between align-start space-y-6 mb-4 md:flex-row md:space-y-0 md:space-x-6">
        <h3 className="flex justify-start items-center TYPO-H3 text-black text-left">{title}</h3>
        {useSearch ? (
          <div>
            <SearchInput keyword={searchKeyword} onChange={setSearchKeyword} />{' '}
          </div>
        ) : null}
      </header>

      <div>
        {/* list fields */}
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

        {/* data list */}
        <div>
          {list.length <= 0 ? (
            <div>Empty List</div>
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
