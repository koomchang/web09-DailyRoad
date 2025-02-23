import { StateCreator } from 'zustand';

import { INITIAL_MAP_CONFIG } from '@/constants/map';
import { StoreState } from '@/types';
import {
  getGoogleMapClass,
  loadGoogleMapsApi,
} from '@/lib/googleMapsAPI-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import {
  clustererOptions,
  CustomMarkerClusterer,
} from '@/lib/CustomMarkerClusterer';
import { CustomSuperClusterAlgorithm } from '@/lib/CustomSuperCluseterAlgorithm';

export type GoogleMapState = {
  googleMap: google.maps.Map | null;
  markerClusterer: MarkerClusterer | null;

  setGoogleMap: (map: google.maps.Map) => void;
  initializeMap: (container: HTMLElement) => void;
  moveTo: (lat: number, lng: number) => void;
  addMarker: (marker: google.maps.marker.AdvancedMarkerElement) => void;

  removeMarker: (marker: google.maps.marker.AdvancedMarkerElement) => void;
};

export const createGoogleMapSlice: StateCreator<
  StoreState,
  [],
  [],
  GoogleMapState
> = (set, get) => ({
  googleMap: null,
  markerClusterer: null,
  setGoogleMap: (map: google.maps.Map) => set({ googleMap: map }),

  initializeMap: async (container: HTMLElement) => {
    await loadGoogleMapsApi();
    const GoogleMap = getGoogleMapClass();
    const map = new GoogleMap(container, INITIAL_MAP_CONFIG);

    const { ...options } = clustererOptions;
    const markerClusterer = new CustomMarkerClusterer({
      map,
      ...options,
      algorithm: new CustomSuperClusterAlgorithm({ maxZoom: 18 }),
    });
    set({ googleMap: map, markerClusterer });
  },

  moveTo: (lat: number, lng: number) => {
    const map = get().googleMap;
    const currentZoom = map?.getZoom() as number;
    if (map) {
      map.panTo({ lat, lng });
      map.setZoom(currentZoom > 17 ? currentZoom : 17);
    }
  },

  addMarker: (marker: google.maps.marker.AdvancedMarkerElement) => {
    const { markerClusterer } = get();
    markerClusterer?.addMarker(marker);
  },

  removeMarker: (marker: google.maps.marker.AdvancedMarkerElement) => {
    const { markerClusterer } = get();
    markerClusterer?.removeMarker(marker);
  },
});
