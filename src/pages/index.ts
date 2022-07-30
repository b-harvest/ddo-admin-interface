interface Page {
  path: string
  label: string
  pageName: string
}

export const pages: Page[] = [
  {
    path: '/overview',
    label: 'Overview',
    pageName: 'Overview',
  },
  {
    path: '/chain',
    label: 'Chain',
    pageName: 'Chain Tracking',
  },
  {
    path: '/accounts',
    label: 'Accounts',
    pageName: 'Accounts',
  },
  {
    path: '/account',
    label: 'Account',
    pageName: 'Account Detail',
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
  pathName.split('/')
  const i = pages.findIndex((page) => page.path === pathName)
  return i > -1 ? pages[i].pageName : ''
}
