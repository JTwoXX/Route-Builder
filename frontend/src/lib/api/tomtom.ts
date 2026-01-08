// TomTom API Service for Geocoding, Search, and Traffic
// Documentation: https://developer.tomtom.com/

const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY || '';
const TOMTOM_BASE_URL = 'https://api.tomtom.com';

export interface SearchResult {
  id: string;
  address: string;
  position: {
    lat: number;
    lon: number;
  };
  poi?: {
    name: string;
  };
  type: string;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface TomTomSearchResponse {
  results: Array<{
    id: string;
    type: string;
    address: {
      freeformAddress: string;
      streetName?: string;
      streetNumber?: string;
      municipality?: string;
      countrySubdivision?: string;
      country?: string;
      postalCode?: string;
    };
    position: {
      lat: number;
      lon: number;
    };
    poi?: {
      name: string;
      categories?: string[];
    };
  }>;
}

/**
 * Search for addresses and POIs using TomTom Search API
 * @param query - The search query string
 * @param options - Optional parameters for the search
 * @returns Array of search suggestions
 */
export async function searchAddress(
  query: string,
  options: {
    limit?: number;
    countrySet?: string;
    lat?: number;
    lon?: number;
    radius?: number;
  } = {}
): Promise<SearchSuggestion[]> {
  if (!TOMTOM_API_KEY) {
    console.warn('TomTom API key not configured. Address search will not work.');
    return [];
  }

  if (!query || query.trim().length < 2) {
    return [];
  }

  const { limit = 5, countrySet = 'US', lat, lon, radius = 50000 } = options;

  try {
    const params = new URLSearchParams({
      key: TOMTOM_API_KEY,
      query: query.trim(),
      limit: String(limit),
      typeahead: 'true',
      language: 'en-US',
    });

    if (countrySet) {
      params.set('countrySet', countrySet);
    }

    // If we have coordinates, bias results to that location
    if (lat !== undefined && lon !== undefined) {
      params.set('lat', String(lat));
      params.set('lon', String(lon));
      params.set('radius', String(radius));
    }

    const response = await fetch(
      `${TOMTOM_BASE_URL}/search/2/search/${encodeURIComponent(query)}.json?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`TomTom API error: ${response.status}`);
    }

    const data: TomTomSearchResponse = await response.json();

    return data.results.map((result) => ({
      id: result.id,
      text: result.poi?.name || result.address.freeformAddress,
      address: result.address.freeformAddress,
      latitude: result.position.lat,
      longitude: result.position.lon,
    }));
  } catch (error) {
    console.error('Error searching address:', error);
    return [];
  }
}

/**
 * Geocode a single address to get coordinates
 * @param address - The address string to geocode
 * @returns Coordinates or null if not found
 */
export async function geocodeAddress(
  address: string
): Promise<{ latitude: number; longitude: number; formattedAddress: string } | null> {
  if (!TOMTOM_API_KEY) {
    console.warn('TomTom API key not configured. Geocoding will not work.');
    return null;
  }

  try {
    const params = new URLSearchParams({
      key: TOMTOM_API_KEY,
      limit: '1',
    });

    const response = await fetch(
      `${TOMTOM_BASE_URL}/search/2/geocode/${encodeURIComponent(address)}.json?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`TomTom geocode error: ${response.status}`);
    }

    const data: TomTomSearchResponse = await response.json();

    if (data.results.length === 0) {
      return null;
    }

    const result = data.results[0];
    return {
      latitude: result.position.lat,
      longitude: result.position.lon,
      formattedAddress: result.address.freeformAddress,
    };
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

/**
 * Reverse geocode coordinates to get an address
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns Address string or null
 */
export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<string | null> {
  if (!TOMTOM_API_KEY) {
    console.warn('TomTom API key not configured. Reverse geocoding will not work.');
    return null;
  }

  try {
    const params = new URLSearchParams({
      key: TOMTOM_API_KEY,
    });

    const response = await fetch(
      `${TOMTOM_BASE_URL}/search/2/reverseGeocode/${lat},${lon}.json?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`TomTom reverse geocode error: ${response.status}`);
    }

    const data = await response.json();

    if (data.addresses && data.addresses.length > 0) {
      return data.addresses[0].address.freeformAddress;
    }

    return null;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}

// Traffic API functions

export interface TrafficFlowData {
  frc: string; // Functional Road Class
  currentSpeed: number;
  freeFlowSpeed: number;
  confidence: number;
  roadClosure: boolean;
}

export interface TrafficIncident {
  id: string;
  type: string;
  severity: number;
  description: string;
  delay: number;
  from: { lat: number; lon: number };
  to: { lat: number; lon: number };
}

/**
 * Get TomTom Traffic Flow Tile URL for MapLibre
 * @returns URL template for traffic flow tiles
 */
export function getTrafficFlowTileUrl(): string {
  if (!TOMTOM_API_KEY) {
    console.warn('TomTom API key not configured. Traffic flow will not be available.');
    return '';
  }

  // TomTom Traffic Flow Tiles - relative style
  return `https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?key=${TOMTOM_API_KEY}&tileSize=256`;
}

/**
 * Get TomTom Traffic Incidents Tile URL for MapLibre
 * @returns URL template for traffic incident tiles
 */
export function getTrafficIncidentsTileUrl(): string {
  if (!TOMTOM_API_KEY) {
    console.warn('TomTom API key not configured. Traffic incidents will not be available.');
    return '';
  }

  // TomTom Traffic Incidents Tiles
  return `https://api.tomtom.com/traffic/map/4/tile/incidents/s3/{z}/{x}/{y}.png?key=${TOMTOM_API_KEY}&tileSize=256`;
}

/**
 * Check if TomTom API key is configured
 */
export function isTomTomConfigured(): boolean {
  return Boolean(TOMTOM_API_KEY);
}
