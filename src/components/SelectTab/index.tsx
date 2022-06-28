import { Tab } from '@headlessui/react'

export type SelectTabItem = string

interface SelectTabProps {
  tabItems: SelectTabItem[]
  selectedTabIndex?: number
  onChange?: (index: number) => void
}

export default function SelectTab({ tabItems, selectedTabIndex = 0, onChange }: SelectTabProps) {
  return (
    <div className="text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)] py-2">
      <div className="text-left py-2">Chain</div>
      <Tab.Group selectedIndex={selectedTabIndex} onChange={onChange}>
        <Tab.List className={'flex bg-[#EAEAEA] dark:bg-grayCRE-600-d rounded-lg p-1'}>
          {tabItems.map((tabItem) => (
            <Tab
              key={tabItem}
              className={({ selected }) =>
                `grow rounded-[0.625rem] leading-none py-[6px] BOLD14 ${
                  selected
                    ? ' GRADIENT-YELLOW-200 text-blackCRE dark:GRADIENT-YELLOW-100 dark:text-grayCRE-500-d'
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
