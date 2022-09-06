export enum EventCategory {
  WEB_VITALS = 'Web vitals',
  OVERVIEW = 'Overview',
  CHAIN = 'Chain',
  ACCOUNT = 'Account',
  LSV = 'LSV',
}

export enum EventName {
  LSV_ADD_MODAL_OPENED = 'LSV Add modal opened',
  LSV_VALIDATORS_EXPLORER_LINK_CLICKED = 'Validators explorer link clicked',
  ACCOUNT_FROM_TOP_50_CLICKED = 'Account from top 50 clicked',
}

export enum UserProperties {
  EMAIL_HD = 'Email hd',
  BROWSER = 'Browser',
  DARK_MODE = 'Is dark mode',
  SCREEN_RESOLUTION_HEIGHT = 'Screen resolution height',
  SCREEN_RESOLUTION_WIDTH = 'Screen resolution width',
}

export enum Browser {
  FIREFOX = 'Mozilla Firefox',
  SAMSUNG = 'Samsung Internet',
  OPERA = 'Opera',
  INTERNET_EXPLORER = 'Microsoft Internet Explorer',
  EDGE = 'Microsoft Edge (Legacy)',
  EDGE_CHROMIUM = 'Microsoft Edge (Chromium)',
  CHROME = 'Google Chrome or Chromium',
  SAFARI = 'Apple Safari',
  UNKNOWN = 'unknown',
}
