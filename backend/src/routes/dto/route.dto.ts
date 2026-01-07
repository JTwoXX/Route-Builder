export class CreateRouteDto {
    name: string;
    stops: CreateStopDto[];
    vehicleId?: string;
    driverId?: string;
    scheduledDate?: string;
}

export class UpdateRouteDto {
    name?: string;
    stops?: CreateStopDto[];
    status?: 'draft' | 'optimized' | 'in_progress' | 'completed';
    vehicleId?: string;
    driverId?: string;
    scheduledDate?: string;
}

export class CreateStopDto {
    address: string;
    latitude: number;
    longitude: number;
    name?: string;
    notes?: string;
    serviceTime?: number;
    timeWindowStart?: string;
    timeWindowEnd?: string;
    priority?: 'high' | 'medium' | 'low';
}

export class OptimizeRouteDto {
    optimizationType?: 'shortest_time' | 'shortest_distance' | 'balanced';
    roundTrip?: boolean;
    lockLastDestination?: boolean;
}
