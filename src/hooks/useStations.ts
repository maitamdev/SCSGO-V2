import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { FALLBACK_STATIONS, type ChargingStation } from '../data/stations';

type PlaceRow = Record<string, unknown>;
const DEMO_FALLBACK_ENABLED = import.meta.env.VITE_ENABLE_DEMO_DATA !== 'false';

function normalizePlace(row: PlaceRow, index: number): ChargingStation {
  const placeId = String(row.place_id || row.id || '');
  const fallback = FALLBACK_STATIONS.find(station => station.id === placeId)
    || FALLBACK_STATIONS[index % FALLBACK_STATIONS.length];
  const serviceOptions = (row.service_options || {}) as Record<string, unknown>;
  const stationRows = Array.isArray(row.charging_stations)
    ? row.charging_stations as Array<Record<string, unknown>>
    : [];
  const liveStation = stationRows[0];
  const slots = Array.isArray(liveStation?.charging_slots)
    ? liveStation.charging_slots as Array<Record<string, unknown>>
    : [];
  const tariffs = Array.isArray(liveStation?.station_tariffs)
    ? liveStation.station_tariffs as Array<Record<string, unknown>>
    : [];
  const activeTariff = tariffs.find(item => item.active !== false);
  const availableSlots = slots.filter(slot => slot.status === 'available').length;
  const liveStatus = String(liveStation?.status || '');
  const amenities = Array.isArray(serviceOptions.amenities)
    ? serviceOptions.amenities.map(String)
    : fallback.amenities;
  return {
    ...fallback,
    id: placeId || fallback.id,
    name: String(row.title || fallback.name),
    address: String(row.address || fallback.address),
    district: String(serviceOptions.district || fallback.district),
    latitude: Number(row.latitude || fallback.latitude),
    longitude: Number(row.longitude || fallback.longitude),
    distanceKm: fallback.id === placeId ? fallback.distanceKm : Number(row.distance_km || fallback.distanceKm),
    rating: Number(row.rating || fallback.rating),
    reviewCount: Number(row.reviews || fallback.reviewCount),
    image: String(row.thumbnail || fallback.image),
    openHours: String(row.hours || row.open_state || fallback.openHours),
    description: String(row.description || fallback.description),
    powerKw: Number(serviceOptions.power_kw || fallback.powerKw),
    availableSlots: slots.length ? availableSlots : Number(serviceOptions.available_slots ?? fallback.availableSlots),
    totalSlots: Number(liveStation?.total_slots ?? serviceOptions.total_slots ?? fallback.totalSlots),
    pricePerKwh: Number(activeTariff?.price_per_kwh ?? serviceOptions.price_per_kwh ?? fallback.pricePerKwh),
    flatFee: activeTariff?.flat_fee == null
      ? (serviceOptions.flat_fee == null ? fallback.flatFee : Number(serviceOptions.flat_fee))
      : Number(activeTariff.flat_fee),
    pricingMode: activeTariff?.pricing_mode === 'flat' || activeTariff?.pricing_mode === 'per_kwh'
      ? activeTariff.pricing_mode
      : serviceOptions.pricing_mode === 'flat' || serviceOptions.pricing_mode === 'per_kwh'
        ? serviceOptions.pricing_mode
        : fallback.pricingMode,
    connector: String(serviceOptions.connector || fallback.connector),
    status: ['offline', 'maintenance', 'suspended'].includes(liveStatus)
      ? 'offline'
      : slots.length && availableSlots === 0
        ? 'busy'
        : 'available',
    amenities,
    phone: String(row.phone || fallback.phone || '') || undefined,
    vehicleType: serviceOptions.vehicle_type === 'motorbike' || serviceOptions.vehicle_type === 'car' || serviceOptions.vehicle_type === 'both'
      ? serviceOptions.vehicle_type
      : fallback.vehicleType,
    sourceLabel: String(serviceOptions.source_label || fallback.sourceLabel),
  };
}

export function useStations() {
  const [stations, setStations] = useState<ChargingStation[]>(DEMO_FALLBACK_ENABLED ? FALLBACK_STATIONS : []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const { data, error } = await supabase
          .from('places')
          .select('*,charging_stations(id,status,total_slots,last_heartbeat_at,charging_slots(id,status,connector_type,power_kw),station_tariffs(pricing_mode,price_per_kwh,flat_fee,reservation_fee,active))')
          .not('latitude', 'is', null)
          .not('longitude', 'is', null)
          .order('position', { ascending: true })
          .limit(50);

        if (!error && data?.length && active) {
          const remote = data.map(normalizePlace);
          setStations(remote);
        }
      } catch {
        if (active && DEMO_FALLBACK_ENABLED) setStations(FALLBACK_STATIONS);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  return { stations, isLoading };
}
