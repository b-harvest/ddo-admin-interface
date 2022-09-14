export enum EventCategory {
  EXCEPTION = 'Exception',
  WEB_VITALS = 'Web vitals',
  OVERVIEW = 'Overview',
  CHAIN = 'Chain',
  ACCOUNT = 'Account',
  LSV = 'LSV',
}

export enum EventName {
  ERROR_BOUNDARY = 'Error boundary',
  EXCEPTION_API = 'API call failed',
  LSV_ADD_MODAL_OPENED = 'LSV Add modal opened',
  LSV_VALIDATORS_EXPLORER_LINK_CLICKED = 'Validators explorer link clicked',
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
