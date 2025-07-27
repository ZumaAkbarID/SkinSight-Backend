export function convertToJakartaTime(isoTime: string): string {
  const date = new Date(isoTime)

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format')
  }

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }

  const formatter = new Intl.DateTimeFormat('en-US', options)
  const parts = formatter.formatToParts(date)

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''

  const weekday = get('weekday')
  const month = get('month')
  const day = get('day')
  const year = get('year')
  const hour = get('hour')
  const minute = get('minute')

  return `${weekday}, ${month} ${day}, ${year} at ${hour}:${minute} WIB`
}
