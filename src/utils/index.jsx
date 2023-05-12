// 0 unknown
// 1 waiting for driver
// 2 on road
// 3 in stock
// 4 archived

import moment from 'moment/moment.js'

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

export function getLastRouteInfoByShipment(g) {
  const datetime = g.location_updated_at
    ? moment(new Date(g.location_updated_at))
    : null
  const isOnline =
    datetime && datetime.toDate().getTime() > new Date().getTime() - 60000
  const status = getRouteStatus(g.last_route)
  return {
    isOnline,
    status,
    label: getRouteStatusText(status),
    datetime,
    colorBg:
      status === 1 || status === 3
        ? g.last_route.received_at
          ? 'rgba(46,125,50,0.1)'
          : 'rgba(255,241,118,0.3)'
        : isOnline
        ? 'rgba(46,125,50,0.1)'
        : 'rgba(255,241,118,0.3)',
    icon:
      status === 1 || status === 3 ? (
        <span
          className='material-symbols-outlined'
          style={{
            fontSize: 30,
            color: g.last_route.received_at ? '#2E7D32' : '#F9A825',
          }}
        >
          inventory_2
        </span>
      ) : (
        <span
          className='material-symbols-outlined'
          style={{
            fontSize: 30,
            color: isOnline ? '#2E7D32' : '#F9A825',
          }}
        >
          local_shipping
        </span>
      ),
    ...g,
  }
}

export function getRouteInfo(route) {
  const status = getRouteStatus(route)
  return {
    status,
    label: getRouteStatusText(status),
    colorBg:
      status === 1 || status === 3
        ? route.received_at
          ? 'rgba(46,125,50,0.1)'
          : 'rgba(255,241,118,0.3)'
        : 'rgba(33,33,33,0.1)',
    icon:
      status === 1 || status === 3 ? (
        <span
          className='material-symbols-outlined'
          style={{
            fontSize: 30,
            color: route.received_at ? '#2E7D32' : '#F9A825',
          }}
        >
          inventory_2
        </span>
      ) : (
        <span
          className='material-symbols-outlined'
          style={{
            fontSize: 30,
            color: '#212121',
          }}
        >
          local_shipping
        </span>
      ),
    ...route,
  }
}
