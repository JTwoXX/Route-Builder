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
                if (stops.length <= 2) {
                    set({ isOptimizing: false });
                    return;
                }

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
