import { Popover } from '@headlessui/react'
import Icon, { IconType } from 'components/Icon'
import { ReactNode } from 'react'

export interface PopoverPanelItem {
  label?: string
  iconType: IconType
  link?: string
  onClick?: () => void
}

interface SettingWidgetProps {
  panelItems: PopoverPanelItem[]
  children: ReactNode
}

export default function SettingWidget({ children, panelItems }: SettingWidgetProps) {
  return (
    <Popover className="relative flex items-center justify-center">
      <Popover.Button className="px-4">
        <div className="flex items-center justify-center w-6 h-9 transition-opacity cursor-pointer hover:opacity-50">
          <Icon type="more" className="w-6 h-8 text-black dark:text-white" />
        </div>
      </Popover.Button>

      <Popover.Panel className="absolute z-10 w-56 p-4 overflow-hidden bg-white rounded-lg shadow-lg -left-[188px] top-[68px] ring-1 ring-black ring-opacity-5 dark:bg-grayCRE-500-d">
        {panelItems.map((panelItem, index) => (
          <div
            key={index}
            className="text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)] hover:text-[rgba(0,0,0,0.8)] dark:hover:text-[rgba(255,255,255,0.8)] transition-colors py-2"
          >
            {panelItem.link ? (
              <a href={panelItem.link} target="_blank" rel="noreferrer">
                <div className="flex items-center justify-between">
                  <div>{panelItem.label ?? ''}</div> <Icon type={panelItem.iconType} className="w-4 h-4" />
                </div>
              </a>
            ) : (
              <button type="button" className="block w-full" onClick={panelItem.onClick}>
                <div className="flex items-center justify-between">
                  <div>{panelItem.label ?? ''}</div> <Icon type={panelItem.iconType} className="w-4 h-4" />
                </div>
              </button>
            )}
          </div>
        ))}
        {children}
      </Popover.Panel>
    </Popover>
  )
}
