export const getCurrUnixTimestamp = () => Math.floor(Date.now() / 1000)

export const getUnixTimestamp = (date: Date) => Math.floor(date.getTime() / 1000)
