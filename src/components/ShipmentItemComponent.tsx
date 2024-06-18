import moment from 'moment'
import {IShipment, IShipmentInfo} from '../types/shipment.js'
import {getShipmentType} from '../utils/index.js'
import {getShipmentInfo} from '../models/shipment.js'

export default function ShipmentItemComponent({
  g,
  onSelect,
}: {
  g: IShipment & IShipmentInfo
  onSelect: (shipment: IShipment) => void
}) {
  const info = getShipmentInfo(g)

  return (
    <>
      <div className={'driver-list-item'} onClick={() => onSelect(g)}>
        <div
          className={
            'p-2 me-3 mt-2 d-flex rounded-circle justify-content-center align-items-center'
          }
          style={{
            backgroundColor: info.color,
          }}
        >
          {g.icon}
        </div>
        <div className={'flex-grow-1'}>
          <div
            style={{fontSize: 24}}
            className={'d-flex align-items-center gap-2'}
          >
            {g.last_history?.cmr_status === 'PENDING' ? (
              <div
                style={{fontSize: 15}}
                className={'bg-success d-inline text-white p-1 rounded'}
              >
                CMR
              </div>
            ) : null}
            {g.title}
          </div>
          <div className={'text-muted'}>{g.label.toLocaleUpperCase()}</div>
          {g.last_history?.driver ? (
            <div className={'text-muted'}>
              {g.last_history.truck_number} | {g.last_history.driver_full_name}{' '}
              | +{g.last_history.driver_phone_number}
            </div>
          ) : null}
          <div
            style={{width: '100%'}}
            className={'d-flex mt-2 justify-content-around align-items-center'}
          >
            <div className={'h5'}>{g.from_point?.title['ru']}</div>
            <span className='material-symbols-outlined' style={{color: 'grey'}}>
              arrow_forward
            </span>
            <div className={'h5'}>{g.to_point?.title['ru']}</div>
          </div>
          {/*<pre>{JSON.stringify(g.last_route, null, 2)}</pre>*/}
          {/*{g.payload ? (*/}
          {g.location_updated_at || g.type ? (
            <div className={'text-muted'}>
              {g.location_updated_at
                ? moment(g.location_updated_at).format('DD.MM.YYYY HH:ss')
                : ''}
              {g.location_updated_at && g.type ? ' | ' : ''}
              {g.type ? `${getShipmentType(g.type)}` : ''}
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
