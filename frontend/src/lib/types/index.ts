// Core type definitions for Route Builder

export interface Stop {
    id: string;
    address: string;
    latitude: number;
    longitude: number;
    sequence: number;
    name?: string;
    notes?: string;
    serviceTime?: number; // minutes
    timeWindowStart?: string; // HH:MM format
    timeWindowEnd?: string; // HH:MM format
    priority?: 'high' | 'medium' | 'low';
}

export interface StartLocation {
    address: string;
    latitude: number;
    longitude: number;
    name?: string;
}

export interface Route {
    id: string;
    name: string;
    stops: Stop[];
    status: 'draft' | 'optimized' | 'in_progress' | 'completed';
    totalDistance?: number; // meters
    totalDuration?: number; // seconds
    vehicleId?: string;
    driverId?: string;
    scheduledDate?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface OptimizationSettings {
    optimizationType: 'shortest_time' | 'shortest_distance' | 'balanced';
    roundTrip: boolean;
    lockLastDestination: boolean;
    avoidHighways: boolean;
    avoidTolls: boolean;
    maxStops?: number;
    maxDistance?: number; // km
    maxDuration?: number; // minutes
    defaultServiceTime?: number; // minutes per stop
}

export interface Vehicle {
    id: string;
    name: string;
    licensePlate?: string;
    type: 'car' | 'van' | 'truck' | 'motorcycle';
    capacityWeight?: number; // kg
    capacityVolume?: number; // cubic meters
    maxStops?: number;
    color?: string;
}

export interface Driver {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    vehicleId?: string;
    status: 'available' | 'on_route' | 'offline';
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'dispatcher' | 'driver';
}

export interface RouteStats {
    totalDistance: number; // km
    totalDuration: number; // minutes
    totalStops: number;
    avgStopDuration: number;
}
