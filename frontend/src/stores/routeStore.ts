import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Stop, Route, OptimizationSettings, StartLocation } from '@/lib/types';
import { calculateOptimizedRoute, calculateRoute } from '@/lib/api/tomtom';

interface RouteState {
    // Current route being planned
    stops: Stop[];
    currentRoute: Route | null;
    startLocation: StartLocation | null;

    // Optimized route data from TomTom
    routeGeometry: [number, number][] | null;
    optimizedDistance: number | null; // miles
    optimizedDuration: number | null; // minutes (travel time only)

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
    setStartLocation: (location: StartLocation | null) => void;
    setOptimizationSettings: (settings: Partial<OptimizationSettings>) => void;
    optimizeRoute: () => Promise<void>;
    recalculateRoute: () => Promise<void>;
    saveRoute: (name: string) => void;
    loadRoute: (route: Route) => void;
    deleteRoute: (id: string) => void;
    updateRouteName: (id: string, name: string) => void;
    newRoute: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

export const useRouteStore = create<RouteState>()(
    persist(
        (set, get) => ({
            stops: [],
            currentRoute: null,
            startLocation: null,
            routeGeometry: null,
            optimizedDistance: null,
            optimizedDuration: null,
            routes: [],
            optimizationSettings: {
                optimizationType: 'shortest_time',
                roundTrip: true, // Default to round trip (return to start)
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
                set({ stops: [...stops, newStop], routeGeometry: null, optimizedDistance: null, optimizedDuration: null });
            },

            removeStop: (id) => {
                const stops = get().stops.filter(s => s.id !== id);
                const resequenced = stops.map((s, i) => ({ ...s, sequence: i + 1 }));
                set({ stops: resequenced, routeGeometry: null, optimizedDistance: null, optimizedDuration: null });
            },

            updateStop: (id, updates) => {
                const stops = get().stops.map(s =>
                    s.id === id ? { ...s, ...updates } : s
                );
                set({ stops });
            },

            reorderStops: (stops) => {
                const resequenced = stops.map((s, i) => ({ ...s, sequence: i + 1 }));
                set({ stops: resequenced, routeGeometry: null, optimizedDistance: null, optimizedDuration: null });
            },

            clearStops: () => {
                set({ stops: [], currentRoute: null, selectedStopId: null, routeGeometry: null, optimizedDistance: null, optimizedDuration: null });
            },

            selectStop: (id) => {
                set({ selectedStopId: id });
            },

            setStartLocation: (location) => {
                set({ startLocation: location, routeGeometry: null, optimizedDistance: null, optimizedDuration: null });
            },

            setOptimizationSettings: (settings) => {
                set({
                    optimizationSettings: { ...get().optimizationSettings, ...settings }
                });
            },

            optimizeRoute: async () => {
                const { stops, startLocation, optimizationSettings } = get();

                if (!startLocation) {
                    alert('Please set a start location before optimizing the route.');
                    return;
                }

                if (stops.length < 1) {
                    return;
                }

                set({ isOptimizing: true });

                try {
                    // Use TomTom API to calculate optimized route
                    const result = await calculateOptimizedRoute(
                        { latitude: startLocation.latitude, longitude: startLocation.longitude },
                        stops.map(s => ({ latitude: s.latitude, longitude: s.longitude })),
                        {
                            avoidHighways: optimizationSettings.avoidHighways,
                            avoidTolls: optimizationSettings.avoidTolls,
                            computeBestOrder: true,
                            roundTrip: optimizationSettings.roundTrip,
                        }
                    );

                    if (result) {
                        // Reorder stops based on optimized order
                        const reorderedStops = result.optimizedOrder.map((originalIndex, newIndex) => ({
                            ...stops[originalIndex],
                            sequence: newIndex + 1,
                        }));

                        set({
                            stops: reorderedStops,
                            routeGeometry: result.routeGeometry,
                            optimizedDistance: result.totalDistanceMiles,
                            optimizedDuration: result.totalDurationMinutes,
                            isOptimizing: false,
                        });
                    } else {
                        // Fallback to simple nearest-neighbor if API fails
                        console.warn('TomTom optimization failed, using fallback algorithm');
                        const optimized: Stop[] = [];
                        const remaining = [...stops];

                        let current = remaining.shift()!;
                        optimized.push({ ...current, sequence: 1 });

                        while (remaining.length > 0) {
                            let nearestIdx = 0;
                            let nearestDist = Infinity;

                            for (let i = 0; i < remaining.length; i++) {
                                const dist = Math.sqrt(
                                    Math.pow(remaining[i].latitude - current.latitude, 2) +
                                    Math.pow(remaining[i].longitude - current.longitude, 2)
                                );
                                if (dist < nearestDist) {
                                    nearestDist = dist;
                                    nearestIdx = i;
                                }
                            }

                            current = remaining.splice(nearestIdx, 1)[0];
                            optimized.push({ ...current, sequence: optimized.length + 1 });
                        }

                        set({ stops: optimized, isOptimizing: false });
                    }
                } catch (error) {
                    console.error('Route optimization error:', error);
                    set({ isOptimizing: false });
                }
            },

            recalculateRoute: async () => {
                const { stops, startLocation, optimizationSettings } = get();

                if (!startLocation || stops.length < 1) {
                    set({ routeGeometry: null, optimizedDistance: null, optimizedDuration: null });
                    return;
                }

                try {
                    // Calculate route without reordering (just get geometry and times)
                    const waypoints = [
                        { latitude: startLocation.latitude, longitude: startLocation.longitude },
                        ...stops.map(s => ({ latitude: s.latitude, longitude: s.longitude })),
                    ];

                    const result = await calculateRoute(waypoints, {
                        avoidHighways: optimizationSettings.avoidHighways,
                        avoidTolls: optimizationSettings.avoidTolls,
                    });

                    if (result) {
                        set({
                            routeGeometry: result.geometry,
                            optimizedDistance: result.distanceMiles,
                            optimizedDuration: result.durationMinutes,
                        });
                    }
                } catch (error) {
                    console.error('Route calculation error:', error);
                }
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
                set({ stops: [], currentRoute: null, selectedStopId: null, routeGeometry: null, optimizedDistance: null, optimizedDuration: null });
            },
        }),
        {
            name: 'route-builder-storage',
            partialize: (state) => ({
                routes: state.routes,
                optimizationSettings: state.optimizationSettings,
                startLocation: state.startLocation,
            }),
        }
    )
);
