interface Page {
  path: string
  label: string
  pageName: string
}

export const pages: Page[] = [
  {
    path: '/asset',
    label: 'Asset',
    pageName: 'Asset Data Tracking',
  },
  {
    path: '/accounts',
    label: 'Account',
    pageName: 'Account Data Comparison',
  },
]

// utils
export const getPageName = (pathName: string): string => {
  const i = pages.findIndex((page) => page.path === pathName)
  return i > -1 ? pages[i].pageName : ''
}
