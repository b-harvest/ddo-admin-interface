export const firstCharToUpperCase = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const abbrOver = (string: string, over: number) => {
  return string.length > over ? `${string.slice(0, over)}・・・${string.slice(-3)}` : string
}
