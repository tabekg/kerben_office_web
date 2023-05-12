// 0 unknown
// 1 waiting for driver
// 2 on road
// 3 in stock
// 4 archived

export function getRouteStatus(route) {
  if (!route.is_accepted) {
    return 1
  }
  if (route.is_accepted && !route.received_at) {
    return 2
  }
  if (route.received_at) {
    return 3
  }
  return 0
}

export function getRouteStatusText(status) {
  return status === 1
    ? 'ГРУЗ ЖДЕТ ВОДИТЕЛЯ'
    : status === 2
    ? 'ГРУЗ В ПУТИ'
    : status === 3
    ? 'ГРУЗ НА СКЛАДЕ'
    : status === 3
    ? 'АРХИВИРОВАНО'
    : 'НЕИЗВЕСТНО'
}
