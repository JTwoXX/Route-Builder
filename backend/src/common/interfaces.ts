export interface Stop {
    id: string;
    address: string;
    latitude: number;
    longitude: number;
    sequence: number;
    name?: string;
    notes?: string;
    serviceTime?: number;
    timeWindowStart?: string;
    timeWindowEnd?: string;
    priority?: 'high' | 'medium' | 'low';
}

export interface Route {
    id: string;
    name: string;
    stops: Stop[];
    status: 'draft' | 'optimized' | 'in_progress' | 'completed';
    totalDistance?: number;
    totalDuration?: number;
    vehicleId?: string;
    driverId?: string;
    scheduledDate?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Vehicle {
    id: string;
    name: string;
    licensePlate?: string;
    type: 'car' | 'van' | 'truck' | 'motorcycle';
    capacityWeight?: number;
    capacityVolume?: number;
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
