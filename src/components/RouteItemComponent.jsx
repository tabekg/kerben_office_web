import React from 'react'
import {getRouteStatus, getRouteStatusText} from '../utils/index.jsx'
import moment from 'moment/moment'

export default function RouteItemComponent({route, selectShipment}) {
  const datetime = route.location_updated_at
    ? moment(new Date(route.location_updated_at))
    : null
  const status = getRouteStatus(route)
  const colorBg =
    status === 1 || status === 3
      ? route.received_at
        ? 'rgba(46,125,50,0.1)'
        : 'rgba(255,241,118,0.3)'
      : 'rgba(46,125,50,0.1)'
  const icon =
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
          color: '#F9A825',
        }}
      >
        local_shipping
      </span>
    )

  return (
    <>
      <div
        className={'driver-list-item'}
        onClick={() => selectShipment && selectShipment(g)}
      >
        <div
          className={
            'p-2 me-3 mt-2 d-flex rounded-circle justify-content-center align-items-center'
          }
          style={{
            backgroundColor: colorBg,
          }}
        >
          {icon}
        </div>
        <div className={'flex-grow-1'}>
          <div className={'text-muted'}>{getRouteStatusText(status)}</div>
          <div className={'my-2 text-muted'}>
            <div>
              Гос. номер транспорта: <strong>{route.truck_number}</strong>
            </div>
            <div>
              Отправитель:{' '}
              <strong>
                {route.sender.full_name} (+
                {route.sender.phone_number})
              </strong>
            </div>
            <div>
              Водитель:{' '}
              <strong>
                {route.driver.full_name} (+
                {route.driver.phone_number})
              </strong>
            </div>
            <div>
              Получатель:{' '}
              <strong>
                {route.receiver ? (
                  <>
                    {route.receiver.full_name} (+
                    {route.receiver.phone_number})
                  </>
                ) : (
                  <i>нет данных</i>
                )}
              </strong>
            </div>
          </div>
          <div
            style={{width: '100%'}}
            className={'d-flex mt-2 justify-content-around align-items-center'}
          >
            <div className={'h5'}>{route.from_point.title}</div>
            <span className='material-symbols-outlined' style={{color: 'grey'}}>
              arrow_forward
            </span>
            <div className={'h5'}>{route.to_point.title}</div>
          </div>
          {/*<pre>{JSON.stringify(g.last_route, null, 2)}</pre>*/}
          {/*{g.payload ? (*/}
          {route.location_updated_at ? (
            <div className={'text-muted'}>{datetime.fromNow()}</div>
          ) : null}
          {/*) : null}*/}
        </div>
      </div>
    </>
  )
}
