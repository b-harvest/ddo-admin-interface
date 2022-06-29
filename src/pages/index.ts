interface Page {
  path: string
  label: string
  pageName: string
}

export const pages: Page[] = [
  {
    path: '/asset',
    label: 'Asset',
    pageName: 'Asset Data',
  },
  {
    path: '/accounts',
    label: 'Account',
    pageName: 'Account Data',
  },
]

// utils
export const getPageName = (pathName: string): string => {
  const i = pages.findIndex((page) => page.path === pathName)
  return i > -1 ? pages[i].pageName : ''
}
