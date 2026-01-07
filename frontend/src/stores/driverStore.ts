import { create } from 'zustand';
import type { Driver } from '@/lib/types';

const generateId = () => Math.random().toString(36).substring(2, 11);

interface DriverState {
    drivers: Driver[];
    selectedDriverId: string | null;

    addDriver: (driver: Omit<Driver, 'id'>) => void;
    removeDriver: (id: string) => void;
    updateDriver: (id: string, updates: Partial<Driver>) => void;
    selectDriver: (id: string | null) => void;
}

export const useDriverStore = create<DriverState>((set, get) => ({
    drivers: [
        { id: 'd1', name: 'John Smith', email: 'john@example.com', phone: '555-0101', status: 'available' },
        { id: 'd2', name: 'Jane Doe', email: 'jane@example.com', phone: '555-0102', status: 'available' },
        { id: 'd3', name: 'Mike Johnson', email: 'mike@example.com', phone: '555-0103', status: 'on_route' },
    ],
    selectedDriverId: null,

    addDriver: (driverData) => {
        const drivers = get().drivers;
        const newDriver: Driver = { ...driverData, id: generateId() };
        set({ drivers: [...drivers, newDriver] });
    },

    removeDriver: (id) => {
        set({ drivers: get().drivers.filter(d => d.id !== id) });
    },

    updateDriver: (id, updates) => {
        set({
            drivers: get().drivers.map(d => d.id === id ? { ...d, ...updates } : d)
        });
    },

    selectDriver: (id) => {
        set({ selectedDriverId: id });
    },
}));
