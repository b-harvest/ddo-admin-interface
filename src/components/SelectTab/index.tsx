import { Tab } from '@headlessui/react'

export type SelectTabItem = string

interface SelectTabProps {
  label?: string
  tabItems: SelectTabItem[]
  selectedTabIndex?: number
  onChange?: (index: number) => void
  className?: string
}

export default function SelectTab({ label, tabItems, selectedTabIndex = 0, onChange, className = '' }: SelectTabProps) {
  return (
    <div className={`text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)] pb-2 ${className}`}>
      {label ? <div className="text-left py-2">{label}</div> : null}
      <Tab.Group selectedIndex={selectedTabIndex} onChange={onChange}>
        <Tab.List className={'flex bg-[#EAEAEA] dark:bg-black rounded-lg p-1'}>
          {tabItems.map((tabItem) => (
            <Tab
              key={tabItem}
              className={({ selected }) =>
                `grow rounded-[0.625rem] leading-none py-[6px] BOLD14 ${
                  selected
                    ? ' GRADIENT-YELLOW-200 text-blackCRE dark:GRADIENT-YELLOW-100 dark:text-[rgba(255,255,255,0.8)]'
                    : 'text-[rgba(0,0,0,0.2)] dark:text-[rgba(255,255,255,0.3)] hover:text-[rgba(0,0,0,0.7)] dark:hover:text-[rgba(255,255,255,0.7)]'
                }`
              }
            >
              {tabItem}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
    </div>
  )
}
