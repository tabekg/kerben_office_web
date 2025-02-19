export function parseDate(date: string): Date | null {
  // Normalize separators: replace ".", ",", "-" with "/"
  let normalizedDateStr = date.replace(/[-.,]/g, '/').trim()

  // Split into parts
  let parts: string[] = normalizedDateStr.split('/')

  // Handle YYYY-MM-DD (ISO format)
  if (parts.length === 3 && parts[0].length === 4) {
    let [year, month, day] = parts.map((num) => parseInt(num, 10))
    return new Date(year, month - 1, day)
  }

  // Handle DD.MM.YY, DD.MM.YYYY, DD-MM-YYYY, DD/MM/YYYY
  if (parts.length === 3) {
    let [day, month, year] = parts.map((num) => parseInt(num, 10))

    // Handle two-digit year cases (e.g., '25' → '2025')
    if (year < 100) {
      year += 2000
    }

    let date = new Date(year, month - 1, day)
    return date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
      ? date
      : null
  }

  return null
}

export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function formatDateDDMMYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}.${month}.${year}`
}
