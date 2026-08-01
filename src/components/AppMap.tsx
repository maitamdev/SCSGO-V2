import { useEffect, useRef } from 'react';
import maplibregl, { type Map as MapLibreMap, type Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { formatPower, type ChargingStation } from '../data/stations';

interface AppMapProps {
  stations: ChargingStation[];
  selectedId?: string;
  onSelect?: (station: ChargingStation) => void;
  onOpenDetails?: (station: ChargingStation) => void;
  userLocation?: { latitude: number; longitude: number } | null;
  activeRoute?: { coordinates: [number, number][] } | null;
  compact?: boolean;
}

interface StationMarker {
  marker: Marker;
  element: HTMLButtonElement;
  stationId: string;
}

const mapStyle: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: [import.meta.env.VITE_MAP_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: import.meta.env.VITE_MAP_ATTRIBUTION || '© OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

export default function AppMap({ stations, selectedId, onSelect, onOpenDetails, userLocation, activeRoute, compact = false }: AppMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<StationMarker[]>([]);
  const userMarkerRef = useRef<Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: mapStyle,
      center: [106.7108, 10.7852],
      zoom: compact ? 12.6 : 12.9,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');
    mapRef.current = map;

    const observer = new ResizeObserver(() => map.resize());
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current = [];
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [compact]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach(({ marker }) => marker.remove());
    markersRef.current = stations.map(station => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `map-station-marker ${station.status}`;
      button.setAttribute('aria-label', `Chọn ${station.name}`);
      const markerLabel = document.createElement('span');
      markerLabel.textContent = station.vehicleType === 'motorbike' ? 'M' : station.vehicleType === 'car' ? 'O' : 'Đ';
      button.append(markerLabel);
      button.addEventListener('click', () => onSelect?.(station));

      const popupNode = document.createElement('div');
      popupNode.className = 'map-popup-content';
      const name = document.createElement('strong');
      name.textContent = station.name;
      const meta = document.createElement('span');
      meta.textContent = `${formatPower(station)} • ${station.availableSlots}/${station.totalSlots} cổng trống`;
      popupNode.append(name, meta);

      if (onOpenDetails) {
        const detailButton = document.createElement('button');
        detailButton.type = 'button';
        detailButton.className = 'map-popup-action';
        detailButton.textContent = 'Xem chi tiết trạm';
        detailButton.addEventListener('click', event => {
          event.stopPropagation();
          onOpenDetails(station);
        });
        popupNode.append(detailButton);
      }

      const marker = new maplibregl.Marker({ element: button, anchor: 'bottom' })
        .setLngLat([station.longitude, station.latitude])
        .setPopup(new maplibregl.Popup({ offset: 22, closeButton: false }).setDOMContent(popupNode))
        .addTo(map);

      return { marker, element: button, stationId: station.id };
    });
  }, [stations, onSelect, onOpenDetails]);

  useEffect(() => {
    markersRef.current.forEach(({ element, stationId }) => {
      element.classList.toggle('selected', stationId === selectedId);
    });
  }, [selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    userMarkerRef.current?.remove();
    userMarkerRef.current = null;
    if (!map || !userLocation) return;

    const marker = document.createElement('div');
    marker.className = 'map-user-marker';
    marker.setAttribute('aria-label', 'Vị trí của bạn');
    marker.title = 'Vị trí của bạn';
    userMarkerRef.current = new maplibregl.Marker({ element: marker })
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .setPopup(new maplibregl.Popup({ offset: 15, closeButton: false }).setText('Vị trí hiện tại của bạn'))
      .addTo(map);
  }, [userLocation]);

  useEffect(() => {
    const station = stations.find(item => item.id === selectedId);
    if (station && mapRef.current) {
      mapRef.current.easeTo({ center: [station.longitude, station.latitude], zoom: 14.2, duration: 650 });
    } else if (stations.length && mapRef.current) {
      const bounds = stations.reduce(
        (current, item) => current.extend([item.longitude, item.latitude]),
        new maplibregl.LngLatBounds([stations[0].longitude, stations[0].latitude], [stations[0].longitude, stations[0].latitude]),
      );
      mapRef.current.fitBounds(bounds, { padding: compact ? 42 : 68, maxZoom: compact ? 12.8 : 13.4, duration: 500 });
    }
  }, [selectedId, stations, compact]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const drawRoute = () => {
      const existingSource = map.getSource('active-route') as maplibregl.GeoJSONSource | undefined;
      if (!activeRoute?.coordinates.length) {
        existingSource?.setData({ type: 'FeatureCollection', features: [] });
        return;
      }
      const routeData = {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'LineString' as const,
          coordinates: activeRoute.coordinates,
        },
      };
      if (existingSource) {
        existingSource.setData(routeData);
      } else {
        map.addSource('active-route', { type: 'geojson', data: routeData });
        map.addLayer({
          id: 'active-route-shadow',
          type: 'line',
          source: 'active-route',
          paint: { 'line-color': '#ffffff', 'line-width': 9, 'line-opacity': .92 },
          layout: { 'line-cap': 'round', 'line-join': 'round' },
        });
        map.addLayer({
          id: 'active-route-line',
          type: 'line',
          source: 'active-route',
          paint: { 'line-color': '#155eef', 'line-width': 5, 'line-opacity': .95 },
          layout: { 'line-cap': 'round', 'line-join': 'round' },
        });
      }

      const bounds = activeRoute.coordinates.reduce(
        (current, coordinate) => current.extend(coordinate),
        new maplibregl.LngLatBounds(activeRoute.coordinates[0], activeRoute.coordinates[0]),
      );
      map.fitBounds(bounds, { padding: compact ? 48 : 86, maxZoom: 15.5, duration: 700 });
    };

    if (map.isStyleLoaded()) drawRoute();
    else map.once('load', drawRoute);
    return () => { map.off('load', drawRoute); };
  }, [activeRoute, compact]);

  return <div ref={containerRef} className="app-map" aria-label="Bản đồ trạm sạc" />;
}
