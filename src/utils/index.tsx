// 0 unknown
// 1 waiting for driver
// 2 on road
// 3 in stock
// 4 archived

import moment from 'moment'
import {
  EShipmentHistoryStatus,
  IShipment,
  IShipmentHistory,
  IShipmentInfo,
} from '../types/shipment'
import {TFunction} from 'i18next'

export function getRouteStatus(route: IShipmentHistory | undefined) {
  return 0
}

export function getShipmentStatusLabel(
  item: IShipment,
  t: TFunction<'translation', undefined, 'translation'>
): string {
  if (item.last_history?.status === EShipmentHistoryStatus.completed) {
    return 'Завершен'
  }
  if (item.last_history?.status === EShipmentHistoryStatus.created) {
    return 'Груз создан'
  }
  if (item.last_history?.status == EShipmentHistoryStatus.on_way) {
    return 'Груз в пути'
  }
  if (item.last_history?.status == EShipmentHistoryStatus.overload) {
    return 'Перегружается'
  }
  if (item.last_history?.status == EShipmentHistoryStatus.changed_driver) {
    return 'Водитель сменился'
  }
  console.log(EShipmentHistoryStatus.changed_driver)
  return item.last_history?.status || 'Неизвестный'
}

export function getRouteStatusText(
  status: EShipmentHistoryStatus,
  t: TFunction<'translation', undefined, 'translation'>
) {
  return status === EShipmentHistoryStatus.created
    ? t('shipment_waiting_for_driver')
    : status === EShipmentHistoryStatus.on_way
    ? t('shipment_on_the_way')
    : status === EShipmentHistoryStatus.overload
    ? t('shipment_in_stock')
    : status === EShipmentHistoryStatus.completed
    ? t('archived')
    : t('unknown')
}

export function getLastRouteInfoByShipment(
  g: IShipment,
  t: TFunction<'translation', undefined, 'translation'>
): IShipment & IShipmentInfo {
  const datetime = g.location_updated_at ? moment(g.location_updated_at) : null
  const isOnline = !!(
    datetime && datetime.toDate().getTime() > new Date().getTime() - 60000
  )
  const status = getRouteStatus(g.last_history)
  return {
    isOnline,
    status,
    label: getShipmentStatusLabel(g, t),
    datetime,
    colorBg:
      status === 1 || status === 3
        ? g.last_history?.status == EShipmentHistoryStatus.on_way
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
            color:
              g.last_history?.status == EShipmentHistoryStatus.on_way
                ? '#2E7D32'
                : '#F9A825',
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

export function getRouteInfo(route: IShipmentHistory, t) {
  return {
    label: getRouteStatusText(route.status, t),
    colorBg: true
      ? route.received_at
        ? 'rgba(46,125,50,0.1)'
        : 'rgba(255,241,118,0.3)'
      : 'rgba(33,33,33,0.1)',
    icon: true ? (
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

export const SHIPMENT_TYPES: {[keyof: string]: string} = {
  tashkent_trade: 'АВТОВОЗ',
  transit: 'Транзит',
}

export const getShipmentType = (name: string) => {
  return SHIPMENT_TYPES[name]
}
