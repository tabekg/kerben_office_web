// 0 unknown
// 1 waiting for driver
// 2 on road
// 3 in stock
// 4 archived

import moment from 'moment'

export function getRouteStatus(route) {
  if (!route.is_accepted) {
    return 1
  }
  if (route.is_accepted && !route.cmr_status) {
    return 2
  }
  if (route.cmr_status) {
    return 3
  }
  return 0
}

export function getRouteStatusText(status, t) {
  return status === 1
    ? t('shipment_waiting_for_driver')
    : status === 2
    ? t('shipment_on_the_way')
    : status === 3
    ? t('shipment_in_stock')
    : status === 3
    ? t('archived')
    : t('unknown')
}

export function getLastRouteInfoByShipment(g, t) {
  const datetime = g.location_updated_at
    ? moment(new Date(g.location_updated_at))
    : null
  const isOnline =
    datetime && datetime.toDate().getTime() > new Date().getTime() - 60000
  const status = getRouteStatus(g.last_route)
  return {
    isOnline,
    status,
    label: getRouteStatusText(status, t),
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

export function getRouteInfo(route, t) {
  const status = getRouteStatus(route)
  return {
    status,
    label: getRouteStatusText(status, t),
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

export const SHIPMENT_TYPES = {
  tashkent_trade: 'АВТОВОЗ',
  transit: 'Транзит',
}

export const getShipmentType = (name) => {
  return SHIPMENT_TYPES[name]
}
