export type Page = {
  path: string
  label: string
  pageName: string
  nav?: boolean
  showPageName?: boolean
}

export const pages: Page[] = [
  {
    path: '/vo/overview',
    label: 'Overview',
    pageName: 'DDO Overview',
    showPageName: true,
    nav: true,
  },
  {
    path: '/vo/accounts',
    label: 'Accounts',
    pageName: 'DDO Accounts',
    showPageName: true,
    nav: true,
  },
  {
    path: '/vo/balances',
    label: 'Balances',
    pageName: 'DDO Balances',
    showPageName: true,
    nav: true,
  },
  {
    path: '/vo/validators',
    label: 'Rewards',
    pageName: 'DDO Validator Rewards',
    showPageName: true,
    nav: true,
  },
  {
    path: '/vo/txs',
    label: 'Trans',
    pageName: 'DDO Transactions',
    showPageName: true,
    nav: true,
  },
  {
    path: '/vo/votes',
    label: 'Votes',
    pageName: 'DDO Votes',
    showPageName: true,
    nav: true,
  },
  {
    path: '/vo/proposals',
    label: 'Proposals',
    pageName: 'DDO Proposals',
    showPageName: true,
    nav: true,
  },
  // {
  //   path: '/chain',
  //   label: 'Chain',
  //   pageName: 'Chain Tracking',
  //   showPageName: true,
  //   nav: true,
  // },
  // {
  //   path: '/accounts',
  //   label: 'Accounts',
  //   pageName: 'Accounts',
  //   showPageName: true,
  //   nav: false,
  // },
  // {
  //   path: '/account',
  //   label: 'Account',
  //   pageName: 'Account Detail',
  //   showPageName: true,
  //   nav: false,
  // },
  // {
  //   path: '/lsvs',
  //   label: 'LSV',
  //   pageName: 'LSV Monitoring',
  //   showPageName: true,
  //   nav: false,
  // },
  // {
  //   path: '/volume',
  //   label: 'Volume 24h',
  //   pageName: 'Volume 24h',
  //   showPageName: true,
  // },
  // {
  //   path: '/tvl',
  //   label: 'TVL',
  //   pageName: 'TVL',
  //   showPageName: true,
  // },
  // {
  //   path: '/token',
  //   label: 'Token Detail',
  //   pageName: 'Token Detail',
  //   showPageName: false,
  // },
  // {
  //   path: '/pair',
  //   label: 'Pair Detail',
  //   pageName: 'Pair',
  //   showPageName: true,
  // },
  // {
  //   path: '/pool',
  //   label: 'Pool Detail',
  //   pageName: 'Pool',
  //   showPageName: true,
  // },
  // {
  //   path: '/lsv',
  //   label: 'LSV Detail',
  //   pageName: 'LSV Detail',
  //   showPageName: false,
  // },
  // {
  //   path: '/token-launch',
  //   label: 'Token Launch',
  //   pageName: 'Set Tokens',
  //   showPageName: true,
  // },
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
