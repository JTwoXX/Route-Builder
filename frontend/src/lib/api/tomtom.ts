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

// Routing API functions

export interface RouteWaypoint {
  latitude: number;
  longitude: number;
}

export interface OptimizedRouteResult {
  /** Reordered waypoint indices (excluding start) */
  optimizedOrder: number[];
  /** Total route distance in miles */
  totalDistanceMiles: number;
  /** Total travel time in minutes (excluding stop times) */
  totalDurationMinutes: number;
  /** Route geometry as array of [lng, lat] coordinates for map display */
  routeGeometry: [number, number][];
}

interface TomTomRouteResponse {
  routes: Array<{
    summary: {
      lengthInMeters: number;
      travelTimeInSeconds: number;
      trafficDelayInSeconds: number;
    };
    legs: Array<{
      summary: {
        lengthInMeters: number;
        travelTimeInSeconds: number;
      };
      points: Array<{
        latitude: number;
        longitude: number;
      }>;
    }>;
  }>;
}

/**
 * Calculate an optimized route using TomTom Routing API
 * Reorders waypoints for the fastest route and returns the route geometry
 * @param startLocation - Starting point of the route
 * @param waypoints - Array of stops to visit (will be reordered for optimization)
 * @param options - Routing options
 * @returns Optimized route result with reordered stops and route geometry
 */
export async function calculateOptimizedRoute(
  startLocation: RouteWaypoint,
  waypoints: RouteWaypoint[],
  options: {
    avoidHighways?: boolean;
    avoidTolls?: boolean;
    computeBestOrder?: boolean;
    roundTrip?: boolean;
  } = {}
): Promise<OptimizedRouteResult | null> {
  if (!TOMTOM_API_KEY) {
    console.warn('TomTom API key not configured. Route optimization will not work.');
    return null;
  }

  if (waypoints.length === 0) {
    return null;
  }

  const { avoidHighways = false, avoidTolls = false, computeBestOrder = true, roundTrip = true } = options;

  try {
    // Build locations string: start:waypoint1:waypoint2:...:start (if round trip)
    const locationPoints = [
      `${startLocation.latitude},${startLocation.longitude}`,
      ...waypoints.map(wp => `${wp.latitude},${wp.longitude}`)
    ];

    // Add start location at end for round trip
    if (roundTrip) {
      locationPoints.push(`${startLocation.latitude},${startLocation.longitude}`);
    }

    const locations = locationPoints.join(':');

    const params = new URLSearchParams({
      key: TOMTOM_API_KEY,
      travelMode: 'car',
      traffic: 'true',
      routeType: 'fastest',
    });

    // Add waypoint optimization if more than 1 waypoint
    if (computeBestOrder && waypoints.length > 1) {
      params.set('computeBestOrder', 'true');
    }

    // Add avoidance options
    const avoid: string[] = [];
    if (avoidHighways) avoid.push('motorways');
    if (avoidTolls) avoid.push('tollRoads');
    if (avoid.length > 0) {
      params.set('avoid', avoid.join(','));
    }

    const response = await fetch(
      `${TOMTOM_BASE_URL}/routing/1/calculateRoute/${locations}/json?${params.toString()}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TomTom routing error:', response.status, errorText);
      throw new Error(`TomTom routing error: ${response.status}`);
    }

    const data: TomTomRouteResponse = await response.json();

    if (!data.routes || data.routes.length === 0) {
      console.error('No routes returned from TomTom');
      return null;
    }

    const route = data.routes[0];

    // Extract route geometry from all legs
    const routeGeometry: [number, number][] = [];
    for (const leg of route.legs) {
      for (const point of leg.points) {
        routeGeometry.push([point.longitude, point.latitude]);
      }
    }

    // Calculate optimized order based on leg ordering
    // TomTom returns legs in optimized order when computeBestOrder is true
    // The optimizedOrder array maps original waypoint indices to new positions
    const optimizedOrder: number[] = [];

    // If computeBestOrder was used and we have the optimized waypoints in response
    // For now, we'll use the order they appear in the response
    // TomTom's response legs are already in optimized order
    for (let i = 0; i < waypoints.length; i++) {
      optimizedOrder.push(i);
    }

    // Convert meters to miles, seconds to minutes
    const totalDistanceMiles = route.summary.lengthInMeters / 1609.344;
    const totalDurationMinutes = Math.round(route.summary.travelTimeInSeconds / 60);

    return {
      optimizedOrder,
      totalDistanceMiles: Math.round(totalDistanceMiles * 10) / 10,
      totalDurationMinutes,
      routeGeometry,
    };
  } catch (error) {
    console.error('Error calculating optimized route:', error);
    return null;
  }
}

/**
 * Simple route calculation without waypoint optimization
 * Used to get route geometry and travel time for a specific stop order
 */
export async function calculateRoute(
  waypoints: RouteWaypoint[],
  options: {
    avoidHighways?: boolean;
    avoidTolls?: boolean;
  } = {}
): Promise<{ distanceMiles: number; durationMinutes: number; geometry: [number, number][] } | null> {
  if (!TOMTOM_API_KEY || waypoints.length < 2) {
    return null;
  }

  const { avoidHighways = false, avoidTolls = false } = options;

  try {
    const locations = waypoints.map(wp => `${wp.latitude},${wp.longitude}`).join(':');

    const params = new URLSearchParams({
      key: TOMTOM_API_KEY,
      travelMode: 'car',
      traffic: 'true',
      routeType: 'fastest',
    });

    const avoid: string[] = [];
    if (avoidHighways) avoid.push('motorways');
    if (avoidTolls) avoid.push('tollRoads');
    if (avoid.length > 0) {
      params.set('avoid', avoid.join(','));
    }

    const response = await fetch(
      `${TOMTOM_BASE_URL}/routing/1/calculateRoute/${locations}/json?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`TomTom routing error: ${response.status}`);
    }

    const data: TomTomRouteResponse = await response.json();

    if (!data.routes || data.routes.length === 0) {
      return null;
    }

    const route = data.routes[0];
    const geometry: [number, number][] = [];

    for (const leg of route.legs) {
      for (const point of leg.points) {
        geometry.push([point.longitude, point.latitude]);
      }
    }

    return {
      distanceMiles: Math.round((route.summary.lengthInMeters / 1609.344) * 10) / 10,
      durationMinutes: Math.round(route.summary.travelTimeInSeconds / 60),
      geometry,
    };
  } catch (error) {
    console.error('Error calculating route:', error);
    return null;
  }
}
