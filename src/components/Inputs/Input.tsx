import { useMemo } from 'react'

type SearchInputProps = {
  type?: string
  placeholder?: string
  keyword: string
  onChange: (keyword: string) => void
  validate?: (keyword: string) => boolean
  invalidMsg?: string
}

export default function Input({
  type = 'text',
  placeholder = 'Text',
  keyword,
  onChange,
  validate,
  invalidMsg,
}: SearchInputProps) {
  const isValid = useMemo<boolean>(() => (validate ? validate(keyword) : true), [keyword, validate])

  return (
    <div className="relative space-y-1 w-full min-w-[10.625rem] max-w-[calc(100vw-2rem)] md:min-w-[16.5625rem]">
      <div className="rounded-md border-[2px] border-grayCRE-200 dark:border-grayCRE-400 opacity-60 focus-within:opacity-100">
        <input
          type={type}
          className="w-full TYPO-BODY-M text-black dark:text-white bg-transparent p-2 outline-none"
          value={keyword}
          placeholder={placeholder}
          onChange={({ target }) => onChange(target.value)}
        />
      </div>
      <div className="TYPO-BODY-XS text-error px-2">
        {keyword.length === 0 || isValid ? null : <div>{invalidMsg ?? 'The input is not valid'}</div>}
      </div>
    </div>
  )
}
