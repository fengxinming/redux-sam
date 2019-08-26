const limit = 5;

export function recentHistory(history) {
  const end = history.length
  const begin = end - limit < 0 ? 0 : end - limit
  return history
    .slice(begin, end)
    .join(', ')
}
