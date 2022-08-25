export const firstCharToUpperCase = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const abbrOver = (string: string, over: number) => {
  return string.length > over ? `${string.slice(0, over)}・・・${string.slice(-3)}` : string
}

export const isValidUrl = (url: string) => {
  try {
    new URL(url)
  } catch (e) {
    console.error('isUrl', e)
    return false
  }
  return true
}
