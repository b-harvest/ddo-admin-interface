interface SearchInputProps {
  type?: string
  placeholder?: string
  keyword: string
  onChange: (keyword: string) => void
  onSearch?: () => void
}

export default function Input({ type = 'text', placeholder = 'Text', keyword, onChange, onSearch }: SearchInputProps) {
  return (
    <div className="relative flex items-center w-full min-w-[10.625rem] max-w-[calc(100vw-2rem)] rounded-md border-[2px] border-grayCRE-200 dark:border-grayCRE-400 opacity-60 focus-within:opacity-100 md:min-w-[16.5625rem]">
      <input
        type={type}
        className="w-full TYPO-BODY-M text-black dark:text-white bg-transparent p-2 outline-none"
        value={keyword}
        placeholder={placeholder}
        onChange={({ target }) => onChange(target.value.trim())}
        onKeyPress={(evt) => {
          if (onSearch && evt.key === 'Enter') onSearch()
        }}
      />
      {/* <IconButton
        type="search"
        iconClassName="w-5 h-5 text-grayCRE-200 dark:text-white"
        className="absolute right-[0.75rem]"
        onClick={onSearch}
      /> */}
    </div>
  )
}
