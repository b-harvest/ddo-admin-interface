import { UAParser } from 'ua-parser-js'

const parser = new UAParser(window.navigator.userAgent)

const { type } = parser.getDevice()

export const userAgent = parser.getResult()

export const os = userAgent.os

export const isIOS = os.name === 'iOS'

export const isMobile = type === 'mobile' || type === 'tablet'
