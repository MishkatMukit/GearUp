export const diffInDays = (start: Date, end: Date) => {
    const ms = end.getTime() - start.getTime()
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24))
    return days < 1 ? 1 : days
}