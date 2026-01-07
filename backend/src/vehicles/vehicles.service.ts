import { Injectable } from '@nestjs/common';
import { Vehicle } from '../common/interfaces';

@Injectable()
export class VehiclesService {
    private vehicles: Vehicle[] = [
        { id: 'v1', name: 'Delivery Van 1', type: 'van', capacityWeight: 1000, color: '#3b82f6' },
        { id: 'v2', name: 'Truck A', type: 'truck', capacityWeight: 5000, color: '#10b981' },
        { id: 'v3', name: 'Compact Car', type: 'car', capacityWeight: 200, color: '#f59e0b' },
    ];

    private generateId(): string {
        return Math.random().toString(36).substring(2, 11);
    }

    findAll(): Vehicle[] {
        return this.vehicles;
    }

    findOne(id: string): Vehicle | undefined {
        return this.vehicles.find((v) => v.id === id);
    }

    create(data: Partial<Vehicle>): Vehicle {
        const vehicle: Vehicle = {
            id: this.generateId(),
            name: data.name || 'New Vehicle',
            type: data.type || 'car',
            licensePlate: data.licensePlate,
            capacityWeight: data.capacityWeight,
            capacityVolume: data.capacityVolume,
            maxStops: data.maxStops,
            color: data.color || '#3b82f6',
        };
        this.vehicles.push(vehicle);
        return vehicle;
    }

    update(id: string, data: Partial<Vehicle>): Vehicle | undefined {
        const index = this.vehicles.findIndex((v) => v.id === id);
        if (index === -1) return undefined;
        this.vehicles[index] = { ...this.vehicles[index], ...data };
        return this.vehicles[index];
    }

    remove(id: string): boolean {
        const index = this.vehicles.findIndex((v) => v.id === id);
        if (index === -1) return false;
        this.vehicles.splice(index, 1);
        return true;
    }
}
