interface Page {
  path: string
  label: string
  pageName: string
  nav?: boolean
}

export const pages: Page[] = [
  {
    path: '/overview',
    label: 'Overview',
    pageName: 'Overview',
    nav: true,
  },
  {
    path: '/chain',
    label: 'Chain',
    pageName: 'Chain Tracking',
    nav: true,
  },
  {
    path: '/accounts',
    label: 'Accounts',
    pageName: 'Accounts',
    nav: true,
  },
  {
    path: '/account',
    label: 'Account',
    pageName: 'Account Detail',
    nav: true,
  },
  {
    path: '/validators',
    label: 'Validators',
    pageName: 'Validators',
    nav: true,
  },
  {
    path: '/dex',
    label: 'DEX',
    pageName: 'DEX Management',
    nav: true,
  },
  {
    path: '/volume',
    label: 'Volume 24h',
    pageName: 'Volume 24h',
  },
  {
    path: '/token',
    label: 'Token Detail',
    pageName: 'Token Detail',
  },
]

// utils
export const getPageName = (pathName: string): string => {
  pathName.split('/')
  const i = pages.findIndex((page) => page.path === pathName)
  return i > -1 ? pages[i].pageName : ''
}
