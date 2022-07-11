interface Page {
  path: string
  label: string
  pageName: string
}

export const pages: Page[] = [
  {
    path: '/asset',
    label: 'Asset',
    pageName: 'DEX Asset Tracking',
  },
  {
    path: '/accounts',
    label: 'Account',
    pageName: 'Account Comparison',
  },
  {
    path: '/validators',
    label: 'Validators',
    pageName: 'Validators under 3SO/Kick-out',
  },
]

// utils
export const getPageName = (pathName: string): string => {
  const i = pages.findIndex((page) => page.path === pathName)
  return i > -1 ? pages[i].pageName : ''
}
