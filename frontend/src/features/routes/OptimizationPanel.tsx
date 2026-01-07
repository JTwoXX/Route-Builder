import { Settings2, RotateCcw, ArrowRight, MapPin, Clock, Gauge } from 'lucide-react';
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
        <div className="p-4 space-y-4">
            <h3 className="font-medium flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Optimization Settings
            </h3>

            {/* Optimization Type */}
            <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Optimization Type</label>
                <div className="grid grid-cols-1 gap-2">
                    {[
                        { value: 'shortest_time', label: 'Shortest Time', icon: Clock },
                        { value: 'shortest_distance', label: 'Shortest Distance', icon: Gauge },
                        { value: 'balanced', label: 'Balanced', icon: ArrowRight },
                    ].map(({ value, label, icon: Icon }) => (
                        <Button
                            key={value}
                            variant={settings.optimizationType === value ? 'default' : 'outline'}
                            size="sm"
                            className="justify-start"
                            onClick={() => setSettings({ optimizationType: value as typeof settings.optimizationType })}
                        >
                            <Icon className="h-4 w-4 mr-2" />
                            {label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Route Options */}
            <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Route Options</label>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.roundTrip}
                            onChange={(e) => setSettings({ roundTrip: e.target.checked })}
                            className="rounded border-input"
                        />
                        <RotateCcw className="h-4 w-4" />
                        Round Trip (return to start)
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.lockLastDestination}
                            onChange={(e) => setSettings({ lockLastDestination: e.target.checked })}
                            className="rounded border-input"
                        />
                        <MapPin className="h-4 w-4" />
                        Lock Last Destination
                    </label>
                </div>
            </div>

            {/* Vehicle Selection */}
            <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Assign Vehicle</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">No vehicle assigned</option>
                    {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>{v.name} ({v.type})</option>
                    ))}
                </select>
            </div>

            {/* Driver Selection */}
            <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Assign Driver</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">No driver assigned</option>
                    {drivers.filter(d => d.status === 'available').map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
            </div>

            {/* Constraints */}
            <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Constraints</label>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs text-muted-foreground">Max Stops</label>
                        <input
                            type="number"
                            placeholder="Unlimited"
                            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                            onChange={(e) => setSettings({ maxStops: e.target.value ? parseInt(e.target.value) : undefined })}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-muted-foreground">Max Distance (km)</label>
                        <input
                            type="number"
                            placeholder="Unlimited"
                            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                            onChange={(e) => setSettings({ maxDistance: e.target.value ? parseInt(e.target.value) : undefined })}
                        />
                    </div>
                </div>
            </div>

            {/* Default Service Time */}
            <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Default Stop Duration</label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min="1"
                        max="120"
                        defaultValue={settings.defaultServiceTime || 5}
                        className="w-20 rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                        onChange={(e) => setSettings({ defaultServiceTime: parseInt(e.target.value) || 5 })}
                    />
                    <span className="text-sm text-muted-foreground">minutes per stop</span>
                </div>
                <p className="text-xs text-muted-foreground">
                    Time driver spends at each delivery location
                </p>
            </div>
        </div>
    );
}
