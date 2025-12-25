import moment from 'moment'
import { IShipment, IShipmentInfo, EShipmentHistoryStatus } from '../../types/shipment'
import { getShipmentInfo } from '../../models/shipment'
import { getShipmentType } from '../../utils'
import { StatusIndicator, Badge } from '../ui'
import type { StatusType } from '../ui/StatusIndicator'
import styles from './ShipmentItem.module.css'

interface ShipmentItemProps {
  shipment: IShipment & IShipmentInfo
  onSelect: (shipment: IShipment) => void
}

// Маппинг статусов для StatusIndicator
const getStatusType = (status?: EShipmentHistoryStatus, isOnline?: boolean): StatusType => {
  if (status === EShipmentHistoryStatus.completed) return 'completed'
  if (status === EShipmentHistoryStatus.on_way) return isOnline ? 'online' : 'offline'
  if (status === EShipmentHistoryStatus.overload) return 'overload'
  if (status === EShipmentHistoryStatus.changed_driver) return 'changed-driver'
  if (status === EShipmentHistoryStatus.created) return 'created'
  return 'pending'
}

export default function ShipmentItem({ shipment, onSelect }: ShipmentItemProps) {
  const info = getShipmentInfo(shipment)
  const statusType = getStatusType(shipment.last_history?.status, shipment.is_online)

  return (
    <div className={styles.item} onClick={() => onSelect(shipment)}>
      <StatusIndicator 
        status={statusType}
        size="md"
        icon={shipment.icon}
        pulse={shipment.is_online}
      />
      
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badges}>
            {shipment.cmr_path && (
              <Badge variant="success" size="sm">CMR</Badge>
            )}
            {shipment.type && (
              <Badge 
                variant={shipment.type === 'transit' ? 'info' : 'primary'} 
                size="sm"
              >
                {getShipmentType(shipment.type)}
              </Badge>
            )}
          </div>
          <span className={styles.title}>{shipment.title}</span>
        </div>

        {/* Status Label */}
        <div className={styles.label}>{shipment.label.toUpperCase()}</div>

        {/* Driver Info */}
        {shipment.last_history?.driver && (
          <div className={styles.driverInfo}>
            <span>{shipment.last_history.truck_number}</span>
            <span className={styles.separator}>|</span>
            <span>{shipment.last_history.driver_full_name}</span>
            <span className={styles.separator}>|</span>
            <span>+{shipment.last_history.driver_phone_number}</span>
          </div>
        )}

        {/* Route */}
        <div className={styles.route}>
          <span className={styles.point}>{shipment.from_point?.title['ru']}</span>
          <span className={`material-symbols-outlined ${styles.arrow}`}>arrow_forward</span>
          <span className={styles.point}>{shipment.to_point?.title['ru']}</span>
        </div>

        {/* Timestamp */}
        {shipment.location_updated_at && (
          <div className={styles.timestamp}>
            {moment(shipment.location_updated_at).format('DD.MM.YYYY HH:mm')}
          </div>
        )}
      </div>
    </div>
  )
}
