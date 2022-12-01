/** @todo remove legacy (old google signin ) */
export interface GoogleUserProfile {
  email: string
  givenName: string
  familyName: string
  googleId: string
  imageUrl?: string
  name: string
}

export type UserProfile = {
  email: string
  name: string | undefined
  givenName: string | undefined
  familyName: string | undefined
}
