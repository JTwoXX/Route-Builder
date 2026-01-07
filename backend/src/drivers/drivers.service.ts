import { Injectable } from '@nestjs/common';
import { Driver } from '../common/interfaces';

@Injectable()
export class DriversService {
    private drivers: Driver[] = [
        { id: 'd1', name: 'John Smith', email: 'john@example.com', phone: '555-0101', status: 'available' },
        { id: 'd2', name: 'Jane Doe', email: 'jane@example.com', phone: '555-0102', status: 'available' },
        { id: 'd3', name: 'Mike Johnson', email: 'mike@example.com', phone: '555-0103', status: 'on_route' },
    ];

    private generateId(): string {
        return Math.random().toString(36).substring(2, 11);
    }

    findAll(): Driver[] {
        return this.drivers;
    }

    findOne(id: string): Driver | undefined {
        return this.drivers.find((d) => d.id === id);
    }

    create(data: Partial<Driver>): Driver {
        const driver: Driver = {
            id: this.generateId(),
            name: data.name || 'New Driver',
            email: data.email,
            phone: data.phone,
            vehicleId: data.vehicleId,
            status: data.status || 'offline',
        };
        this.drivers.push(driver);
        return driver;
    }

    update(id: string, data: Partial<Driver>): Driver | undefined {
        const index = this.drivers.findIndex((d) => d.id === id);
        if (index === -1) return undefined;
        this.drivers[index] = { ...this.drivers[index], ...data };
        return this.drivers[index];
    }

    remove(id: string): boolean {
        const index = this.drivers.findIndex((d) => d.id === id);
        if (index === -1) return false;
        this.drivers.splice(index, 1);
        return true;
    }
}
