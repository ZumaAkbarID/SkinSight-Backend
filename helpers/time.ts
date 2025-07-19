export function convertToJakartaTime(isoTime: string): string {
  const date = new Date(isoTime)

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format')
  }

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .format(date)
    .replace('.', ':')

  return formattedTime + ' WIB'
}
