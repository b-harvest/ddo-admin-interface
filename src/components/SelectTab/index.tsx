import { Tab } from '@headlessui/react'
import { useMemo } from 'react'
export type SelectTabItem<T> = {
  label: string
  value: T
}

interface SelectTabProps<T> {
  label?: string
  tabItems: SelectTabItem<T>[]
  selectedValue: T
  onChange?: (value: T) => void
  className?: string
  getVerticalIfMobile?: boolean
}

export default function SelectTab<T>({
  label,
  tabItems,
  selectedValue,
  onChange,
  className = '',
  getVerticalIfMobile = false,
}: SelectTabProps<T>) {
  const selectedTabIndex = useMemo(
    () => tabItems.findIndex((item) => item.value === selectedValue),
    [tabItems, selectedValue]
  )

  const handleOnChange = (selectedIndex: number) => {
    const selectedItem = tabItems.find((_, index) => index === selectedIndex)
    if (onChange && selectedItem) onChange(selectedItem.value)
  }

  if (tabItems.length < 1) return null
  return (
    <div className={`text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)] ${className}`}>
      {label ? <div className="text-left py-2">{label}</div> : null}
      <Tab.Group selectedIndex={selectedTabIndex} onChange={handleOnChange}>
        <Tab.List
          className={`${
            getVerticalIfMobile ? 'flex-col space-y-1 md:flex-row md:space-y-0' : ''
          } w-full flex justify-between items-center px-2 py-1 bg-[#EAEAEA] dark:bg-black rounded-lg p-1`}
        >
          {tabItems.map((tabItem) => (
            <Tab
              key={tabItem.label}
              className={({ selected }) =>
                `grow rounded-[0.625rem] px-2 leading-none TYPO-BODY-M ${
                  selected
                    ? 'text-black dark:text-[rgba(255,255,255,0.8)]'
                    : 'text-[rgba(0,0,0,0.2)] dark:text-[rgba(255,255,255,0.3)] hover:text-[rgba(0,0,0,0.7)] dark:hover:text-[rgba(255,255,255,0.7)]'
                }`
              }
            >
              {tabItem.label}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
    </div>
  )
}
