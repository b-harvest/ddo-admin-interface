export enum EventCategory {
  EXCEPTION = 'Exception',
  WEB_VITALS = 'Web vitals',
  OVERVIEW = 'Overview',
  CHAIN = 'Chain',
  ACCOUNT = 'Account',
  LSV = 'LSV',
}

export enum EventName {
  USER_IDENTIFIED = 'User identified',
  PAGE_VIEWED = 'Page viewed',
  CHAIN_CHANGED = 'Chain changed',
  ERROR_BOUNDARY = 'Error boundary',
  EXCEPTION_API = 'API call failed',
  LSVS_VOTING_TABLE_FIELD_CLICKED = 'LSVs voting table field clicked',
  LSVS_VOTING_TABLE_CELL_CLICKED = 'LSVs voting table cell clicked',
  LSVS_VOTING_TABLE_SEARCHED = 'LSVs voting table searched',
  LSVS_TABLE_SEARCHED = 'LSVs lsv list table searched',
  ADD_LSV_BUTTON_CLICKED = 'Button clicked - Add LSV',
  ACCOUNT_FROM_TOP_50_CLICKED = 'Account from top 50 clicked',
}

// it should be added in GTM console as GA4 config, but still wip
export enum UserProperties {
  CLIENT_ID = 'client_id',
  EMAIL_HD = 'email_hd',
  BROWSER = 'browser',
  CHAIN_ID = 'chain_id',
  DARK_MODE = 'dark_mode',
  SCREEN_RESOLUTION_HEIGHT = 'screen_resolution_height',
  SCREEN_RESOLUTION_WIDTH = 'screen_resolution_width',
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
