interface SearchInputProps {
  placeholder?: string
  keyword: string
  onChange: (keyword: string) => void
  onSearch?: () => void
}

export default function Textarea({ placeholder = 'Search', keyword, onChange, onSearch }: SearchInputProps) {
  return (
    <div className="relative flex items-center w-full min-w-[10.625rem] max-w-[calc(100vw-2rem)] rounded-md border-[2px] border-grayCRE-200 dark:border-grayCRE-400 opacity-60 focus-within:opacity-100 md:min-w-[16.5625rem]">
      <textarea
        className="w-full TYPO-BODY-M text-black dark:text-white bg-transparent p-2 outline-none"
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
