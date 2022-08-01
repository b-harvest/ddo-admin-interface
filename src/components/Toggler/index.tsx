import { useCallback, useEffect, useState } from 'react'

export type TogglerItem<T> = {
  label: string
  value: T
}

interface TogglerProps<T> {
  label?: string
  tabItems: TogglerItem<T>[]
  defaultIndex?: number
  onChange?: (value: T) => void
  className?: string
  getVerticalIfMobile?: boolean
}

export default function Toggler<T>({
  label,
  tabItems,
  defaultIndex,
  onChange,
  className = '',
  getVerticalIfMobile = false,
}: TogglerProps<T>) {
  const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex ?? 0)

  const handleClick = useCallback(() => {
    if (selectedIndex >= tabItems.length - 1) setSelectedIndex(0)
    else setSelectedIndex(selectedIndex + 1)
  }, [tabItems, selectedIndex, setSelectedIndex])

  useEffect(() => {
    if (onChange) onChange(tabItems[selectedIndex].value)
  }, [onChange, tabItems, selectedIndex])

  if (tabItems.length < 1) return null
  return (
    <div
      className={`text-[rgba(0,0,0,0.2)] dark:text-[rgba(255,255,255,0.3)] hover:text-[rgba(0,0,0,0.7)] dark:hover:text-[rgba(255,255,255,0.7)] ${className}`}
    >
      {label ? <div className="text-left py-2">{label}</div> : null}
      <div
        className={`${
          getVerticalIfMobile ? 'flex-col space-y-1 md:flex-row md:space-y-0' : ''
        } w-full flex justify-between items-center px-2 py-1 bg-[#EAEAEA] dark:bg-black rounded-lg p-1 cursor-pointer`}
        onClick={handleClick}
      >
        {tabItems[selectedIndex].label}
      </div>
    </div>
  )
}
