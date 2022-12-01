import * as jose from 'jose'
import type { UserProfile } from 'types/user'

export const decodeJwt = (jwt: string) => jose.decodeJwt(jwt)

export const isValidHd = (jwt: string, targetHd: string) => {
  const decodedJwt = decodeJwt(jwt)
  const emailHd = decodedJwt.hd as string | undefined
  return emailHd === targetHd
}

export const getUserProfile = (jwt: string): UserProfile => {
  const decodedJwt = decodeJwt(jwt)
  return {
    email: decodedJwt.email as string,
    name: decodedJwt.name as string | undefined,
    givenName: decodedJwt.given_name as string | undefined,
    familyName: decodedJwt.family_name as string | undefined,
  }
}

export const getJwtExpiresIn = (jwt: string) => {
  const decodedJwt = decodeJwt(jwt)
  const now = new Date().getTime()
  const expiresIn = decodedJwt.exp ? decodedJwt.exp * 1000 - now : (3600 - 5 * 60) * 1000
  return expiresIn
}

/** @todo need to verify token signature, and other fields on server side. */
export const isJwtExpired = (jwt: string) => {
  const decodedJwt = decodeJwt(jwt)
  return decodedJwt.exp === undefined || decodedJwt.exp * 1000 <= new Date().getTime()
}
