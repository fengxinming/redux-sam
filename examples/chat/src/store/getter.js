export function getUnreadCount(threads) {
  return Object.keys(threads).reduce((count, id) => {
    return threads[id].lastMessage.isRead ? count : count + 1
  }, 0)
}

export function getCurrentThread(threads, currentThreadID) {
  return currentThreadID
    ? threads[currentThreadID]
    : {};
}

export function getCurrentMessages(threads, currentThreadID, messages) {
  const thread = getCurrentThread(threads, currentThreadID);
  return thread.messages
    ? thread.messages.map(id => messages[id])
    : [];
}

export function getSortedMessages(threads, currentThreadID, messages) {
  const currentMessages = getCurrentMessages(threads, currentThreadID, messages);
  return currentMessages.slice().sort((a, b) => a.timestamp - b.timestamp)
}
