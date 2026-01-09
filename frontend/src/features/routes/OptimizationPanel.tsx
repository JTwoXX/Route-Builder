import { RotateCcw, MapPin, Clock, Gauge, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouteStore } from '@/stores/routeStore';
import { useVehicleStore } from '@/stores/vehicleStore';
import { useDriverStore } from '@/stores/driverStore';

export function OptimizationPanel() {
    const settings = useRouteStore((s) => s.optimizationSettings);
    const setSettings = useRouteStore((s) => s.setOptimizationSettings);
    const vehicles = useVehicleStore((s) => s.vehicles);
    const drivers = useDriverStore((s) => s.drivers);

    return (
        <div className="p-2 space-y-2">
            {/* Optimization Type - Horizontal buttons */}
            <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Optimize For</label>
                <div className="flex gap-1">
                    {[
                        { value: 'shortest_time', label: 'Time', icon: Clock },
                        { value: 'shortest_distance', label: 'Distance', icon: Gauge },
                        { value: 'balanced', label: 'Balanced', icon: ArrowRight },
                    ].map(({ value, label, icon: Icon }) => (
                        <Button
                            key={value}
                            variant={settings.optimizationType === value ? 'default' : 'outline'}
                            size="sm"
                            className="flex-1 h-7 text-xs px-2"
                            onClick={() => setSettings({ optimizationType: value as typeof settings.optimizationType })}
                        >
                            <Icon className="h-3 w-3 mr-1" />
                            {label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Route Options - Inline */}
            <div className="flex gap-4">
                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.roundTrip}
                        onChange={(e) => setSettings({ roundTrip: e.target.checked })}
                        className="rounded border-input h-3 w-3"
                    />
                    <RotateCcw className="h-3 w-3" />
                    Round Trip
                </label>
                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.lockLastDestination}
                        onChange={(e) => setSettings({ lockLastDestination: e.target.checked })}
                        className="rounded border-input h-3 w-3"
                    />
                    <MapPin className="h-3 w-3" />
                    Lock Last
                </label>
            </div>

            {/* Vehicle & Driver Selection - Side by side */}
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                    <label className="text-xs text-muted-foreground">Vehicle</label>
                    <select className="w-full rounded border border-input bg-background px-2 py-1 text-xs">
                        <option value="">None</option>
                        {vehicles.map((v) => (
                            <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-0.5">
                    <label className="text-xs text-muted-foreground">Driver</label>
                    <select className="w-full rounded border border-input bg-background px-2 py-1 text-xs">
                        <option value="">None</option>
                        {drivers.filter(d => d.status === 'available').map((d) => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Constraints - All in one row */}
            <div className="grid grid-cols-3 gap-2">
                <div className="space-y-0.5">
                    <label className="text-xs text-muted-foreground">Max Stops</label>
                    <input
                        type="number"
                        placeholder="∞"
                        className="w-full rounded border border-input bg-background px-2 py-1 text-xs"
                        onChange={(e) => setSettings({ maxStops: e.target.value ? parseInt(e.target.value) : undefined })}
                    />
                </div>
                <div className="space-y-0.5">
                    <label className="text-xs text-muted-foreground">Max Dist</label>
                    <input
                        type="number"
                        placeholder="∞ km"
                        className="w-full rounded border border-input bg-background px-2 py-1 text-xs"
                        onChange={(e) => setSettings({ maxDistance: e.target.value ? parseInt(e.target.value) : undefined })}
                    />
                </div>
                <div className="space-y-0.5">
                    <label className="text-xs text-muted-foreground">Stop Time</label>
                    <div className="flex items-center">
                        <input
                            type="number"
                            min="1"
                            max="120"
                            defaultValue={settings.defaultServiceTime || 5}
                            className="w-full rounded border border-input bg-background px-2 py-1 text-xs"
                            onChange={(e) => setSettings({ defaultServiceTime: parseInt(e.target.value) || 5 })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
