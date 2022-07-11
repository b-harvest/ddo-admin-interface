export const getTimeDiff = (timestamp: number, baseTimestamp: number) => baseTimestamp - timestamp

export const isTimeDiffMoreThan = (timediff: number, morethan?: number) => timediff >= (morethan ?? 0)

export const getTimeDiffFromNow = (timestamp: number) => getTimeDiff(timestamp, new Date().getTime())

export const isTimeDiffFromNowMoreThan = (timestamp: number, morethan?: number) =>
  isTimeDiffMoreThan(getTimeDiffFromNow(timestamp), morethan ?? 0)
