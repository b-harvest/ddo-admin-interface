interface SearchInputProps {
  placeholder?: string
  keyword: string
  onChange: (keyword: string) => void
  onSearch?: () => void
  fillHeight?: boolean
}

export default function Textarea({
  placeholder = 'Search',
  keyword,
  onChange,
  onSearch,
  fillHeight = false,
}: SearchInputProps) {
  return (
    <div
      className={`relative flex items-center w-full min-w-[0] max-w-[calc(100vw-2rem)] rounded-md border-[2px] border-grayCRE-200 dark:border-grayCRE-400 opacity-60 focus-within:opacity-100 md:min-w-[0]`}
      style={{ height: fillHeight ? '100%' : 'auto' }}
    >
      <textarea
        className="w-full TYPO-BODY-M text-black dark:text-white bg-transparent p-2 outline-none"
        style={{ height: fillHeight ? '100%' : 'auto' }}
        value={keyword}
        placeholder={placeholder}
        onChange={({ target }) => onChange(target.value)}
        onKeyPress={(evt) => {
          if (onSearch && evt.key === 'Enter') onSearch()
        }}
      />
    </div>
  )
}
