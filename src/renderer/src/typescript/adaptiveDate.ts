export function getDaysUntil(completeUntil: string): string {
  const targetDate = new Date(completeUntil)
  const now = new Date()

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfTarget = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  )

  const diffTime = startOfTarget.getTime() - startOfToday.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const daysLeftInMonth = endOfMonth - now.getDate()

  if (diffDays < 0) return 'Overdue'
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === 2) return 'Day after tomorrow'

  if (diffDays <= daysLeftInMonth) return `In ${diffDays} days`

  const options = {
    month: 'short',
    day: 'numeric',
    ...(targetDate.getFullYear() !== now.getFullYear() && { year: 'numeric' })
  }

  return startOfTarget.toLocaleDateString('en-US', options)
}
