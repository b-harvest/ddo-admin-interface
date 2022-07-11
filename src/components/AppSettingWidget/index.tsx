import MoreWidget, { PopoverPanelItem } from 'components/Widgets/MoreWidget'

export default function AppSettingWidget() {
  // popover
  const settingsWidgetPanelItems: PopoverPanelItem[] = [
    {
      label: 'Blog',
      iconType: 'medium',
      link: 'https://crescentnetwork.medium.com/',
    },
    {
      label: 'Logout',
      iconType: 'close',
      onClick: handleLogoutClick,
    },
  ]

  function handleLogoutClick() {
    // logout proceeds..
  }

  return <MoreWidget panelItems={settingsWidgetPanelItems}></MoreWidget>
}
