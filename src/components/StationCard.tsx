import { Bookmark, ChevronRight, Gauge, MapPin, Star } from 'lucide-react';
import { formatPower, formatStationPrice, type ChargingStation } from '../data/stations';

interface StationCardProps {
  station: ChargingStation;
  active?: boolean;
  onClick?: () => void;
  onSave?: () => void;
  compact?: boolean;
}

export default function StationCard({ station, active, onClick, onSave, compact }: StationCardProps) {
  const statusLabel = station.status === 'available' ? 'Còn trống' : station.status === 'busy' ? 'Sắp đầy' : 'Ngoại tuyến';

  return (
    <article
      className={`station-card ${active ? 'active' : ''} ${compact ? 'compact' : ''}`}
      onClick={onClick}
      onKeyDown={event => {
        if ((event.key === 'Enter' || event.key === ' ') && onClick) {
          event.preventDefault();
          onClick();
        }
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {!compact && <img src={station.image} alt={`Trạm sạc ${station.name}`} className="station-card-image" />}
      <div className="station-card-body">
        <div className="station-card-heading">
          <div>
            <span className={`status-badge ${station.status}`}>{statusLabel}</span>
            <h3>{station.name}</h3>
          </div>
          {onSave && (
            <button className="icon-button subtle" type="button" aria-label="Lưu trạm sạc" onClick={event => { event.stopPropagation(); onSave(); }}>
              <Bookmark size={18} />
            </button>
          )}
        </div>
        <p className="station-address"><MapPin size={14} /> {station.address}</p>
        <div className="station-card-meta">
          <span><Gauge size={15} /> {formatPower(station)}</span>
          <span><Star size={15} fill="currentColor" /> {station.rating}</span>
          <span>{station.distanceKm.toFixed(1)} km</span>
          <span>{formatStationPrice(station)}</span>
        </div>
      </div>
      {compact && <ChevronRight className="station-card-chevron" size={19} />}
    </article>
  );
}
