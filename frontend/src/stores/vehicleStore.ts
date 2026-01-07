import { create } from 'zustand';
import type { Vehicle } from '@/lib/types';

const generateId = () => Math.random().toString(36).substring(2, 11);

interface VehicleState {
    vehicles: Vehicle[];
    selectedVehicleId: string | null;

    addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
    removeVehicle: (id: string) => void;
    updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
    selectVehicle: (id: string | null) => void;
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
    vehicles: [
        { id: 'v1', name: 'Delivery Van 1', type: 'van', capacityWeight: 1000, color: '#3b82f6' },
        { id: 'v2', name: 'Truck A', type: 'truck', capacityWeight: 5000, color: '#10b981' },
        { id: 'v3', name: 'Compact Car', type: 'car', capacityWeight: 200, color: '#f59e0b' },
    ],
    selectedVehicleId: null,

    addVehicle: (vehicleData) => {
        const vehicles = get().vehicles;
        const newVehicle: Vehicle = { ...vehicleData, id: generateId() };
        set({ vehicles: [...vehicles, newVehicle] });
    },

    removeVehicle: (id) => {
        set({ vehicles: get().vehicles.filter(v => v.id !== id) });
    },

    updateVehicle: (id, updates) => {
        set({
            vehicles: get().vehicles.map(v => v.id === id ? { ...v, ...updates } : v)
        });
    },

    selectVehicle: (id) => {
        set({ selectedVehicleId: id });
    },
}));
