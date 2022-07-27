interface Page {
  path: string
  label: string
  pageName: string
}

export const pages: Page[] = [
  {
    path: '/finance',
    label: 'Finance',
    pageName: 'Finance',
  },
  {
    path: '/chain',
    label: 'Chain',
    pageName: 'Chain Tracking',
  },
  {
    path: '/accounts',
    label: 'Accounts',
    pageName: 'Top Accounts',
  },
  {
    path: '/account',
    label: 'Account Sync',
    pageName: 'Account Sync Status',
  },
  {
    path: '/validators',
    label: 'Validators',
    pageName: 'Validators',
  },
  {
    path: '/dex',
    label: 'DEX',
    pageName: 'DEX Management',
  },
]

// utils
export const getPageName = (pathName: string): string => {
  const i = pages.findIndex((page) => page.path === pathName)
  return i > -1 ? pages[i].pageName : ''
}
