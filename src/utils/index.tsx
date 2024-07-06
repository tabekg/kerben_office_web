// 0 unknown
// 1 waiting for driver
// 2 on road
// 3 in stock
// 4 archived

import moment from 'moment'
import {
  EShipmentHistoryStatus,
  EShipmentStatus,
  IShipment,
  IShipmentHistory,
  IShipmentInfo,
} from '../types/shipment'
import {TFunction} from 'i18next'

export function getRouteStatus(route: IShipmentHistory | undefined) {
  return 0
}

export function getIconNameByShipment(g: IShipment) {
  if (g.status == EShipmentStatus.on_way) {
    return (
      <span
        className='material-symbols-outlined'
        style={{
          fontSize: 30,
          color: true ? '#2E7D32' : '#F9A825',
        }}
      >
        local_shipping
      </span>
    )
  }

  return (
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
  )
}

export function getShipmentStatusLabel(
  item: IShipmentHistory | null,
  t: TFunction<'translation', undefined, 'translation'>
): string {
  if (!item) {
    return 'Неизвестный'
  }
  if (item?.status === EShipmentHistoryStatus.completed) {
    return 'Завершен'
  }
  if (item?.status === EShipmentHistoryStatus.created) {
    return 'Груз создан'
  }
  if (item?.status == EShipmentHistoryStatus.on_way) {
    return 'Груз в пути'
  }
  if (item?.status == EShipmentHistoryStatus.overload) {
    return 'Перегружается'
  }
  if (item?.status == EShipmentHistoryStatus.changed_driver) {
    return 'Водитель сменился'
  }
  console.log(EShipmentHistoryStatus.changed_driver)
  return item?.status || 'Неизвестный'
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

  const icon = getIconNameByShipment(g)

  return {
    isOnline,
    status,
    label: getShipmentStatusLabel(g.last_history ?? null, t),
    datetime,
    color:
      status === 1 || status === 3
        ? g.last_history?.status == EShipmentHistoryStatus.on_way
          ? 'rgba(46,125,50,0.1)'
          : 'rgba(255,241,118,0.3)'
        : isOnline
        ? 'rgba(46,125,50,0.1)'
        : 'rgba(255,241,118,0.3)',
    icon,
    ...g,
  }
}

export function getRouteInfo(
  route: IShipmentHistory,
  t: TFunction<'translation', undefined, 'translation'>
) {
  return {
    label: getShipmentStatusLabel(route, t),
    colorBg: true
      ? true
        ? 'rgba(46,125,50,0.1)'
        : 'rgba(255,241,118,0.3)'
      : 'rgba(33,33,33,0.1)',
    icon: true ? (
      <span
        className='material-symbols-outlined'
        style={{
          fontSize: 30,
          color: true ? '#2E7D32' : '#F9A825',
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
