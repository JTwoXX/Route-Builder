import { Injectable } from '@nestjs/common';
import { Route, Stop } from '../common/interfaces';
import { CreateRouteDto, UpdateRouteDto, OptimizeRouteDto } from './dto/route.dto';

@Injectable()
export class RoutesService {
    private routes: Route[] = [];

    private generateId(): string {
        return Math.random().toString(36).substring(2, 11);
    }

    findAll(): Route[] {
        return this.routes;
    }

    findOne(id: string): Route | undefined {
        return this.routes.find((r) => r.id === id);
    }

    create(createRouteDto: CreateRouteDto): Route {
        const now = new Date();
        const route: Route = {
            id: this.generateId(),
            name: createRouteDto.name,
            stops: createRouteDto.stops.map((s, i) => ({
                ...s,
                id: this.generateId(),
                sequence: i + 1,
            })),
            status: 'draft',
            vehicleId: createRouteDto.vehicleId,
            driverId: createRouteDto.driverId,
            scheduledDate: createRouteDto.scheduledDate,
            createdAt: now,
            updatedAt: now,
        };
        this.routes.push(route);
        return route;
    }

    update(id: string, updateRouteDto: UpdateRouteDto): Route | undefined {
        const index = this.routes.findIndex((r) => r.id === id);
        if (index === -1) return undefined;

        const existing = this.routes[index];
        const updated: Route = {
            ...existing,
            ...updateRouteDto,
            stops: updateRouteDto.stops
                ? updateRouteDto.stops.map((s, i) => ({
                    ...s,
                    id: this.generateId(),
                    sequence: i + 1,
                }))
                : existing.stops,
            updatedAt: new Date(),
        };
        this.routes[index] = updated;
        return updated;
    }

    remove(id: string): boolean {
        const index = this.routes.findIndex((r) => r.id === id);
        if (index === -1) return false;
        this.routes.splice(index, 1);
        return true;
    }

    optimize(id: string, options: OptimizeRouteDto): Route | undefined {
        const route = this.findOne(id);
        if (!route || route.stops.length < 2) return route;

        // Nearest-neighbor optimization
        const optimized: Stop[] = [];
        const remaining = [...route.stops];

        let current = remaining.shift()!;
        optimized.push({ ...current, sequence: 1 });

        while (remaining.length > 0) {
            let nearestIdx = 0;
            let nearestDist = Infinity;

            for (let i = 0; i < remaining.length; i++) {
                const dist = Math.sqrt(
                    Math.pow(remaining[i].latitude - current.latitude, 2) +
                    Math.pow(remaining[i].longitude - current.longitude, 2),
                );
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestIdx = i;
                }
            }

            current = remaining.splice(nearestIdx, 1)[0];
            optimized.push({ ...current, sequence: optimized.length + 1 });
        }

        route.stops = optimized;
        route.status = 'optimized';
        route.updatedAt = new Date();

        return route;
    }
}
