import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Stop, Route, OptimizationSettings } from '@/lib/types';

interface RouteState {
    // Current route being planned
    stops: Stop[];
    currentRoute: Route | null;

    // Saved routes (persisted to localStorage)
    routes: Route[];

    // Settings
    optimizationSettings: OptimizationSettings;

    // UI state
    selectedStopId: string | null;
    isOptimizing: boolean;

    // Actions
    addStop: (stop: Omit<Stop, 'id' | 'sequence'>) => void;
    removeStop: (id: string) => void;
    updateStop: (id: string, updates: Partial<Stop>) => void;
    reorderStops: (stops: Stop[]) => void;
    clearStops: () => void;
    selectStop: (id: string | null) => void;
    setOptimizationSettings: (settings: Partial<OptimizationSettings>) => void;
    optimizeRoute: () => void;
    saveRoute: (name: string) => void;
    loadRoute: (route: Route) => void;
    deleteRoute: (id: string) => void;
    updateRouteName: (id: string, name: string) => void;
    newRoute: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Find the optimal starting point (the stop closest to the centroid or edge)
 */
function findBestStartingPoint(stops: Stop[]): number {
    if (stops.length <= 1) return 0;

    // Calculate centroid
    const centroid = {
        lat: stops.reduce((sum, s) => sum + s.latitude, 0) / stops.length,
        lon: stops.reduce((sum, s) => sum + s.longitude, 0) / stops.length,
    };

    // Find the stop furthest from centroid (edge of cluster) as starting point
    // This often produces better routes than starting from center
    let maxDist = -1;
    let bestIdx = 0;

    for (let i = 0; i < stops.length; i++) {
        const dist = haversineDistance(
            stops[i].latitude, stops[i].longitude,
            centroid.lat, centroid.lon
        );
        if (dist > maxDist) {
            maxDist = dist;
            bestIdx = i;
        }
    }

    return bestIdx;
}

/**
 * Improved nearest neighbor algorithm with better starting point
 */
function nearestNeighborOptimization(stops: Stop[]): Stop[] {
    if (stops.length <= 2) return stops;

    const remaining = [...stops];
    const optimized: Stop[] = [];

    // Start from the best starting point (edge of cluster)
    const startIdx = findBestStartingPoint(remaining);
    let current = remaining.splice(startIdx, 1)[0];
    optimized.push(current);

    while (remaining.length > 0) {
        let nearestIdx = 0;
        let nearestDist = Infinity;

        for (let i = 0; i < remaining.length; i++) {
            const dist = haversineDistance(
                current.latitude, current.longitude,
                remaining[i].latitude, remaining[i].longitude
            );
            if (dist < nearestDist) {
                nearestDist = dist;
                nearestIdx = i;
            }
        }

        current = remaining.splice(nearestIdx, 1)[0];
        optimized.push(current);
    }

    return optimized;
}

/**
 * 2-opt improvement: reverse segments to reduce crossings and backtracking
 */
function twoOptImprovement(stops: Stop[]): Stop[] {
    if (stops.length <= 3) return stops;

    let improved = [...stops];
    let betterFound = true;
    let iterations = 0;
    const maxIterations = 100; // Prevent infinite loops

    while (betterFound && iterations < maxIterations) {
        betterFound = false;
        iterations++;

        for (let i = 0; i < improved.length - 2; i++) {
            for (let j = i + 2; j < improved.length; j++) {
                // Calculate current distance for edges (i, i+1) and (j, j+1 or end)
                const currentDist =
                    haversineDistance(
                        improved[i].latitude, improved[i].longitude,
                        improved[i + 1].latitude, improved[i + 1].longitude
                    ) +
                    (j + 1 < improved.length
                        ? haversineDistance(
                            improved[j].latitude, improved[j].longitude,
                            improved[j + 1].latitude, improved[j + 1].longitude
                        )
                        : 0
                    );

                // Calculate new distance if we reverse the segment between i+1 and j
                const newDist =
                    haversineDistance(
                        improved[i].latitude, improved[i].longitude,
                        improved[j].latitude, improved[j].longitude
                    ) +
                    (j + 1 < improved.length
                        ? haversineDistance(
                            improved[i + 1].latitude, improved[i + 1].longitude,
                            improved[j + 1].latitude, improved[j + 1].longitude
                        )
                        : 0
                    );

                // If reversing improves the route, do it
                if (newDist < currentDist - 0.001) { // Small threshold to avoid floating point issues
                    // Reverse the segment from i+1 to j
                    const newRoute = [
                        ...improved.slice(0, i + 1),
                        ...improved.slice(i + 1, j + 1).reverse(),
                        ...improved.slice(j + 1)
                    ];
                    improved = newRoute;
                    betterFound = true;
                    break;
                }
            }
            if (betterFound) break;
        }
    }

    return improved;
}

/**
 * Group nearby stops (within ~50 meters) together
 * This ensures stops at the same address are visited consecutively
 */
function groupNearbyStops(stops: Stop[]): Stop[] {
    if (stops.length <= 2) return stops;

    const PROXIMITY_THRESHOLD = 0.05; // ~50 meters in km
    const grouped: Stop[] = [];
    const used = new Set<number>();

    for (let i = 0; i < stops.length; i++) {
        if (used.has(i)) continue;

        // Add this stop
        grouped.push(stops[i]);
        used.add(i);

        // Find all nearby stops and add them immediately after
        for (let j = i + 1; j < stops.length; j++) {
            if (used.has(j)) continue;

            const dist = haversineDistance(
                stops[i].latitude, stops[i].longitude,
                stops[j].latitude, stops[j].longitude
            );

            if (dist < PROXIMITY_THRESHOLD) {
                grouped.push(stops[j]);
                used.add(j);
            }
        }
    }

    return grouped;
}

/**
 * Main optimization function combining multiple strategies
 */
function optimizeStops(stops: Stop[]): Stop[] {
    if (stops.length <= 2) return stops;

    // Step 1: Group nearby/same-address stops
    const grouped = groupNearbyStops(stops);

    // Step 2: Apply nearest neighbor algorithm with smart starting point
    const nnOptimized = nearestNeighborOptimization(grouped);

    // Step 3: Apply 2-opt improvement to reduce backtracking
    const twoOptOptimized = twoOptImprovement(nnOptimized);

    // Re-sequence the stops
    return twoOptOptimized.map((stop, index) => ({
        ...stop,
        sequence: index + 1
    }));
}

export const useRouteStore = create<RouteState>()(
    persist(
        (set, get) => ({
            stops: [],
            currentRoute: null,
            routes: [],
            optimizationSettings: {
                optimizationType: 'shortest_time',
                roundTrip: false,
                lockLastDestination: false,
                avoidHighways: false,
                avoidTolls: false,
                defaultServiceTime: 5,
            },
            selectedStopId: null,
            isOptimizing: false,

            addStop: (stopData) => {
                const stops = get().stops;
                const settings = get().optimizationSettings;
                const newStop: Stop = {
                    ...stopData,
                    id: generateId(),
                    sequence: stops.length + 1,
                    serviceTime: stopData.serviceTime ?? settings.defaultServiceTime,
                };
                set({ stops: [...stops, newStop] });
            },

            removeStop: (id) => {
                const stops = get().stops.filter(s => s.id !== id);
                const resequenced = stops.map((s, i) => ({ ...s, sequence: i + 1 }));
                set({ stops: resequenced });
            },

            updateStop: (id, updates) => {
                const stops = get().stops.map(s =>
                    s.id === id ? { ...s, ...updates } : s
                );
                set({ stops });
            },

            reorderStops: (stops) => {
                const resequenced = stops.map((s, i) => ({ ...s, sequence: i + 1 }));
                set({ stops: resequenced });
            },

            clearStops: () => {
                set({ stops: [], currentRoute: null, selectedStopId: null });
            },

            selectStop: (id) => {
                set({ selectedStopId: id });
            },

            setOptimizationSettings: (settings) => {
                set({
                    optimizationSettings: { ...get().optimizationSettings, ...settings }
                });
            },

            optimizeRoute: () => {
                set({ isOptimizing: true });

                const stops = get().stops;
                const settings = get().optimizationSettings;

                if (stops.length <= 2) {
                    set({ isOptimizing: false });
                    return;
                }

                // Run optimization
                let optimized = optimizeStops(stops);

                // Handle round trip - if enabled, the route should end near the start
                if (settings.roundTrip && optimized.length > 2) {
                    // Already optimized, round trip display is handled in the UI
                }

                // Handle lock last destination - keep the last stop in place
                if (settings.lockLastDestination && stops.length > 1) {
                    const originalLast = stops[stops.length - 1];
                    // Remove the original last stop from optimized
                    optimized = optimized.filter(s => s.id !== originalLast.id);
                    // Add it back at the end
                    optimized.push({ ...originalLast, sequence: optimized.length + 1 });
                }

                set({ stops: optimized, isOptimizing: false });
            },

            saveRoute: (name) => {
                const stops = get().stops;
                const routes = get().routes;
                const currentRoute = get().currentRoute;

                // If editing existing route, update it
                if (currentRoute) {
                    const updatedRoutes = routes.map(r =>
                        r.id === currentRoute.id
                            ? { ...r, name, stops: [...stops], updatedAt: new Date() }
                            : r
                    );
                    set({ routes: updatedRoutes, currentRoute: { ...currentRoute, name, stops: [...stops] } });
                } else {
                    // Create new route
                    const newRoute: Route = {
                        id: generateId(),
                        name,
                        stops: [...stops],
                        status: 'draft',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                    set({ routes: [...routes, newRoute], currentRoute: newRoute });
                }
            },

            loadRoute: (route) => {
                set({
                    stops: [...route.stops],
                    currentRoute: route,
                    selectedStopId: null,
                });
            },

            deleteRoute: (id) => {
                const routes = get().routes.filter(r => r.id !== id);
                const currentRoute = get().currentRoute;
                set({
                    routes,
                    currentRoute: currentRoute?.id === id ? null : currentRoute,
                });
            },

            updateRouteName: (id, name) => {
                const routes = get().routes.map(r =>
                    r.id === id ? { ...r, name, updatedAt: new Date() } : r
                );
                set({ routes });
            },

            newRoute: () => {
                set({ stops: [], currentRoute: null, selectedStopId: null });
            },
        }),
        {
            name: 'route-builder-storage',
            partialize: (state) => ({
                routes: state.routes,
                optimizationSettings: state.optimizationSettings,
            }),
        }
    )
);
