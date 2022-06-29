import IconButton from 'components/Buttons/IconButton'

interface SearchInputProps {
  placeholder?: string
  keyword: string
  onChange: (keyword: string) => void
  onSearch?: () => void
}

export default function SearchInput({ placeholder = 'Search', keyword, onChange, onSearch }: SearchInputProps) {
  return (
    <div className="relative flex items-center opacity-40">
      <input
        className="w-full rounded-[0.625rem] border-[2px] border-gray-500 text-black TYPO-BODY-M bg-transparent min-w-[10.625rem] p-3 pr-[calc(0.75rem*2+1.25rem)] md:min-w-[16.5625rem] outline-none"
        type="text"
        value={keyword}
        placeholder={placeholder}
        onChange={({ target }) => onChange(target.value)}
        onKeyPress={(evt) => {
          if (onSearch && evt.key === 'Enter') onSearch()
        }}
      />
      <IconButton type="search" iconClassName="w-5 h-5" className="absolute right-[0.75rem]" onClick={onSearch} />
    </div>
  )
}
