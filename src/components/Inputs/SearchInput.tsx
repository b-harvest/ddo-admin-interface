import IconButton from 'components/IconButton'

interface SearchInputProps {
  placeholder?: string
  keyword: string
  onChange: (keyword: string) => void
  onSearch?: () => void
}

export default function SearchInput({ placeholder = 'Search', keyword, onChange, onSearch }: SearchInputProps) {
  return (
    <div className="relative flex items-center w-full min-w-[10.625rem] max-w-[calc(100vw-2rem)] rounded-xl border-[2px] border-grayCRE-200 dark:opacity-60 md:min-w-[16.5625rem]">
      <input
        className="w-full TYPO-BODY-M text-black dark:text-white bg-transparent p-2 mr-[calc(0.75rem*2+1.25rem)] outline-none"
        type="text"
        value={keyword}
        placeholder={placeholder}
        onChange={({ target }) => onChange(target.value.trim())}
        onKeyPress={(evt) => {
          if (onSearch && evt.key === 'Enter') onSearch()
        }}
      />
      <IconButton
        type="search"
        iconClassName="w-5 h-5 text-grayCRE-200 dark:text-white"
        className="absolute right-[0.75rem]"
        onClick={onSearch}
      />
    </div>
  )
}
