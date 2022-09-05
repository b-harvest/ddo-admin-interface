export type Page = {
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
    path: '/lsvs',
    label: 'LSV',
    pageName: 'LSV Monitoring',
    nav: true,
  },
  // {
  //   path: '/dex',
  //   label: 'DEX',
  //   pageName: 'DEX Management',
  //   nav: true,
  // },
  {
    path: '/volume',
    label: 'Volume 24h',
    pageName: 'Volume 24h',
  },
  {
    path: '/tvl',
    label: 'TVL',
    pageName: 'TVL',
  },
  {
    path: '/token',
    label: 'Token Detail',
    pageName: 'Token Detail',
  },
  {
    path: '/pair',
    label: 'Pair Detail',
    pageName: 'Pair Detail',
  },
  {
    path: '/pool',
    label: 'Pool Detail',
    pageName: 'Pool Detail',
  },
  {
    path: '/lsv',
    label: 'LSV Detail',
    pageName: 'LSV Detail',
  },
]

// utils
export const getPageName = (pathname: string): string => {
  // pathname.split('/')
  const page = pages.find((page) => page.path === pathname)
  return page?.pageName ?? ''
}

export const findPage = (pathname: string): Page | undefined => {
  return pages.find((page) => page.path === pathname)
}
