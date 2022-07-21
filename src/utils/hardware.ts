export const vibrate = (pattern: number | number[]) => {
  if (window.navigator.vibrate) window.navigator.vibrate(pattern)
}
